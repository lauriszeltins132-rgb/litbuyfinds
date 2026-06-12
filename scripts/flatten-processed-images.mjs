#!/usr/bin/env node
/**
 * Flattens transparent processed PNGs onto an opaque dark matte (#141418).
 * Run after process-catalog-images or to fix existing cutouts.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const processedDir = path.join(__dirname, "../public/processed");
const MATTE = { r: 20, g: 20, b: 24 };

function flattenPixels(data, width, height) {
  const out = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    const si = i * 4;
    const a = data[si + 3];
    if (a >= 24) {
      out[si] = data[si];
      out[si + 1] = data[si + 1];
      out[si + 2] = data[si + 2];
      out[si + 3] = 255;
    } else {
      out[si] = MATTE.r;
      out[si + 1] = MATTE.g;
      out[si + 2] = MATTE.b;
      out[si + 3] = 255;
    }
  }
  return out;
}

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

    const flat = flattenPixels(data, info.width, info.height);
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
