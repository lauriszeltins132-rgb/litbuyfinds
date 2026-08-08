#!/usr/bin/env node
/**
 * Merge newest rows from the LitBuy spreadsheet "Latest Finds" tab into
 * src/data/products.json without removing existing products.
 *
 * Run: npm run merge:latest-finds
 */
import {
  buildCatalogProduct,
  canonicalLink,
  dedupeByLink,
  enrichPriceFromGviz,
  fetchGvizPriceQueues,
  fetchSheetHtml,
  loadProducts,
  nextProductId,
  parseSheetHtml,
  saveProducts,
  validateImportRow,
} from "./spreadsheet-import-shared.mjs";

const LATEST_FINDS_GID = "1185828767";
const SHEET_META = {
  category: "Latest Finds",
  slug: "latest-finds",
  group: "featured",
  sheet: "🔍Latest Finds 🔍",
};

async function main() {
  console.log("Fetching Latest Finds sheet model…");
  const [html, priceQueues] = await Promise.all([
    fetchSheetHtml(LATEST_FINDS_GID),
    fetchGvizPriceQueues(SHEET_META.sheet),
  ]);

  const parsed = dedupeByLink(parseSheetHtml(html))
    .map((row) => ({
      ...row,
      price: enrichPriceFromGviz(row, priceQueues),
    }))
    .filter((row) => validateImportRow(row).ok);

  console.log(`  Parsed ${parsed.length} row-aligned products`);

  const existing = loadProducts();
  const existingLinks = new Set(
    existing.map((product) => canonicalLink(product.affiliate_link))
  );

  const candidates = parsed.filter(
    (row) => !existingLinks.has(canonicalLink(row.affiliate_link))
  );

  if (candidates.length === 0) {
    console.log("\nNo new Latest Finds products to add.");
    return;
  }

  let idCounter = Number(nextProductId(existing));
  const merged = [
    ...existing,
    ...candidates.map((row) =>
      buildCatalogProduct(row, SHEET_META, String(idCounter++))
    ),
  ];

  saveProducts(merged);

  console.log(`\nAdded ${candidates.length} new Latest Finds products.`);
  console.log(`  Catalog total: ${merged.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
