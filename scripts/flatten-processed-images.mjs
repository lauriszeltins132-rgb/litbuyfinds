#!/usr/bin/env node
/**
 * Flattens transparent processed PNGs onto an opaque sage matte (#EEF0E8).
 * Run after process-catalog-images or to fix existing cutouts.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const processedDir = path.join(__dirname, "../public/processed");
import { CATALOG_MATTE, flattenPixelsOntoMatte } from "./lib/catalog-matte.mjs";

async function main() {
  const sharp = (await import("sharp")).default;
  const files = fs.readdirSync(processedDir).filter((f) => f.endsWith(".png"));
  let done = 0;

  for (const file of files) {
    const filePath = path.join(processedDir, file);
    const { data, info } = await sharp(filePath)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const flat = flattenPixelsOntoMatte(data, info.width, info.height);
    await sharp(flat, {
      raw: { width: info.width, height: info.height, channels: 4 },
    })
      .png({ compressionLevel: 9 })
      .toFile(filePath);

    done++;
    if (done % 200 === 0) console.log(`  flattened ${done}...`);
  }

  console.log(`Flattened ${done} of ${files.length} processed images onto opaque matte.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
