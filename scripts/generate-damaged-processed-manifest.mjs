#!/usr/bin/env node
/**
 * Flags processed cutouts that should not be shown — pixel damage, hollow
 * white garments, thresholded/speckled artifacts. Alive CDN originals are
 * preferred when a cutout fails quality checks.
 */
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";
import { isMattePixel } from "./lib/catalog-matte.mjs";
import { scoreProcessedCutout } from "./lib/cutout-quality.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const mapPath = path.join(root, "src/data/processed-image-map.json");
const deadPath = path.join(root, "src/data/dead-image-urls.json");
const outPath = path.join(root, "src/data/damaged-processed-manifest.json");

const EDGE_BAND = 3;
const WHITE_FRINGE_LIMIT = 0.06;

function analyzePixelDamage(data, width, height) {
  const total = width * height;
  const edgePixels = Math.max(1, 2 * EDGE_BAND * (width + height) - 4 * EDGE_BAND * EDGE_BAND);

  let black = 0;
  let whiteEdge = 0;
  let darkEdge = 0;
  let matteEdge = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      if (r < 15 && g < 15 && b < 15) black++;

      const onEdge =
        x < EDGE_BAND ||
        y < EDGE_BAND ||
        x >= width - EDGE_BAND ||
        y >= height - EDGE_BAND;
      if (!onEdge) continue;

      if (isMattePixel(r, g, b)) matteEdge++;
      else if (r > 235 && g > 235 && b > 235) whiteEdge++;
      if (r < 48 && g < 48 && b < 48) darkEdge++;
    }
  }

  const blackRatio = black / total;
  const whiteFringeRatio = whiteEdge / edgePixels;
  const edgeDarkRatio = darkEdge / edgePixels;
  const edgeMatteRatio = matteEdge / edgePixels;
  const intentionalMatte =
    edgeMatteRatio >= 0.75 ||
    (edgeDarkRatio >= 0.88 && blackRatio >= 0.04);

  return {
    pixelDamaged:
      whiteFringeRatio >= WHITE_FRINGE_LIMIT ||
      (blackRatio > 0.04 && !intentionalMatte),
    whiteFringeRatio,
    blackRatio,
  };
}

async function main() {
  const map = JSON.parse(fs.readFileSync(mapPath, "utf8"));
  const deadUrls = new Set(
    (JSON.parse(fs.readFileSync(deadPath, "utf8")).urls ?? [])
  );

  const damagedUrls = new Set();
  const damagedPaths = new Set();
  const badCutoutUrls = new Set();
  const reasonCounts = {};
  let badWithAliveOriginal = 0;

  for (const [url, relPath] of Object.entries(map.urls ?? {})) {
    const filePath = path.join(root, "public", relPath);
    if (!fs.existsSync(filePath)) continue;

    try {
      const { data, info } = await sharp(filePath)
        .raw()
        .toBuffer({ resolveWithObject: true });
      if (info.width * info.height === 0) continue;

      const pixel = analyzePixelDamage(data, info.width, info.height);
      const quality = scoreProcessedCutout(data, info.width, info.height);

      if (pixel.pixelDamaged) {
        damagedUrls.add(url);
        damagedPaths.add(relPath);
        for (const reason of ["pixel_damage"]) {
          reasonCounts[reason] = (reasonCounts[reason] ?? 0) + 1;
        }
      }

      if (quality.bad) {
        badCutoutUrls.add(url);
        for (const reason of quality.reasons ?? []) {
          reasonCounts[reason] = (reasonCounts[reason] ?? 0) + 1;
        }
        if (!deadUrls.has(url)) {
          damagedUrls.add(url);
          badWithAliveOriginal++;
        }
      }
    } catch {
      damagedUrls.add(url);
      damagedPaths.add(relPath);
    }
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    count: damagedUrls.size,
    badCutoutCount: badCutoutUrls.size,
    badWithAliveOriginal,
    reasonCounts,
    urls: [...damagedUrls],
    paths: [...damagedPaths],
    badCutoutUrls: [...badCutoutUrls],
  };

  fs.writeFileSync(outPath, JSON.stringify(payload, null, 2));
  console.log(
    `Damaged processed manifest: ${payload.count} blocked URLs (${badWithAliveOriginal} bad cutouts w/ live CDN) → ${outPath}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
