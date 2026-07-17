import type { BrandInfo } from "@/lib/brands";
import type { CategoryInfo, Product } from "@/lib/types";

export type BrowseCatalogPayload = {
  products: Product[];
  categories: CategoryInfo[];
  brands: BrandInfo[];
};

export const BROWSE_CATALOG_URL = "/api/catalog/browse";

let browseCatalogCache: BrowseCatalogPayload | null = null;
let browseCatalogPromise: Promise<BrowseCatalogPayload> | null = null;

export function getBrowseCatalogCache(): BrowseCatalogPayload | null {
  return browseCatalogCache;
}

export function prefetchBrowseCatalog(
  source: string = BROWSE_CATALOG_URL
): Promise<BrowseCatalogPayload> {
  return loadBrowseCatalog(source);
}

export function loadBrowseCatalog(
  source: string = BROWSE_CATALOG_URL
): Promise<BrowseCatalogPayload> {
  if (browseCatalogCache) return Promise.resolve(browseCatalogCache);
  if (!browseCatalogPromise) {
    browseCatalogPromise = fetch(source)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to load catalog");
        return response.json() as Promise<BrowseCatalogPayload>;
      })
      .then((payload) => {
        browseCatalogCache = payload;
        return payload;
      });
  }
  return browseCatalogPromise;
}
