#!/usr/bin/env node
/**
 * Re-mats flattened processed PNGs from legacy dark (#141418) to catalog sage (#EEF0E8).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { CATALOG_MATTE, replaceMattePixels } from "./lib/catalog-matte.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const processedDir = path.join(__dirname, "../public/processed");

async function main() {
  const sharp = (await import("sharp")).default;
  const files = fs.readdirSync(processedDir).filter((f) => f.endsWith(".png"));
  let done = 0;
  let changed = 0;

  for (const file of files) {
    const filePath = path.join(processedDir, file);
    const { data, info } = await sharp(filePath)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const rematted = replaceMattePixels(data);
    const diff = rematted.some((v, i) => v !== data[i]);
    if (diff) {
      await sharp(rematted, {
        raw: { width: info.width, height: info.height, channels: 4 },
      })
        .png({ compressionLevel: 9 })
        .toFile(filePath);
      changed++;
    }

    done++;
    if (done % 250 === 0) console.log(`  rematted ${done}/${files.length}...`);
  }

  console.log(
    `Done: ${done} images scanned, ${changed} updated to sage matte ${JSON.stringify(CATALOG_MATTE)}.`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
