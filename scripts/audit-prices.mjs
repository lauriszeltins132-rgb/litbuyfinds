#!/usr/bin/env node
/**
 * Full catalog price audit.
 * Run: npm run audit:prices
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ciMode = process.argv.includes("--ci");
const products = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../src/data/products.json"), "utf8")
);

const MIN_TRUSTED = 3;
const MAX_VERIFIED = 400;
const MAX_AUDIT = 5000;

function classify(price) {
  if (price === null || price === undefined || !Number.isFinite(price) || price <= 0) {
    return "missing";
  }
  if (price < MIN_TRUSTED) return "below_minimum";
  if (price > MAX_AUDIT) return "above_audit_max";
  if (price > MAX_VERIFIED) return "check_latest";
  return "exact";
}

const buckets = {
  exact: [],
  missing: [],
  below_minimum: [],
  check_latest: [],
  above_audit_max: [],
};

for (const product of products) {
  const bucket = classify(product.price);
  buckets[bucket].push(product);
}

console.log("=== LitBuy Finds Price Audit ===\n");
console.log(`Total products: ${products.length}\n`);

console.log("Summary:");
console.log(`  Exact (displayable):     ${buckets.exact.length}`);
console.log(`  Missing / null:          ${buckets.missing.length}`);
console.log(`  Below $${MIN_TRUSTED} (suspicious):  ${buckets.below_minimum.length}`);
console.log(`  Check latest ($${MAX_VERIFIED + 1}–$${MAX_AUDIT}): ${buckets.check_latest.length}`);
console.log(`  Above $${MAX_AUDIT}:            ${buckets.above_audit_max.length}`);

const placeholder = buckets.below_minimum.filter((p) => p.price <= 4);
console.log(`\n  Placeholder prices ($1–$4): ${placeholder.length}`);

function printSamples(label, items, limit = 15) {
  if (items.length === 0) return;
  console.log(`\n${label} (${items.length}):`);
  for (const p of items.slice(0, limit)) {
    console.log(`  - [${p.id}] ${p.product_name} → $${p.price}`);
  }
  if (items.length > limit) {
    console.log(`  ... and ${items.length - limit} more`);
  }
}

printSamples(`Below $${MIN_TRUSTED}`, buckets.below_minimum);
printSamples(`Above $${MAX_AUDIT}`, buckets.above_audit_max);
printSamples(`Check latest`, buckets.check_latest);
printSamples("Missing price", buckets.missing);

const jordan = products.filter(
  (p) =>
    /jordan|air force|dunk/i.test(p.product_name) &&
    p.price !== null &&
    p.price < MIN_TRUSTED
);
printSamples("Sneakers below minimum (spot check)", jordan, 10);

if (ciMode) {
  const failures = buckets.below_minimum.length + buckets.above_audit_max.length;
  if (failures > 0) {
    console.error(
      `\nPrice audit failed: ${failures} product(s) with untrusted pricing.`
    );
    process.exit(1);
  }
  console.log("\nPrice audit passed.");
}

console.log("\nDone.");
