/** Lightweight bridge so hero/header search updates the catalog grid immediately. */

export const CATALOG_SEARCH_EVENT = "litbuy:catalog-search";

export type CatalogSearchDetail = {
  q?: string;
  brand?: string;
};

export function dispatchCatalogSearch(detail: CatalogSearchDetail) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<CatalogSearchDetail>(CATALOG_SEARCH_EVENT, { detail })
  );
}
