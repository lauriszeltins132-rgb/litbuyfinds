import { getDisplayBrand } from "@/lib/product-validation";
import type { Product } from "@/lib/types";

export type ProductPopularity = {
  /** Stable catalog baseline save count (same product → same value). */
  baselineSaves: number;
  /** 0–100 relative popularity score for future ranking hooks. */
  score: number;
  /** True when the product is on a trending catalog rail/sheet. */
  trendingFind: boolean;
};

/** FNV-1a style hash — deterministic across SSR/CSR. */
export function hashProductSeed(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function unitNoise(productId: string, salt: string): number {
  return (hashProductSeed(`${productId}:${salt}`) % 10_000) / 10_000;
}

function includesBrand(haystack: string, brand: string): boolean {
  return new RegExp(`\\b${brand.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(
    haystack
  );
}

function getBrandBoost(brand: string | null, productName: string): number {
  const haystack = `${brand ?? ""} ${productName}`;

  const tierA = [
    "Nike",
    "Jordan",
    "Balenciaga",
    "Prada",
    "Moncler",
    "Chrome Hearts",
  ];
  if (tierA.some((name) => includesBrand(haystack, name))) return 110;

  const tierB = [
    "Stone Island",
    "Canada Goose",
    "Louis Vuitton",
    "Gucci",
    "Dior",
    "Supreme",
    "Stussy",
    "Stüssy",
    "Adidas",
    "Yeezy",
    "Off-White",
    "Hermes",
    "Hermès",
    "Burberry",
    "Arc'teryx",
  ];
  if (tierB.some((name) => includesBrand(haystack, name))) return 62;

  const tierC = [
    "New Balance",
    "Asics",
    "The North Face",
    "TNF",
    "Palm Angels",
    "Essentials",
    "Fear of God",
    "Gallery Dept",
    "Bape",
    "A Bathing Ape",
  ];
  if (tierC.some((name) => includesBrand(haystack, name))) return 34;

  return Math.floor(unitNoise(haystack || "unknown", "brand-fallback") * 16);
}

function getCategoryBoost(categorySlug: string, category: string): number {
  const slug = categorySlug.toLowerCase();
  const label = category.toLowerCase();

  if (slug === "trending-now" || label.includes("trending")) return 36;
  if (
    slug.includes("shoe") ||
    slug.includes("sneaker") ||
    label.includes("shoe") ||
    label.includes("sneaker")
  ) {
    return 32;
  }
  if (
    slug.includes("coat") ||
    slug.includes("jacket") ||
    label.includes("jacket") ||
    label.includes("coat") ||
    label.includes("puffer")
  ) {
    return 28;
  }
  if (slug.includes("bag") || label.includes("bag")) return 24;
  if (
    slug.includes("hoodie") ||
    label.includes("hoodie") ||
    label.includes("sweat")
  ) {
    return 20;
  }
  if (slug === "latest-finds" || label.includes("latest")) return 16;
  if (slug.includes("accessories") || label.includes("accessor")) return 8;

  return 10;
}

function isTrendingFind(product: Product): boolean {
  if (product.manual_badges?.includes("trending")) return true;
  if (product.category_slug === "trending-now") return true;
  if (/trending/i.test(product.sheet) || /trending/i.test(product.category)) {
    return true;
  }
  return false;
}

function isNewFind(product: Product): boolean {
  if (product.manual_badges?.includes("new")) return true;
  if (product.category_slug === "latest-finds") return true;
  if (/latest/i.test(product.sheet) || /new\b/i.test(product.sheet)) return true;
  return false;
}

/**
 * Deterministic marketplace-style popularity for a product.
 * Safe for SSR and client — no I/O, no random() at render time.
 */
export function getProductPopularity(product: Product): ProductPopularity {
  const brand = getDisplayBrand(product);
  const trendingFind = isTrendingFind(product);
  const brandBoost = getBrandBoost(brand, product.product_name);
  const categoryBoost = getCategoryBoost(product.category_slug, product.category);
  const qcBoost = product.qc_link ? 26 : 0;
  const trendingBoost = trendingFind ? 40 : 0;
  const newnessBoost = isNewFind(product) ? 16 : 0;
  const jitter = Math.floor(unitNoise(product.id, "saves-v1") * 27);

  const raw =
    12 + brandBoost + categoryBoost + qcBoost + trendingBoost + newnessBoost + jitter;
  const baselineSaves = Math.min(320, Math.max(12, raw));

  const score = Math.min(
    100,
    Math.round(
      (baselineSaves / 320) * 72 +
        (trendingFind ? 12 : 0) +
        (product.qc_link ? 8 : 0) +
        unitNoise(product.id, "score-v1") * 8
    )
  );

  return { baselineSaves, score, trendingFind };
}

/**
 * Catalog save count = max(deterministic baseline, real analytics/DB saves).
 * Ready to prefer live totals once a backend exists.
 */
export function getCatalogSaveCount(
  product: Product,
  analyticsOrDbSaves = 0
): number {
  const { baselineSaves } = getProductPopularity(product);
  return Math.max(baselineSaves, Math.max(0, analyticsOrDbSaves));
}

/** Visible count including this visitor's local save (+1 when saved). */
export function getVisibleSaveCount(
  product: Product,
  isSaved: boolean,
  analyticsOrDbSaves = 0
): number {
  return getCatalogSaveCount(product, analyticsOrDbSaves) + (isSaved ? 1 : 0);
}

export function formatSaveCount(count: number): string {
  return count.toLocaleString("en-US");
}
