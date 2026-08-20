/**
 * Products rendered per catalog page (homepage, categories, brands, deals,
 * latest/trending catalog panels, SEO list landings that use CatalogPanel).
 *
 * Lower values mean fewer image requests per view and more `?page=` pages —
 * product order, URLs, and data stay the same.
 */
export const CATALOG_PAGE_SIZE = 24;

/** Default product grid cap for discovery / SEO shell pages (no client paging). */
export const DISCOVERY_PRODUCT_LIMIT = 24;
