#!/usr/bin/env node
/**
 * Flags processed matte PNGs with damaged cutouts (>4% near-black pixels).
 * Run: node scripts/generate-damaged-processed-manifest.mjs
 */
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const mapPath = path.join(root, "src/data/processed-image-map.json");
const outPath = path.join(root, "src/data/damaged-processed-manifest.json");

const EDGE_BAND = 3;
const WHITE_FRINGE_LIMIT = 0.06;

function analyzeProcessedPng(data, width, height) {
  const total = width * height;
  const edgePixels = Math.max(1, 2 * EDGE_BAND * (width + height) - 4 * EDGE_BAND * EDGE_BAND);

  let black = 0;
  let whiteEdge = 0;
  let darkEdge = 0;

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

      if (r > 235 && g > 235 && b > 235) whiteEdge++;
      if (r < 48 && g < 48 && b < 48) darkEdge++;
    }
  }

  const blackRatio = black / total;
  const whiteFringeRatio = whiteEdge / edgePixels;
  const edgeDarkRatio = darkEdge / edgePixels;
  const intentionalMatte = edgeDarkRatio >= 0.88 && blackRatio >= 0.04;

  return {
    damaged:
      whiteFringeRatio >= WHITE_FRINGE_LIMIT ||
      (blackRatio > 0.04 && !intentionalMatte),
    whiteFringeRatio,
    edgeDarkRatio,
    blackRatio,
  };
}

async function main() {
  const map = JSON.parse(fs.readFileSync(mapPath, "utf8"));
  const damagedUrls = [];
  const damagedPaths = [];

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
      if (metrics.damaged) {
        damagedUrls.push(url);
        damagedPaths.push(relPath);
      }
    } catch {
      damagedUrls.push(url);
      damagedPaths.push(relPath);
    }
  }

  fs.writeFileSync(
    outPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        count: damagedUrls.length,
        urls: damagedUrls,
        paths: damagedPaths,
      },
      null,
      2
    )
  );

  console.log(`Damaged processed manifest: ${damagedUrls.length} URLs → ${outPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
