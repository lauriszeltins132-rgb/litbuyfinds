import mobilePriority from "@/data/spreadsheet-mobile-priority.json";
import type { Product } from "./types";

/**
 * Current Mobile-tab products.
 * `orderedIds` stays in sheet order (row 1 → row 129).
 * Display priority is the reverse: the newest rows lead.
 * Historical /finds order stays on the shared browse catalog.
 */
const orderedIds = mobilePriority.orderedIds as string[];
const priorityProducts = mobilePriority.products as Product[];
const productsById = new Map(
  priorityProducts.map((product) => [product.id, product])
);
const rank = new Map(
  orderedIds.map((id, index) => [id, orderedIds.length - 1 - index])
);

export const SPREADSHEET_MOBILE_TAB = mobilePriority.tab;

export function spreadsheetMobileExtras(): Product[] {
  return priorityProducts;
}

/** Mobile products from the newest sheet row to the earliest. */
export function spreadsheetMobileProductsNewestFirst(): Product[] {
  const newest: Product[] = [];
  for (let index = orderedIds.length - 1; index >= 0; index -= 1) {
    const product = productsById.get(orderedIds[index]);
    if (product) newest.push(product);
  }
  return newest;
}

/** Append Mobile products that are not already in the shared browse catalog. */
export function mergeSpreadsheetMobileProducts(catalog: Product[]): Product[] {
  const seen = new Set(catalog.map((product) => product.id));
  const extras = priorityProducts.filter((product) => !seen.has(product.id));
  if (extras.length === 0) return catalog;
  return [...catalog, ...extras];
}

/**
 * Featured order on /litbuy-spreadsheet: every current Mobile product first,
 * newest sheet row first, then the historical catalog in its existing order.
 */
export function orderSpreadsheetMobileFirst(products: Product[]): Product[] {
  const head: Product[] = [];
  const tail: Product[] = [];
  for (const product of products) {
    if (rank.has(product.id)) head.push(product);
    else tail.push(product);
  }
  head.sort(
    (a, b) => (rank.get(a.id) ?? 0) - (rank.get(b.id) ?? 0)
  );
  return [...head, ...tail];
}
