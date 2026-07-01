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

const BLACK_THRESHOLD = 15;
const BLACK_RATIO_LIMIT = 0.04;

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

      let black = 0;
      for (let i = 0; i < data.length; i += 4) {
        if (
          data[i] < BLACK_THRESHOLD &&
          data[i + 1] < BLACK_THRESHOLD &&
          data[i + 2] < BLACK_THRESHOLD
        ) {
          black++;
        }
      }

      if (black / total > BLACK_RATIO_LIMIT) {
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
