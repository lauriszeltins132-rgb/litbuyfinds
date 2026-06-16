#!/usr/bin/env node
/**
 * Audits catalog titles for batch mislabels (e.g. many listings sharing "Adidas Bag").
 * Run: node scripts/audit-product-titles.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

// Dynamic import of compiled logic — duplicate minimal rules for script
const products = JSON.parse(
  fs.readFileSync(path.join(root, "src/data/products.json"), "utf8")
);

const GENERIC_TYPE =
  /^(bag|bags|backpack|shoe|shoes|sneaker|sneakers|jacket|jackets|hoodie|hoodies|hat|hats|cap|caps|tee|tees|t-shirt|belt|belts|watch|watches|glasses|sunglasses|pants|shorts|vest|vests|coat|coats|parka|boot|boots|sandals|slide|slides|runner|runners|trainer|trainers|footwear|accessories|find|set|perfume|sweater|sweaters|polo|polos)$/i;

const KNOWN_BRANDS = [
  "Nike", "Adidas", "Jordan", "Gucci", "Louis Vuitton", "Moncler", "Supreme",
  "Prada", "Dior", "Balenciaga", "Burberry", "Fendi", "Chrome Hearts",
  "New Balance", "Asics", "Converse", "Bape", "Stone Island", "Canada Goose",
  "Stussy", "Corteiz", "Amiri", "Ralph Lauren", "Lacoste", "Goyard",
];

function isGenericTwoWordTitle(name) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length !== 2) return false;
  const brand = KNOWN_BRANDS.find((b) => b.toLowerCase() === parts[0].toLowerCase());
  if (!brand) return false;
  return GENERIC_TYPE.test(parts[1]);
}

const byTitle = new Map();
for (const p of products) {
  const title = p.product_name.trim();
  if (!isGenericTwoWordTitle(title)) continue;
  const links = byTitle.get(title) ?? new Set();
  links.add(p.affiliate_link.toLowerCase());
  byTitle.set(title, links);
}

const batch = [...byTitle.entries()]
  .filter(([, links]) => links.size >= 2)
  .sort((a, b) => b[1].size - a[1].size);

console.log("=== Batch mislabel titles (shared across listings) ===\n");
console.log("Count:", batch.length);
for (const [title, links] of batch.slice(0, 30)) {
  console.log(`${links.size.toString().padStart(3)} listings — ${title}`);
}

const genericCount = products.filter((p) =>
  isGenericTwoWordTitle(p.product_name.trim())
).length;
console.log(`\nTotal generic two-word titles: ${genericCount}`);
