#!/usr/bin/env node
/**
 * Flags processed matte PNGs with damaged cutouts (>4% near-black pixels)
 * and hollow white-garment cutouts (logo-only on white field).
 * Run: node scripts/generate-damaged-processed-manifest.mjs
 */
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";
import { isMattePixel } from "./lib/catalog-matte.mjs";
import { isHollowWhiteGarmentCutout } from "./lib/hollow-cutout.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const mapPath = path.join(root, "src/data/processed-image-map.json");
const deadPath = path.join(root, "src/data/dead-image-urls.json");
const outPath = path.join(root, "src/data/damaged-processed-manifest.json");

const EDGE_BAND = 3;
const WHITE_FRINGE_LIMIT = 0.06;

function analyzeProcessedPng(data, width, height) {
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

  const pixelDamaged =
    whiteFringeRatio >= WHITE_FRINGE_LIMIT ||
    (blackRatio > 0.04 && !intentionalMatte);
  const hollow = isHollowWhiteGarmentCutout(data, width, height);

  return { pixelDamaged, hollow, whiteFringeRatio, blackRatio };
}

async function main() {
  const map = JSON.parse(fs.readFileSync(mapPath, "utf8"));
  const deadUrls = new Set(
    (JSON.parse(fs.readFileSync(deadPath, "utf8")).urls ?? [])
  );

  const damagedUrls = new Set();
  const damagedPaths = new Set();
  const hollowUrls = new Set();
  let hollowSkippedDead = 0;

  for (const [url, relPath] of Object.entries(map.urls ?? {})) {
    const filePath = path.join(root, "public", relPath);
    if (!fs.existsSync(filePath)) continue;

    try {
      const { data, info } = await sharp(filePath)
        .raw()
        .toBuffer({ resolveWithObject: true });
      const total = info.width * info.height;
      if (total === 0) continue;

      const metrics = analyzeProcessedPng(data, info.width, info.height);

      if (metrics.pixelDamaged) {
        damagedUrls.add(url);
        damagedPaths.add(relPath);
      }

      if (metrics.hollow) {
        hollowUrls.add(url);
        if (deadUrls.has(url)) {
          hollowSkippedDead++;
          continue;
        }
        damagedUrls.add(url);
      }
    } catch {
      damagedUrls.add(url);
      damagedPaths.add(relPath);
    }
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    count: damagedUrls.size,
    hollowCount: hollowUrls.size,
    hollowWithAliveOriginal: hollowUrls.size - hollowSkippedDead,
    urls: [...damagedUrls],
    paths: [...damagedPaths],
    hollowUrls: [...hollowUrls],
  };

  fs.writeFileSync(outPath, JSON.stringify(payload, null, 2));
  console.log(
    `Damaged processed manifest: ${payload.count} blocked URLs (${payload.hollowWithAliveOriginal} hollow w/ original) → ${outPath}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
