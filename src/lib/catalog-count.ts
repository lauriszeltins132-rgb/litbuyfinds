import productsData from "@/data/products.json";

/** Public-facing catalog count for SEO, hero, and trust messaging */
export const PUBLIC_CATALOG_COUNT = "10,000+";

/** Actual indexed product count from dataset (internal stats) */
export function getActualCatalogCount(): number {
  return (productsData as unknown[]).length;
}

export function formatCatalogCountForSeo(): string {
  return PUBLIC_CATALOG_COUNT;
}
