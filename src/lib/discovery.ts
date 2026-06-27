import { extractBrand, getBrandsFromProducts } from "./brands";
import { getHomepageEditorsPicks } from "./homepage-rails";
import { isFeaturedEligible } from "./product-media";
import { getProductQualityScore } from "./product-quality-score";
import { hasExactPrice } from "./pricing";
import { getDisplayBrand, validateProduct } from "./product-validation";
import { getRecentlyAddedPreview } from "./recency";
import {
  getAllProducts,
  getDealProducts,
  getLatestProducts,
  getTrendingProducts,
  products,
} from "./products";
import { getUtcDayIndex as readUtcDayIndex, getUtcWeekIndex } from "./rotation-seeds";
import type { Product } from "./types";

function qualityScore(product: Product, trendingIndex = 999): number {
  let score = getProductQualityScore(product);
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
  return getHomepageEditorsPicks(limit);
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
  return readUtcDayIndex();
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
  const week = getUtcWeekIndex();
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

function isBrowsableRelated(product: Product): boolean {
  if (!product.image) return false;
  return validateProduct(product).confidence >= 0.4;
}

function relatedScore(base: Product, candidate: Product, brand: string | null): number {
  let score = 0;
  if (candidate.category_slug === base.category_slug) score += 40;
  const candidateBrand = getDisplayBrand(candidate);
  if (brand && candidateBrand === brand) score += 35;
  if (candidate.qc_link) score += 10;
  if (candidate.image) score += 15;
  score += validateProduct(candidate).confidence * 20;
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
  const brand = getDisplayBrand(product);

  return getAllProducts()
    .filter((item) => item.id !== product.id)
    .filter(
      (item) =>
        item.category_slug === product.category_slug ||
        (brand && getDisplayBrand(item) === brand)
    )
    .filter(isBrowsableRelated)
    .sort((a, b) => relatedScore(product, b, brand) - relatedScore(product, a, brand))
    .slice(0, limit);
}

/** Broader recommendations — price band, different brand, same category family. */
export function getYouMayAlsoLike(product: Product, limit = 6): Product[] {
  const brand = getDisplayBrand(product);
  const relatedIds = new Set(getRelatedProducts(product, limit).map((p) => p.id));

  return getAllProducts()
    .filter((item) => item.id !== product.id && !relatedIds.has(item.id))
    .filter(isBrowsableRelated)
    .map((item) => ({
      item,
      score: relatedScore(product, item, null) +
        (brand && getDisplayBrand(item) !== brand ? 8 : 0) +
        (item.category_slug === product.category_slug ? 20 : 0),
    }))
    .sort((a, b) => b.score - a.score)
    .map(({ item }) => item)
    .slice(0, limit);
}

export function getMoreFromBrand(
  product: Product,
  brand: string,
  limit = 6
): Product[] {
  const blocked = new Set([
    product.id,
    ...getRelatedProducts(product, limit).map((item) => item.id),
  ]);

  return getAllProducts()
    .filter((item) => !blocked.has(item.id))
    .filter((item) => getDisplayBrand(item) === brand)
    .filter(isBrowsableRelated)
    .sort((a, b) => relatedScore(product, b, brand) - relatedScore(product, a, brand))
    .slice(0, limit);
}

export function getPopularInCategory(product: Product, limit = 6): Product[] {
  const blocked = new Set([
    product.id,
    ...getRelatedProducts(product, limit).map((item) => item.id),
  ]);

  return getAllProducts()
    .filter((item) => !blocked.has(item.id))
    .filter((item) => item.category_slug === product.category_slug)
    .filter(isBrowsableRelated)
    .sort((a, b) => relatedScore(product, b, null) - relatedScore(product, a, null))
    .slice(0, limit);
}

export function getSimilarFinds(product: Product, limit = 8): Product[] {
  const related = getRelatedProducts(product, limit);
  const alsoLike = getYouMayAlsoLike(product, limit);
  const seen = new Set<string>([product.id]);
  const merged: Product[] = [];

  for (const item of [...related, ...alsoLike]) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    merged.push(item);
    if (merged.length >= limit) break;
  }

  return merged;
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
