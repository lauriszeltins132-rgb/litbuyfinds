import productsData from "@/data/products.json";
import { PUBLIC_CATALOG_COUNT } from "./catalog-count-public";

export { PUBLIC_CATALOG_COUNT };

/** Actual indexed product count from dataset (internal stats) */
export function getActualCatalogCount(): number {
  return (productsData as unknown[]).length;
}

export function formatCatalogCountForSeo(): string {
  return PUBLIC_CATALOG_COUNT;
}
