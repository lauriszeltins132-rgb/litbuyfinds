import { getTopProductIds } from "./analytics-store";
import { extractBrand, getBrandsFromProducts } from "./brands";
import { isHomepageFashionProduct } from "./homepage-curation";
import { getDealProducts, getAllProducts, getLatestProducts, getTrendingProducts } from "./products";
import {
  getProductQualityScore,
  isHomepageCuratedEligible,
  pickFeaturedProducts,
  sortByProductQuality,
} from "./product-quality-score";
import { getNewToday, getRecencyPool } from "./recency";
import type { Product } from "./types";

export function getUtcDayIndex(): number {
  return Math.floor(Date.now() / 86_400_000);
}

const PREMIUM_BRANDS = [
  "Nike",
  "Jordan",
  "Adidas",
  "Moncler",
  "Stone Island",
  "Chrome Hearts",
  "Arc'teryx",
  "Canada Goose",
  "Gucci",
  "Stussy",
];

function fashionPool(products: Product[]): Product[] {
  return products.filter(isHomepageFashionProduct);
}

function analyticsRankMap(limit: number): Map<string, number> {
  const map = new Map<string, number>();
  getTopProductIds(limit).forEach((id, index) => map.set(id, index));
  return map;
}

function pickPopularToday(
  limit: number,
  used: Set<string>,
  day: number
): Product[] {
  const ranks = analyticsRankMap(limit * 12);
  const byId = new Map(fashionPool(getAllProducts()).map((product) => [product.id, product]));

  const analyticsPool = [...ranks.entries()]
    .map(([id]) => byId.get(id))
    .filter((product): product is Product => !!product);

  const picked = pickFeaturedProducts(
    analyticsPool,
    limit,
    used,
    day,
    "popular-today",
    { analyticsRankById: ranks }
  );

  if (picked.length >= limit) return picked;

  const block = new Set([...used, ...picked.map((product) => product.id)]);
  const fallback = pickFeaturedProducts(
    fashionPool(getAllProducts()),
    limit - picked.length,
    block,
    day,
    "popular-today-fallback",
    { analyticsRankById: ranks }
  );

  return [...picked, ...fallback].slice(0, limit);
}

function pickPopularWeek(
  limit: number,
  used: Set<string>,
  day: number
): Product[] {
  return pickFeaturedProducts(
    fashionPool(getTrendingProducts()),
    limit,
    used,
    day,
    "popular-week"
  );
}

function pickRecentlyAdded(
  limit: number,
  used: Set<string>,
  day: number
): Product[] {
  const latest = fashionPool(getLatestProducts());
  const recentCatalog = fashionPool(getAllProducts())
    .filter(
      (product) =>
        product.group === "category" && Number(product.id) >= 2550
    )
    .sort((a, b) => Number(b.id) - Number(a.id));

  const merged: Product[] = [];
  const seen = new Set<string>();
  for (const product of [...latest, ...recentCatalog]) {
    if (seen.has(product.id)) continue;
    seen.add(product.id);
    merged.push(product);
  }

  return pickFeaturedProducts(merged, limit, used, day, "recently-added");
}

function pickAddedToday(
  limit: number,
  used: Set<string>,
  day: number
): Product[] {
  return pickFeaturedProducts(
    fashionPool(getNewToday(limit * 4)),
    limit,
    used,
    day,
    "added-today"
  );
}

function pickTopQcFinds(
  limit: number,
  used: Set<string>,
  day: number
): Product[] {
  const pool = fashionPool(getAllProducts()).filter((product) => product.qc_link);
  return pickFeaturedProducts(pool, limit, used, day, "top-qc", {
    predicate: (product) => Boolean(product.qc_link),
  });
}

function pickPopularMonth(
  limit: number,
  used: Set<string>,
  day: number
): Product[] {
  return pickFeaturedProducts(
    fashionPool(getRecencyPool()),
    limit,
    used,
    day + 3,
    "popular-month"
  );
}

function pickBudgetFinds(
  limit: number,
  used: Set<string>,
  day: number
): Product[] {
  return pickFeaturedProducts(
    fashionPool(getDealProducts(30)),
    limit,
    used,
    day,
    "budget-finds"
  );
}

function pickMostSavedWeek(
  limit: number,
  used: Set<string>,
  day: number
): Product[] {
  const ranks = analyticsRankMap(limit * 8);
  const pool = sortByProductQuality(fashionPool(getAllProducts()), { analyticsRankById: ranks });
  return pickFeaturedProducts(pool, limit, used, day, "most-saved", {
    analyticsRankById: ranks,
  });
}

function pickHighestQcRated(
  limit: number,
  used: Set<string>,
  day: number
): Product[] {
  const pool = fashionPool(getAllProducts())
    .filter((product) => product.qc_link)
    .sort(
      (a, b) =>
        getProductQualityScore(b) - getProductQualityScore(a)
    );

  return pickFeaturedProducts(pool, limit, used, day, "highest-qc");
}

function pickRisingWeek(
  limit: number,
  used: Set<string>,
  day: number
): Product[] {
  const ranks = analyticsRankMap(40);
  return pickFeaturedProducts(
    fashionPool(getTrendingProducts()),
    limit,
    used,
    day + 1,
    "rising-week",
    { analyticsRankById: ranks }
  );
}

function pickTrendingBrand(
  used: Set<string>,
  day: number
): { brand: string; products: Product[] } | null {
  const brands = getBrandsFromProducts(fashionPool(getAllProducts())).filter((brand) =>
    PREMIUM_BRANDS.some(
      (name) => name.toLowerCase() === brand.name.toLowerCase()
    )
  );

  if (brands.length === 0) return null;

  const brand = brands[day % brands.length];
  const block = new Set(used);
  const products = pickFeaturedProducts(
    fashionPool(getAllProducts()).filter(
      (product) => extractBrand(product.product_name) === brand.name
    ),
    8,
    block,
    day,
    `brand-${brand.slug}`
  );

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
  mostSavedWeek: Product[];
  highestQcRated: Product[];
  risingWeek: Product[];
  addedToday: Product[];
  trendingBrand: { brand: string; products: Product[] } | null;
  dayIndex: number;
};

/** Score-curated homepage rails — best-looking, highest-engagement products first. */
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

  const mostSavedWeek = pickMostSavedWeek(limit, used, day);
  mostSavedWeek.forEach((product) => used.add(product.id));

  const highestQcRated = pickHighestQcRated(limit, used, day);
  highestQcRated.forEach((product) => used.add(product.id));

  const risingWeek = pickRisingWeek(limit, used, day);
  risingWeek.forEach((product) => used.add(product.id));

  const addedToday = pickAddedToday(limit, used, day);
  addedToday.forEach((product) => used.add(product.id));

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
    mostSavedWeek,
    highestQcRated,
    risingWeek,
    addedToday,
    trendingBrand,
    dayIndex: day,
  };
}

/** @deprecated use popularWeek */
export function getLegacyTrendingRail(limit = 12) {
  return getHomepageRails(limit).popularWeek;
}

export { isHomepageCuratedEligible };
