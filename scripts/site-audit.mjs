#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const products = JSON.parse(
  fs.readFileSync(path.join(root, "src/data/products.json"), "utf8")
);

const MIN_TRUSTED = 5;
const MAX_VERIFIED = 400;
const MAX_AUDIT = 5000;
const titles = new Map();

function priceStatus(price) {
  if (price === null || price === undefined || !Number.isFinite(price) || price <= 0)
    return "unavailable";
  if (price < MIN_TRUSTED) return "unavailable";
  if (price > MAX_VERIFIED) return "check_latest";
  return "exact";
}

let images = { missing: 0, valid: 0 };
let prices = {
  exact: 0,
  unavailable: 0,
  checkLatest: 0,
  nullInSource: 0,
  belowMinimum: 0,
  aboveAuditMax: 0,
};

for (const p of products) {
  if (!p.image) images.missing++;
  else images.valid++;

  if (p.price === null) prices.nullInSource++;
  if (p.price !== null && p.price > 0 && p.price < MIN_TRUSTED) {
    prices.belowMinimum++;
  }
  if (p.price !== null && p.price > MAX_AUDIT) {
    prices.aboveAuditMax++;
  }

  const status = priceStatus(p.price);
  prices[status === "check_latest" ? "checkLatest" : status]++;

  if (p.product_name) {
    const list = titles.get(p.product_name) ?? [];
    list.push(p.id);
    titles.set(p.product_name, list);
  }
}

const duplicateNames = [...titles.entries()].filter(([, ids]) => ids.length > 1).length;

console.log("=== LitBuy Finds Site Audit ===\n");
console.log("Products:", products.length);
console.log("\nImages:");
console.log(images);
console.log("\nPrices:");
console.log(prices);
console.log("\nDuplicate product names:", duplicateNames);
console.log("\nDone. For full report: curl https://litbuyfinds.io/api/catalog/audit");
