#!/usr/bin/env node
/**
 * Re-mats processed PNGs to white card panels (#FFFFFF) and
 * flood-fills leftover studio whites from the edges.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  CATALOG_MATTE,
  normalizeProcessedBackground,
} from "./lib/catalog-matte.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const processedDir = path.join(__dirname, "../public/processed");

async function main() {
  const sharp = (await import("sharp")).default;
  const files = fs.readdirSync(processedDir).filter((file) => file.endsWith(".png"));
  let changed = 0;

  for (const [index, file] of files.entries()) {
    const filePath = path.join(processedDir, file);
    const { data, info } = await sharp(filePath)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const repaired = normalizeProcessedBackground(
      data,
      info.width,
      info.height,
      CATALOG_MATTE
    );

    const diff = repaired.some((value, i) => value !== data[i]);
    if (diff) {
      await sharp(repaired, {
        raw: { width: info.width, height: info.height, channels: 4 },
      })
        .png({ compressionLevel: 9 })
        .toFile(filePath);
      changed++;
    }

    if ((index + 1) % 250 === 0) {
      console.log(`  repaired ${index + 1}/${files.length}...`);
    }
  }

  console.log(
    `Repaired ${changed} of ${files.length} processed images onto matte ${JSON.stringify(CATALOG_MATTE)}.`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
