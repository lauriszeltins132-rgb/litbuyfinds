#!/usr/bin/env node
/**
 * Catalog image audit — URL validation, optional HTTP probes, white-background sampling.
 * Run: npm run audit:images
 *      npm run audit:images -- --probe
 *      npm run audit:images -- --white-bg
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ciMode = process.argv.includes("--ci");
const probeMode = process.argv.includes("--probe");
const whiteBgMode = process.argv.includes("--white-bg");
const products = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../src/data/products.json"), "utf8")
);

const ALLOWED_HOSTS = new Set([
  "i.postimg.cc",
  "postimg.cc",
  "si.geilicdn.com",
  "cbu01.alicdn.com",
  "img.alicdn.com",
  "ae01.alicdn.com",
]);

function validateUrl(raw) {
  if (!raw) return { valid: false, issue: "missing" };
  try {
    const url = new URL(raw);
    if (!ALLOWED_HOSTS.has(url.hostname.toLowerCase())) {
      return { valid: false, issue: "host" };
    }
    return { valid: true };
  } catch {
    return { valid: false, issue: "malformed" };
  }
}

async function probe(url) {
  try {
    const res = await fetch(url, { method: "HEAD", redirect: "follow" });
    return res.ok;
  } catch {
    return false;
  }
}

function isWhitePixel(r, g, b) {
  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);
  return min >= 225 && max - min <= 40;
}

async function sampleWhiteBackground(url, sharp) {
  const res = await fetch(url);
  if (!res.ok) return false;
  const buffer = Buffer.from(await res.arrayBuffer());
  const { data, info } = await sharp(buffer)
    .resize(120, 120, { fit: "inside" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height } = info;
  const corners = [
    [0, 0],
    [width - 1, 0],
    [0, height - 1],
    [width - 1, height - 1],
  ];
  let white = 0;
  for (const [x, y] of corners) {
    const i = (y * width + x) * 4;
    if (isWhitePixel(data[i], data[i + 1], data[i + 2])) white++;
  }
  return white >= 3;
}

let missing = 0;
let invalid = 0;
let valid = 0;
const invalidSamples = [];

for (const product of products) {
  const result = validateUrl(product.image);
  if (!product.image) {
    missing++;
    continue;
  }
  if (!result.valid) {
    invalid++;
    if (invalidSamples.length < 15) {
      invalidSamples.push({
        id: product.id,
        name: product.product_name,
        issue: result.issue,
      });
    }
    continue;
  }
  valid++;
}

console.log("=== LitBuy Finds Image Audit ===\n");
console.log(`Total products: ${products.length}`);
console.log(`  Valid URLs:   ${valid}`);
console.log(`  Missing:      ${missing}`);
console.log(`  Invalid URL:  ${invalid}`);

if (invalidSamples.length) {
  console.log("\nInvalid samples:");
  for (const row of invalidSamples) {
    console.log(`  - [${row.id}] ${row.name} (${row.issue})`);
  }
}

if (probeMode) {
  const sample = products
    .filter((p) => validateUrl(p.image).valid)
    .slice(0, 50);
  let dead = 0;
  for (const product of sample) {
    const ok = await probe(product.image);
    if (!ok) {
      dead++;
      console.log(`  DEAD: [${product.id}] ${product.image}`);
    }
  }
  console.log(`\nProbed ${sample.length} URLs — ${dead} failed HTTP check.`);
  if (ciMode && dead > 5) {
    console.error("\nImage probe failed.");
    process.exit(1);
  }
}

if (whiteBgMode) {
  let sharp;
  try {
    sharp = (await import("sharp")).default;
  } catch {
    console.log("\nInstall sharp to run --white-bg sampling.");
  }

  if (sharp) {
    const sample = products
      .filter((p) => validateUrl(p.image).valid)
      .slice(0, 80);
    let whiteBg = 0;
    for (const product of sample) {
      try {
        if (await sampleWhiteBackground(product.image, sharp)) whiteBg++;
      } catch {
        // skip unreadable samples
      }
    }
    const pct = ((whiteBg / sample.length) * 100).toFixed(1);
    console.log(
      `\nWhite-background sample: ${whiteBg}/${sample.length} (${pct}% of sample)`
    );
    console.log(
      "Edge-connected background removal targets these in the browser."
    );
  }
}

if (ciMode && invalid > 0) {
  console.error("\nImage audit failed: invalid image URLs in catalog.");
  process.exit(1);
}

console.log("\nDone.");
