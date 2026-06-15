import { getTopProductIds, getProductEngagementScore } from "./analytics-store";
import { getPremiumBrandBoost } from "./curation";
import { isHomepageFeaturedEligible } from "./product-media";
import { validateProduct } from "./product-validation";
import {
  getAllProducts,
  getLatestProducts,
  getTrendingProducts,
} from "./products";
import { getRecencyPool } from "./recency";
import type { Product } from "./types";

export function getUtcDayIndex(): number {
  return Math.floor(Date.now() / 86_400_000);
}

function dayHash(id: string, salt: string, day: number): number {
  const s = `${salt}:${day}:${id}`;
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const LOW_PRIORITY_PATTERN =
  /\b(hat|cap|beanie|beret|scarf|belt|glove|sock)\b/i;

function isPopularTodayCandidate(product: Product): boolean {
  if (!isHomepageFeaturedEligible(product)) return false;

  const boost = getPremiumBrandBoost(product.product_name);
  const engagement = getProductEngagementScore(product.id);
  const isLowPriority = LOW_PRIORITY_PATTERN.test(product.product_name);

  if (isLowPriority && boost < 85 && engagement < 2) return false;
  return true;
}

function pickRotated(
  pool: Product[],
  limit: number,
  used: Set<string>,
  day: number,
  salt: string
): Product[] {
  return pool
    .filter(
      (product) =>
        isPopularTodayCandidate(product) && !used.has(product.id)
    )
    .sort(
      (a, b) => dayHash(b.id, salt, day) - dayHash(a.id, salt, day)
    )
    .slice(0, limit);
}

function popularityScore(product: Product, analyticsRank: number): number {
  const validation = validateProduct(product);
  const engagement = getProductEngagementScore(product.id);
  let score = 0;

  score += engagement * 12;
  score += getPremiumBrandBoost(product.product_name);
  score += validation.confidence * 30;
  if (product.qc_link) score += 10;
  if (analyticsRank >= 0) score += Math.max(0, 40 - analyticsRank * 2);
  if (product.category_slug === "shoes") score += 15;
  if (product.category_slug === "coats-and-jackets") score += 12;
  if (LOW_PRIORITY_PATTERN.test(product.product_name)) score -= 25;

  return score;
}

function pickPopularToday(
  limit: number,
  used: Set<string>,
  day: number
): Product[] {
  const byId = new Map(getAllProducts().map((product) => [product.id, product]));
  const topIds = getTopProductIds(limit * 8);

  const fromAnalytics = topIds
    .map((id, index) => ({ product: byId.get(id), index }))
    .filter(
      (entry): entry is { product: Product; index: number } =>
        !!entry.product &&
        isPopularTodayCandidate(entry.product) &&
        !used.has(entry.product.id)
    )
    .sort(
      (a, b) =>
        popularityScore(b.product, b.index) - popularityScore(a.product, a.index)
    )
    .map((entry) => entry.product);

  const picked = [...fromAnalytics];
  const block = new Set([...used, ...picked.map((product) => product.id)]);

  if (picked.length < limit) {
    const pool = getAllProducts()
      .filter(
        (product) =>
          isPopularTodayCandidate(product) &&
          (getPremiumBrandBoost(product.product_name) >= 80 ||
            product.qc_link ||
            product.category_slug === "trending-now" ||
            product.category_slug === "shoes")
      )
      .sort(
        (a, b) =>
          popularityScore(b, 99) +
          dayHash(b.id, "popular-today", day) * 0.001 -
          (popularityScore(a, 99) +
            dayHash(a.id, "popular-today", day) * 0.001)
      );
    picked.push(
      ...pickRotated(pool, limit - picked.length, block, day, "popular-today")
    );
  }

  return picked.slice(0, limit);
}

function pickTrending(
  limit: number,
  used: Set<string>,
  day: number
): Product[] {
  const trending = getTrendingProducts().filter(isPopularTodayCandidate);
  const stride = Math.max(1, Math.floor(trending.length / 6));
  const offset = (day % 6) * stride;
  const rotated = [...trending.slice(offset), ...trending.slice(0, offset)];
  return pickRotated(rotated, limit, used, day, "trending-week");
}

function pickNewThisWeek(
  limit: number,
  used: Set<string>,
  day: number
): Product[] {
  const latest = getLatestProducts().filter(isHomepageFeaturedEligible);
  const recentCatalog = getAllProducts()
    .filter(
      (product) =>
        product.group === "category" && Number(product.id) >= 2550
    )
    .filter(isHomepageFeaturedEligible)
    .sort((a, b) => Number(b.id) - Number(a.id));

  const merged: Product[] = [];
  const seen = new Set<string>();
  for (const product of [...latest, ...recentCatalog]) {
    if (seen.has(product.id)) continue;
    seen.add(product.id);
    merged.push(product);
  }

  const window = 48;
  const maxOffset = Math.max(1, merged.length - window);
  const offset = (day * 7) % maxOffset;
  const slice = merged.slice(offset, offset + window);

  return pickRotated(slice, limit, used, day, "new-week");
}

function pickNewThisMonth(
  limit: number,
  used: Set<string>,
  day: number
): Product[] {
  const pool = getRecencyPool().filter(isHomepageFeaturedEligible);
  const window = 96;
  const maxOffset = Math.max(1, pool.length - window);
  const offset = (day * 11) % maxOffset;
  const slice = pool.slice(offset, offset + window);

  return pickRotated(slice, limit, used, day + 3, "new-month");
}

export type HomepageRails = {
  popularToday: Product[];
  trending: Product[];
  newThisWeek: Product[];
  newThisMonth: Product[];
  dayIndex: number;
};

/** Deduplicated homepage rails with daily deterministic rotation. */
export function getHomepageRails(limit = 12): HomepageRails {
  const day = getUtcDayIndex();
  const used = new Set<string>();

  const popularToday = pickPopularToday(limit, used, day);
  popularToday.forEach((product) => used.add(product.id));

  const trending = pickTrending(limit, used, day);
  trending.forEach((product) => used.add(product.id));

  const newThisWeek = pickNewThisWeek(limit, used, day);
  newThisWeek.forEach((product) => used.add(product.id));

  const newThisMonth = pickNewThisMonth(limit, used, day);

  return {
    popularToday,
    trending,
    newThisWeek,
    newThisMonth,
    dayIndex: day,
  };
}
