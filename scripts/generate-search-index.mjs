#!/usr/bin/env node
/**
 * Pre-build search autocomplete index (avoids bundling products.json on the client).
 * Run: node scripts/generate-search-index.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const productsPath = path.join(root, "src/data/products.json");
const outPath = path.join(root, "src/data/search-index.json");

const POPULAR_SEARCHES = [
  "Nike", "Jordan", "Moncler", "Canada Goose",
  "Stone Island", "Bags", "Jackets", "Sneakers",
];

const BRAND_SUB_TYPES = {
  nike: [
    { label: "Nike Shoes", query: "nike shoe", priority: 95 },
    { label: "Nike Hoodies", query: "nike hoodie", priority: 90 },
    { label: "Nike Tech Fleece", query: "nike tech", priority: 88 },
    { label: "Nike Jackets", query: "nike jacket", priority: 85 },
  ],
  jordan: [
    { label: "Jordan Sneakers", query: "jordan", priority: 95 },
    { label: "Jordan 1", query: "jordan 1", priority: 92 },
    { label: "Jordan 4", query: "jordan 4", priority: 90 },
  ],
  moncler: [
    { label: "Moncler Jackets", query: "moncler jacket", priority: 95 },
    { label: "Moncler Vests", query: "moncler vest", priority: 88 },
    { label: "Moncler Hoodies", query: "moncler hoodie", priority: 85 },
  ],
};

const GENERIC_BAG_SUGGESTIONS = [
  { label: "Designer bags", query: "designer bag", priority: 82 },
  { label: "Crossbody bags", query: "crossbody bag", priority: 78 },
  { label: "Backpacks", query: "backpack", priority: 76 },
];

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function extractBrand(name) {
  const known = ["Nike", "Jordan", "Adidas", "Moncler", "Gucci", "Louis Vuitton", "Stussy", "Prada", "Dior"];
  for (const brand of known) {
    if (name.toLowerCase().includes(brand.toLowerCase())) return brand;
  }
  return null;
}

function main() {
  const products = JSON.parse(fs.readFileSync(productsPath, "utf8"));
  const items = [];

  for (const brand of POPULAR_SEARCHES) {
    items.push({
      label: brand,
      href: `/?q=${encodeURIComponent(brand)}#browse`,
      type: "query",
      keywords: brand.toLowerCase(),
      priority: 100,
    });
  }

  const brandCounts = new Map();
  for (const p of products) {
    const brand = extractBrand(p.product_name);
    if (!brand) continue;
    brandCounts.set(brand, (brandCounts.get(brand) ?? 0) + 1);
  }

  const brands = [...brandCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, slug: slugify(name), count }));

  const topBrandNames = new Set(brands.slice(0, 12).map((b) => b.name.toLowerCase()));

  for (const brand of brands) {
    const boost = topBrandNames.has(brand.name.toLowerCase()) ? 20 : 0;
    items.push({
      label: brand.name,
      href: `/brands/${brand.slug}`,
      type: "brand",
      keywords: `${brand.name} ${brand.slug}`.toLowerCase(),
      priority: 70 + Math.min(brand.count, 30) + boost,
    });

    const subs = BRAND_SUB_TYPES[brand.slug];
    if (subs) {
      for (const sub of subs) {
        const tail = sub.query.toLowerCase().replace(brand.name.toLowerCase(), "").trim();
        const pattern = tail ? new RegExp(tail.split(/\s+/).filter(Boolean).join("|"), "i") : null;
        const count = products.filter((p) => {
          const b = extractBrand(p.product_name);
          if (b?.toLowerCase() !== brand.name.toLowerCase()) return false;
          return pattern ? pattern.test(p.product_name) : true;
        }).length;
        const countLabel = count > 0 ? ` (${count} finds)` : "";
        items.push({
          label: `${sub.label}${countLabel}`,
          href: `/brands/${brand.slug}?q=${encodeURIComponent(sub.query.split(" ").slice(1).join(" ") || sub.query)}`,
          type: "brand",
          keywords: `${sub.query} ${sub.label}`.toLowerCase(),
          priority: sub.priority + boost,
        });
      }
    }
  }

  for (const bag of GENERIC_BAG_SUGGESTIONS) {
    items.push({
      label: bag.label,
      href: `/?q=${encodeURIComponent(bag.query)}#browse`,
      type: "product-type",
      keywords: bag.query.toLowerCase(),
      priority: bag.priority,
    });
  }

  const trending = products.filter((p) => p.category_slug === "trending-now").slice(0, 20);
  for (const product of trending) {
    items.push({
      label: product.product_name.slice(0, 48),
      href: `/find/${product.id}`,
      type: "query",
      keywords: product.product_name.toLowerCase(),
      priority: 65,
    });
  }

  fs.writeFileSync(
    outPath,
    JSON.stringify({ generatedAt: new Date().toISOString(), items }, null, 0)
  );
  console.log(`Search index: ${items.length} items → ${outPath}`);
}

main();
