import mobilePriority from "@/data/spreadsheet-mobile-priority.json";
import type { Product } from "./types";

/**
 * Current Mobile-tab products for /litbuy-spreadsheet only.
 * Historical /finds order stays on the shared browse catalog.
 */
const orderedIds = mobilePriority.orderedIds as string[];
const priorityProducts = mobilePriority.products as Product[];
const rank = new Map(orderedIds.map((id, index) => [id, index]));

export const SPREADSHEET_MOBILE_TAB = mobilePriority.tab;

export function spreadsheetMobileExtras(): Product[] {
  return priorityProducts;
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
 * in sheet order, then the historical catalog in its existing order.
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
