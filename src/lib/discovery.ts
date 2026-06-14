import { extractBrand, getBrandsFromProducts } from "./brands";
import { isFeaturedEligible, isHomepageFeaturedEligible } from "./product-media";
import { hasExactPrice } from "./pricing";
import { getRecentlyAddedPreview } from "./recency";
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
  if (hasExactPrice(product.price)) score += 10;
  if (product.category_slug === "trending-now") score += 30 - Math.min(trendingIndex, 29);
  if (product.category_slug === "latest-finds") score += 15;
  if (hasExactPrice(product.price) && product.price! <= 30) score += 10;
  if (hasExactPrice(product.price) && product.price! <= 50) score += 5;
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
    .filter((product) => isHomepageFeaturedEligible(product) && product.qc_link)
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
        isFeaturedEligible(product) &&
        product.qc_link &&
        !trendingIds.has(product.id)
    )
    .sort((a, b) => qualityScore(b) - qualityScore(a))
    .slice(0, limit);
}

export function getMostSavedPicks(limit = 12): Product[] {
  return getAllProducts()
    .filter((product) => isFeaturedEligible(product))
    .sort((a, b) => qualityScore(b) - qualityScore(a))
    .slice(0, limit);
}

/** UTC day number — stable for the entire calendar day worldwide. */
export function getUtcDayIndex(): number {
  return Math.floor(Date.now() / 86_400_000);
}

export function getDailyDropPool(): Product[] {
  return getAllProducts()
    .filter((product) => isFeaturedEligible(product))
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
    .filter((product) => isFeaturedEligible(product))
    .slice(0, 8);

  return { brand, products: brandProducts };
}

function relatedScore(base: Product, candidate: Product, brand: string | null): number {
  let score = 0;
  if (candidate.category_slug === base.category_slug) score += 40;
  if (brand && extractBrand(candidate.product_name) === brand) score += 35;
  if (candidate.qc_link) score += 10;
  if (candidate.image) score += 15;
  if (
    base.price !== null &&
    candidate.price !== null &&
    Math.abs(candidate.price - base.price) <= 15
  ) {
    score += 12;
  }
  return score;
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
    .sort((a, b) => relatedScore(product, b, brand) - relatedScore(product, a, brand))
    .slice(0, limit);
}

/** Broader recommendations — price band, different brand, same category family. */
export function getYouMayAlsoLike(product: Product, limit = 6): Product[] {
  const brand = extractBrand(product.product_name);
  const relatedIds = new Set(getRelatedProducts(product, limit).map((p) => p.id));

  return getAllProducts()
    .filter((item) => item.id !== product.id && !relatedIds.has(item.id))
    .filter((item) => item.image)
    .map((item) => ({
      item,
      score: relatedScore(product, item, null) +
        (brand && extractBrand(item.product_name) !== brand ? 8 : 0) +
        (item.category_slug === product.category_slug ? 20 : 0),
    }))
    .sort((a, b) => b.score - a.score)
    .map(({ item }) => item)
    .slice(0, limit);
}

export function getRecentlyAdded(limit = 12): Product[] {
  return getRecentlyAddedPreview(limit);
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
