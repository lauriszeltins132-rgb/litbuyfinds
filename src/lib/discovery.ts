import { extractBrand, getBrandsFromProducts } from "./brands";
import {
  getAllProducts,
  getDealProducts,
  getLatestProducts,
  getTrendingProducts,
  products,
} from "./products";
import type { Product } from "./types";

function qualityScore(product: Product, trendingIndex = 999): number {
  let score = 0;
  if (product.image) score += 25;
  if (product.qc_link) score += 20;
  if (product.price !== null) score += 10;
  if (product.category_slug === "trending-now") score += 30 - Math.min(trendingIndex, 29);
  if (product.category_slug === "latest-finds") score += 15;
  if (product.price !== null && product.price <= 30) score += 10;
  if (product.price !== null && product.price <= 50) score += 5;
  return score;
}

export function getTrendingScore(product: Product): number {
  const trending = getTrendingProducts();
  const index = trending.findIndex((item) => item.id === product.id);
  const score = qualityScore(product, index >= 0 ? index : 999);
  return Math.min(99, Math.max(55, score));
}

export function getEditorsPicks(limit = 12): Product[] {
  const pool = [...getTrendingProducts(), ...getLatestProducts()];
  const seen = new Set<string>();

  return pool
    .filter((product) => product.image && product.qc_link)
    .filter((product) => {
      if (seen.has(product.id)) return false;
      seen.add(product.id);
      return true;
    })
    .sort((a, b) => qualityScore(b) - qualityScore(a))
    .slice(0, limit);
}

export function getHiddenGems(limit = 12): Product[] {
  const trendingIds = new Set(getTrendingProducts().slice(0, 80).map((p) => p.id));

  return getAllProducts()
    .filter(
      (product) =>
        product.group === "category" &&
        product.image &&
        product.qc_link &&
        !trendingIds.has(product.id)
    )
    .sort((a, b) => qualityScore(b) - qualityScore(a))
    .slice(0, limit);
}

export function getMostSavedPicks(limit = 12): Product[] {
  return getAllProducts()
    .filter((product) => product.image)
    .sort((a, b) => qualityScore(b) - qualityScore(a))
    .slice(0, limit);
}

/** UTC day number — stable for the entire calendar day worldwide. */
export function getUtcDayIndex(): number {
  return Math.floor(Date.now() / 86_400_000);
}

export function getDailyDropPool(): Product[] {
  return getAllProducts()
    .filter((product) => product.image)
    .sort((a, b) => Number(a.id) - Number(b.id));
}

export function getDailyDropIndex(poolLength: number): number {
  if (poolLength === 0) return 0;
  return getUtcDayIndex() % poolLength;
}

export function getDailyDrop(): Product {
  const pool = getDailyDropPool();
  if (pool.length === 0) return getAllProducts()[0];
  return pool[getDailyDropIndex(pool.length)];
}

export function getBrandSpotlight() {
  const brands = getBrandsFromProducts(products);
  const week = Math.floor(Date.now() / (1000 * 60 * 60 * 24 * 7));
  const brand = brands[week % brands.length];

  if (!brand) {
    return { brand: null, products: [] as Product[] };
  }

  const brandProducts = getAllProducts()
    .filter((product) => extractBrand(product.product_name) === brand.name)
    .filter((product) => product.image)
    .slice(0, 8);

  return { brand, products: brandProducts };
}

export function getRelatedProducts(product: Product, limit = 6): Product[] {
  const brand = extractBrand(product.product_name);

  return getAllProducts()
    .filter((item) => item.id !== product.id)
    .filter(
      (item) =>
        item.category_slug === product.category_slug ||
        (brand && extractBrand(item.product_name) === brand)
    )
    .filter((item) => item.image)
    .slice(0, limit);
}

export function getRecentlyAdded(limit = 12): Product[] {
  return getLatestProducts().slice(0, limit);
}

export function getTrendingThisWeek(limit = 12): Product[] {
  return getTrendingProducts().slice(0, limit);
}

export function getNewestFinds(limit = 12): Product[] {
  return getLatestProducts().slice(0, limit);
}

export function getBudgetFinds(limit = 12): Product[] {
  return getDealProducts(30).slice(0, limit);
}
