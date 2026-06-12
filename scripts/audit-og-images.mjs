#!/usr/bin/env node
/**
 * Verifies OG banner assets and metadata coverage.
 * Run: npm run audit:og
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const bannersDir = path.join(root, "public/banners");
const OG_URL = "https://litbuyfinds.io/banners/litbuy-finds-og.jpg";

const REQUIRED_BANNERS = [
  "litbuy-finds-promo.webp",
  "litbuy-finds-modal.webp",
  "litbuy-finds-og.jpg",
  "litbuy-finds-og.png",
];

let failed = 0;

console.log("=== OG / Banner Audit ===\n");

for (const file of REQUIRED_BANNERS) {
  const full = path.join(bannersDir, file);
  if (!fs.existsSync(full)) {
    console.error(`MISSING: public/banners/${file}`);
    failed++;
  } else {
    const size = fs.statSync(full).size;
    console.log(`OK  public/banners/${file} (${Math.round(size / 1024)} KB)`);
  }
}

const seo = fs.readFileSync(path.join(root, "src/lib/seo.ts"), "utf8");
if (!seo.includes("PROMO_OG_IMAGE_URL")) {
  console.error("MISSING: seo.ts does not reference PROMO_OG_IMAGE_URL");
  failed++;
} else {
  console.log("OK  seo.ts uses PROMO_OG_IMAGE_URL");
}

const layout = fs.readFileSync(path.join(root, "src/app/layout.tsx"), "utf8");
if (!layout.includes("PROMO_OG_IMAGE_URL")) {
  console.error("MISSING: layout.tsx default OG image");
  failed++;
} else {
  console.log("OK  layout.tsx default OG image");
}

console.log(`\nOG image URL: ${OG_URL}`);
console.log(`Telegram/Discord/X: use ${OG_URL} via og:image meta tag`);

if (failed > 0) {
  console.error(`\nAudit failed (${failed} issues).`);
  process.exit(1);
}

console.log("\nAudit passed.");
