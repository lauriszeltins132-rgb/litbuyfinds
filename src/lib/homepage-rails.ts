import { getTopProductIds, getProductEngagementScore } from "./analytics-store";
import { extractBrand, getBrandsFromProducts } from "./brands";
import { getPremiumBrandBoost } from "./curation";
import { getDealProducts, getAllProducts, getLatestProducts, getTrendingProducts } from "./products";
import { isHomepageFeaturedEligible } from "./product-media";
import { validateProduct } from "./product-validation";
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

const PREMIUM_BRANDS = [
  "Nike",
  "Jordan",
  "Adidas",
  "Moncler",
  "Stone Island",
  "Arc'teryx",
  "Canada Goose",
];

function isRailCandidate(product: Product): boolean {
  if (!isHomepageFeaturedEligible(product)) return false;
  if (validateProduct(product).confidence < 0.45) return false;

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
    .filter((product) => isRailCandidate(product) && !used.has(product.id))
    .sort((a, b) => dayHash(b.id, salt, day) - dayHash(a.id, salt, day))
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
  const topIds = getTopProductIds(limit * 10);

  const fromAnalytics = topIds
    .map((id, index) => ({ product: byId.get(id), index }))
    .filter(
      (entry): entry is { product: Product; index: number } =>
        !!entry.product &&
        isRailCandidate(entry.product) &&
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
          isRailCandidate(product) &&
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

function pickPopularWeek(
  limit: number,
  used: Set<string>,
  day: number
): Product[] {
  const trending = getTrendingProducts().filter(isRailCandidate);
  const stride = Math.max(1, Math.floor(trending.length / 7));
  const offset = (day % 7) * stride;
  const rotated = [...trending.slice(offset), ...trending.slice(0, offset)];
  return pickRotated(rotated, limit, used, day, "popular-week");
}

function pickRecentlyAdded(
  limit: number,
  used: Set<string>,
  day: number
): Product[] {
  const latest = getLatestProducts().filter(isRailCandidate);
  const recentCatalog = getAllProducts()
    .filter(
      (product) =>
        product.group === "category" && Number(product.id) >= 2550
    )
    .filter(isRailCandidate)
    .sort((a, b) => Number(b.id) - Number(a.id));

  const merged: Product[] = [];
  const seen = new Set<string>();
  for (const product of [...latest, ...recentCatalog]) {
    if (seen.has(product.id)) continue;
    seen.add(product.id);
    merged.push(product);
  }

  const window = 56;
  const maxOffset = Math.max(1, merged.length - window);
  const offset = (day * 5) % maxOffset;
  const slice = merged.slice(offset, offset + window);

  return pickRotated(slice, limit, used, day, "recently-added");
}

function pickTopQcFinds(
  limit: number,
  used: Set<string>,
  day: number
): Product[] {
  const pool = getAllProducts()
    .filter(
      (product) =>
        product.qc_link && isRailCandidate(product) && !used.has(product.id)
    )
    .sort(
      (a, b) =>
        popularityScore(b, 50) +
        dayHash(b.id, "top-qc", day) * 0.001 -
        (popularityScore(a, 50) + dayHash(a.id, "top-qc", day) * 0.001)
    );

  return pickRotated(pool, limit, used, day, "top-qc");
}

function pickPopularMonth(
  limit: number,
  used: Set<string>,
  day: number
): Product[] {
  const pool = getRecencyPool().filter(isRailCandidate);
  const window = 120;
  const maxOffset = Math.max(1, pool.length - window);
  const offset = (day * 13) % maxOffset;
  const slice = pool.slice(offset, offset + window);

  return pickRotated(slice, limit, used, day + 3, "popular-month");
}

function pickBudgetFinds(
  limit: number,
  used: Set<string>,
  day: number
): Product[] {
  const pool = getDealProducts(30).filter(
    (product) => isRailCandidate(product) && !used.has(product.id)
  );
  return pickRotated(pool, limit, used, day, "budget-finds");
}

function pickTrendingBrand(
  used: Set<string>,
  day: number
): { brand: string; products: Product[] } | null {
  const brands = getBrandsFromProducts(getAllProducts()).filter((brand) =>
    PREMIUM_BRANDS.some(
      (name) => name.toLowerCase() === brand.name.toLowerCase()
    )
  );

  if (brands.length === 0) return null;

  const brand = brands[day % brands.length];
  const products = getAllProducts()
    .filter(
      (product) =>
        extractBrand(product.product_name) === brand.name &&
        isRailCandidate(product) &&
        !used.has(product.id)
    )
    .sort(
      (a, b) =>
        popularityScore(b, 80) +
        dayHash(b.id, `brand-${brand.slug}`, day) * 0.001 -
        (popularityScore(a, 80) +
          dayHash(a.id, `brand-${brand.slug}`, day) * 0.001)
    )
    .slice(0, 8);

  if (products.length === 0) return null;
  return { brand: brand.name, products };
}

export type HomepageRails = {
  popularToday: Product[];
  popularWeek: Product[];
  recentlyAdded: Product[];
  topQcFinds: Product[];
  popularMonth: Product[];
  budgetFinds: Product[];
  trendingBrand: { brand: string; products: Product[] } | null;
  dayIndex: number;
};

/** Deduplicated homepage rails — each section uses separate logic. */
export function getHomepageRails(limit = 12): HomepageRails {
  const day = getUtcDayIndex();
  const used = new Set<string>();

  const popularToday = pickPopularToday(limit, used, day);
  popularToday.forEach((product) => used.add(product.id));

  const popularWeek = pickPopularWeek(limit, used, day);
  popularWeek.forEach((product) => used.add(product.id));

  const recentlyAdded = pickRecentlyAdded(limit, used, day);
  recentlyAdded.forEach((product) => used.add(product.id));

  const topQcFinds = pickTopQcFinds(limit, used, day);
  topQcFinds.forEach((product) => used.add(product.id));

  const budgetFinds = pickBudgetFinds(limit, used, day);
  budgetFinds.forEach((product) => used.add(product.id));

  const popularMonth = pickPopularMonth(limit, used, day);
  popularMonth.forEach((product) => used.add(product.id));

  const trendingBrand = pickTrendingBrand(used, day);
  trendingBrand?.products.forEach((product) => used.add(product.id));

  return {
    popularToday,
    popularWeek,
    recentlyAdded,
    topQcFinds,
    popularMonth,
    budgetFinds,
    trendingBrand,
    dayIndex: day,
  };
}

/** @deprecated use popularWeek */
export function getLegacyTrendingRail(limit = 12) {
  return getHomepageRails(limit).popularWeek;
}
