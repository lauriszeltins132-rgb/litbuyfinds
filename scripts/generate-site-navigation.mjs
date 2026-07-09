#!/usr/bin/env node
/**
 * Lightweight nav data for client Footer (avoids bundling products.json).
 * Run: node scripts/generate-site-navigation.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const productsPath = path.join(root, "src/data/products.json");
const outPath = path.join(root, "src/data/site-navigation.json");

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function extractBrand(name) {
  const known = [
    "Nike", "Jordan", "Adidas", "Moncler", "Gucci", "Louis Vuitton",
    "Stussy", "Prada", "Dior", "Chrome Hearts", "Stone Island", "Balenciaga",
  ];
  for (const brand of known) {
    if (name.toLowerCase().includes(brand.toLowerCase())) return brand;
  }
  return null;
}

function main() {
  const products = JSON.parse(fs.readFileSync(productsPath, "utf8"));
  const categoryMap = new Map();

  for (const product of products) {
    if (product.group === "featured") continue;
    const existing = categoryMap.get(product.category_slug);
    if (existing) {
      existing.count += 1;
    } else {
      categoryMap.set(product.category_slug, {
        name: product.category,
        slug: product.category_slug,
        count: 1,
        href: `/categories/${product.category_slug}`,
      });
    }
  }

  const categoryOrder = [
    "shoes", "hoodies-and-pants", "coats-and-jackets",
    "tshirts-and-shorts", "accessories", "electronics",
  ];
  const categories = categoryOrder
    .filter((slug) => categoryMap.has(slug))
    .map((slug) => categoryMap.get(slug));

  const brandCounts = new Map();
  for (const p of products) {
    const brand = extractBrand(p.product_name);
    if (!brand) continue;
    brandCounts.set(brand, (brandCounts.get(brand) ?? 0) + 1);
  }

  const footerBrands = [...brandCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, count]) => ({
      name,
      slug: slugify(name),
      count,
    }));

  fs.writeFileSync(
    outPath,
    JSON.stringify(
      { generatedAt: new Date().toISOString(), categories, footerBrands },
      null,
      0
    )
  );
  console.log(`Site navigation → ${outPath}`);
}

main();
