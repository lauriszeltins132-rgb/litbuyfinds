#!/usr/bin/env node
/**
 * Generates optimized LitBuy Finds promotional banner assets from source art.
 * Run: npm run generate:banner
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "../public/banners");
const MATTE = { r: 10, g: 10, b: 11 };

const SOURCE_CANDIDATES = [
  path.join(__dirname, "../assets/promo-banner-source.png"),
  path.join(__dirname, "../assets/promo-banner-source.jpg"),
];

async function main() {
  const sharp = (await import("sharp")).default;
  const src = SOURCE_CANDIDATES.find((p) => fs.existsSync(p));
  if (!src) {
    console.error(
      "Place source art at assets/promo-banner-source.png (or .jpg) and re-run."
    );
    process.exit(1);
  }

  fs.mkdirSync(OUT, { recursive: true });
  const pipeline = sharp(src).rotate().sharpen({ sigma: 0.8, m1: 0.5, m2: 2.5 });

  await pipeline
    .clone()
    .resize(1600, null, {
      fit: "inside",
      withoutEnlargement: false,
      kernel: sharp.kernel.lanczos3,
    })
    .webp({ quality: 92, effort: 6, smartSubsample: true })
    .toFile(path.join(OUT, "litbuy-finds-promo.webp"));

  await pipeline
    .clone()
    .resize(1200, 630, { fit: "contain", background: MATTE, kernel: sharp.kernel.lanczos3 })
    .jpeg({ quality: 92, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toFile(path.join(OUT, "litbuy-finds-og.jpg"));

  await pipeline
    .clone()
    .resize(1200, 630, { fit: "contain", background: MATTE, kernel: sharp.kernel.lanczos3 })
    .png({ compressionLevel: 9, effort: 10 })
    .toFile(path.join(OUT, "litbuy-finds-og.png"));

  await pipeline
    .clone()
    .resize(800, null, {
      fit: "inside",
      withoutEnlargement: false,
      kernel: sharp.kernel.lanczos3,
    })
    .webp({ quality: 90, effort: 6 })
    .toFile(path.join(OUT, "litbuy-finds-modal.webp"));

  console.log("Banner assets written to public/banners/");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
