import productsData from "@/data/products.json";
import { filterBrowsableProducts } from "./catalog-filters";
import { formatSyncedTimestamp } from "./catalog-meta";
import { getBrandsFromProducts } from "./brands";
import { passesCardDisplayGate } from "./product-image-presentation";
import type { Product } from "./types";

export type FindsAuthorityStats = {
  totalFinds: number;
  totalFindsLabel: string;
  qcFinds: number;
  qcFindsLabel: string;
  brandCount: number;
  categoryCount: number;
  newTodayCount: number;
  lastSyncLabel: string;
};

let cachedStats: FindsAuthorityStats | null = null;

function computeFindsAuthorityStats(): FindsAuthorityStats {
  const catalog = filterBrowsableProducts(productsData as Product[]).filter(
    (product) => product.image && passesCardDisplayGate(product)
  );
  const withQc = catalog.filter((product) => Boolean(product.qc_link)).length;
  const categorySlugs = new Set(catalog.map((product) => product.category_slug));
  const newTodayCount = catalog.filter(
    (product) => product.category_slug === "latest-finds"
  ).length;

  return {
    totalFinds: catalog.length,
    totalFindsLabel: catalog.length.toLocaleString(),
    qcFinds: withQc,
    qcFindsLabel: withQc.toLocaleString(),
    brandCount: getBrandsFromProducts(catalog).length,
    categoryCount: categorySlugs.size,
    newTodayCount,
    lastSyncLabel: formatSyncedTimestamp(),
  };
}

/** Real catalog stats for trust copy — never inflated. */
export function getFindsAuthorityStats(): FindsAuthorityStats {
  cachedStats ??= computeFindsAuthorityStats();
  return cachedStats;
}

/** Primary discovery hub links — use on homepage and authority sections. */
export const FINDS_DATABASE_HUB_LINKS = [
  { href: "/latest-finds", label: "Latest finds" },
  { href: "/litbuy-spreadsheet", label: "LitBuy spreadsheet" },
  { href: "/finds", label: "Finds hub" },
  { href: "/sneaker-finds", label: "Sneaker finds" },
  { href: "/clothing-finds", label: "Clothing finds" },
  { href: "/streetwear-finds", label: "Streetwear finds" },
  { href: "/hoodie-finds", label: "Hoodie finds" },
  { href: "/jacket-finds", label: "Jacket finds" },
  { href: "/best-rep-finds", label: "Best rep finds" },
  { href: "/litbuy-qc", label: "QC product database" },
  { href: "/brands", label: "Brand finds" },
  { href: "/categories", label: "Category database" },
] as const;

/** Maps catalog category slugs to dedicated find landing pages. */
export const CATEGORY_TO_FINDS_PAGE: Record<string, string> = {
  shoes: "/sneaker-finds",
  "hoodies-and-pants": "/hoodie-finds",
  "coats-and-jackets": "/jacket-finds",
  "tshirts-and-shorts": "/clothing-finds",
  accessories: "/bag-finds",
  "latest-finds": "/latest-finds",
  "trending-now": "/trending",
};

export function getCategoryFindsPagePath(categorySlug: string): string | null {
  return CATEGORY_TO_FINDS_PAGE[categorySlug] ?? null;
}

export function getFindsDatabaseSummary(): string {
  const stats = getFindsAuthorityStats();
  return `${stats.totalFindsLabel} indexed rep finds with ${stats.qcFindsLabel} QC-linked listings across ${stats.brandCount} brands and ${stats.categoryCount} categories — updated ${stats.lastSyncLabel}.`;
}
