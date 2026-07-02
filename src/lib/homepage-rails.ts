import { getTopProductIds } from "./analytics-store";
import { extractBrand, getBrandsFromProducts } from "./brands";
import { isHomepageFashionProduct } from "./homepage-curation";
import {
  getDealProducts,
  getAllProducts,
  getLatestProducts,
  getTrendingProducts,
} from "./products";
import { passesCardDisplayGate, resolveProductDisplayImage } from "./product-image-presentation";
import { hasExactPrice } from "./pricing";
import {
  getProductQualityScore,
  isHomepageCuratedEligible,
  pickFeaturedProducts,
  sortByProductQuality,
} from "./product-quality-score";
import { getRecencyPool } from "./recency";
import { getListingDedupeKey, dedupeListingRail } from "./listing-dedupe";
import {
  getUtcDayIndex,
  getUtcMonthIndex,
  getUtcWeekIndex,
} from "./rotation-seeds";
import type { Product } from "./types";

export { getUtcDayIndex, getUtcWeekIndex, getUtcMonthIndex } from "./rotation-seeds";

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

const ANALYTICS_MIN_PRODUCTS = 3;

function fashionPool(products: Product[]): Product[] {
  return products.filter(isHomepageFashionProduct);
}

function analyticsRankMap(limit: number): Map<string, number> {
  const map = new Map<string, number>();
  getTopProductIds(limit).forEach((id, index) => map.set(id, index));
  return map;
}

function hasMeaningfulAnalytics(ranks: Map<string, number>): boolean {
  return ranks.size >= ANALYTICS_MIN_PRODUCTS;
}

function registerRailProducts(
  products: Product[],
  used: Set<string>,
  usedListingKeys: Set<string>
): Product[] {
  const rail = dedupeListingRail(products);
  for (const product of rail) {
    used.add(product.id);
    usedListingKeys.add(getListingDedupeKey(product));
  }
  return rail;
}

function mergeUniqueProducts(...groups: Product[][]): Product[] {
  const seen = new Set<string>();
  const merged: Product[] = [];

  for (const group of groups) {
    for (const product of group) {
      if (seen.has(product.id)) continue;
      seen.add(product.id);
      merged.push(product);
    }
  }

  return merged;
}

function buildAnalyticsPool(
  ranks: Map<string, number>,
  products: Product[]
): Product[] {
  const byId = new Map(products.map((product) => [product.id, product]));
  return [...ranks.keys()]
    .map((id) => byId.get(id))
    .filter((product): product is Product => !!product);
}

function pickFeaturedOptions(
  usedListingKeys: Set<string>,
  options: Parameters<typeof pickFeaturedProducts>[5] = {}
) {
  return { ...options, usedListingKeys };
}

/** Daily — analytics when available, otherwise quality pool with daily seed. */
function pickPopularToday(
  limit: number,
  used: Set<string>,
  usedListingKeys: Set<string>,
  day: number
): Product[] {
  const ranks = analyticsRankMap(limit * 12);
  const catalog = fashionPool(getAllProducts());

  const analyticsPool = buildAnalyticsPool(ranks, catalog).filter(
    (product) => !used.has(product.id)
  );

  const qualityPool = sortByProductQuality(
    catalog.filter((product) => !used.has(product.id)),
    { analyticsRankById: ranks }
  );

  const pool = hasMeaningfulAnalytics(ranks)
    ? mergeUniqueProducts(
        analyticsPool,
        qualityPool.slice(0, limit * 6)
      )
    : qualityPool;

  return pickFeaturedProducts(pool, limit, used, day, "popular-today", {
    analyticsRankById: ranks,
    ...pickFeaturedOptions(usedListingKeys),
  });
}

/** Weekly — trending sheet + analytics views when available. */
function pickPopularWeek(
  limit: number,
  used: Set<string>,
  usedListingKeys: Set<string>,
  week: number
): Product[] {
  const ranks = analyticsRankMap(limit * 12);
  const catalog = fashionPool(getAllProducts());
  const trending = fashionPool(getTrendingProducts());
  const analyticsPool = buildAnalyticsPool(ranks, catalog);

  const pool = hasMeaningfulAnalytics(ranks)
    ? mergeUniqueProducts(
        analyticsPool,
        trending,
        sortByProductQuality(catalog, { analyticsRankById: ranks }).slice(
          0,
          limit * 6
        )
      )
    : trending.length >= limit
      ? trending
      : mergeUniqueProducts(
          trending,
          sortByProductQuality(catalog, { analyticsRankById: ranks })
        );

  return pickFeaturedProducts(pool, limit, used, week, "popular-week", {
    analyticsRankById: ranks,
    ...pickFeaturedOptions(usedListingKeys),
  });
}

/** Newest sheet imports — prefer processed mattes like trending rails. */
function pickLatestFinds(
  limit: number,
  used: Set<string>,
  usedListingKeys: Set<string>
): Product[] {
  const pool = fashionPool(getLatestProducts())
    .filter(
      (product) =>
        hasExactPrice(product.price) &&
        passesCardDisplayGate(product) &&
        !used.has(product.id) &&
        !usedListingKeys.has(getListingDedupeKey(product))
    )
    .sort((a, b) => {
      const aProcessed = resolveProductDisplayImage(a)?.isProcessed ? 1 : 0;
      const bProcessed = resolveProductDisplayImage(b)?.isProcessed ? 1 : 0;
      if (bProcessed !== aProcessed) return bProcessed - aProcessed;
      return Number(b.id) - Number(a.id);
    });

  return dedupeListingRail(pool).slice(0, limit);
}

/** Monthly — QC standouts with monthly rotation. */
function pickEditorsPicks(
  limit: number,
  used: Set<string>,
  usedListingKeys: Set<string>,
  month: number
): Product[] {
  const pool = mergeUniqueProducts(
    fashionPool(getTrendingProducts()).filter((product) => product.qc_link),
    fashionPool(getLatestProducts()).filter((product) => product.qc_link),
    fashionPool(getAllProducts()).filter((product) => product.qc_link)
  );

  return pickFeaturedProducts(pool, limit, used, month, "editors-picks", {
    predicate: (product) => Boolean(product.qc_link),
    preferEditorial: true,
    ...pickFeaturedOptions(usedListingKeys),
  });
}

/** Weekly — priced under $20 with weekly rotation. */
function pickBestUnder20(
  limit: number,
  used: Set<string>,
  usedListingKeys: Set<string>,
  week: number
): Product[] {
  return pickFeaturedProducts(
    fashionPool(getDealProducts(20)),
    limit,
    used,
    week,
    "budget-under-20",
    pickFeaturedOptions(usedListingKeys)
  );
}

function pickRecentlyAdded(
  limit: number,
  used: Set<string>,
  usedListingKeys: Set<string>,
  day: number
): Product[] {
  const latest = fashionPool(getLatestProducts());
  const recentCatalog = fashionPool(getAllProducts())
    .filter(
      (product) =>
        product.group === "category" && Number(product.id) >= 2550
    )
    .sort((a, b) => Number(b.id) - Number(a.id));

  return pickFeaturedProducts(
    mergeUniqueProducts(latest, recentCatalog),
    limit,
    used,
    day,
    "recently-added",
    pickFeaturedOptions(usedListingKeys)
  );
}

function pickTopQcFinds(
  limit: number,
  used: Set<string>,
  usedListingKeys: Set<string>,
  month: number
): Product[] {
  const pool = fashionPool(getAllProducts()).filter((product) => product.qc_link);
  return pickFeaturedProducts(pool, limit, used, month, "top-qc", {
    predicate: (product) => Boolean(product.qc_link),
    ...pickFeaturedOptions(usedListingKeys),
  });
}

function pickPopularMonth(
  limit: number,
  used: Set<string>,
  usedListingKeys: Set<string>,
  month: number
): Product[] {
  return pickFeaturedProducts(
    fashionPool(getRecencyPool()),
    limit,
    used,
    month,
    "popular-month",
    pickFeaturedOptions(usedListingKeys)
  );
}

function pickBudgetFinds(
  limit: number,
  used: Set<string>,
  usedListingKeys: Set<string>,
  week: number
): Product[] {
  return pickFeaturedProducts(
    fashionPool(getDealProducts(30)),
    limit,
    used,
    week,
    "budget-finds",
    pickFeaturedOptions(usedListingKeys)
  );
}

function pickMostSavedWeek(
  limit: number,
  used: Set<string>,
  usedListingKeys: Set<string>,
  week: number
): Product[] {
  const ranks = analyticsRankMap(limit * 8);
  const pool = sortByProductQuality(fashionPool(getAllProducts()), {
    analyticsRankById: ranks,
  });
  return pickFeaturedProducts(pool, limit, used, week, "most-saved", {
    analyticsRankById: ranks,
    ...pickFeaturedOptions(usedListingKeys),
  });
}

function pickHighestQcRated(
  limit: number,
  used: Set<string>,
  usedListingKeys: Set<string>,
  month: number
): Product[] {
  const pool = fashionPool(getAllProducts())
    .filter((product) => product.qc_link)
    .sort(
      (a, b) =>
        getProductQualityScore(b) - getProductQualityScore(a)
    );

  return pickFeaturedProducts(
    pool,
    limit,
    used,
    month,
    "highest-qc",
    pickFeaturedOptions(usedListingKeys)
  );
}

function pickRisingWeek(
  limit: number,
  used: Set<string>,
  usedListingKeys: Set<string>,
  week: number
): Product[] {
  const ranks = analyticsRankMap(40);
  return pickFeaturedProducts(
    fashionPool(getTrendingProducts()),
    limit,
    used,
    week,
    "rising-week",
    {
      analyticsRankById: ranks,
      ...pickFeaturedOptions(usedListingKeys),
    }
  );
}

function pickTrendingBrand(
  used: Set<string>,
  usedListingKeys: Set<string>,
  week: number
): { brand: string; products: Product[] } | null {
  const brands = getBrandsFromProducts(fashionPool(getAllProducts())).filter((brand) =>
    PREMIUM_BRANDS.some(
      (name) => name.toLowerCase() === brand.name.toLowerCase()
    )
  );

  if (brands.length === 0) return null;

  const brand = brands[week % brands.length];
  const block = new Set(used);
  const products = pickFeaturedProducts(
    fashionPool(getAllProducts()).filter(
      (product) => extractBrand(product.product_name) === brand.name
    ),
    8,
    block,
    week,
    `brand-${brand.slug}`,
    pickFeaturedOptions(usedListingKeys)
  );

  if (products.length === 0) return null;
  return { brand: brand.name, products };
}

export type HomepageRails = {
  popularToday: Product[];
  latestFinds: Product[];
  /** @deprecated use latestFinds */
  addedToday: Product[];
  editorsPicks: Product[];
  bestUnder20: Product[];
  popularWeek: Product[];
  recentlyAdded: Product[];
  topQcFinds: Product[];
  popularMonth: Product[];
  budgetFinds: Product[];
  mostSavedWeek: Product[];
  highestQcRated: Product[];
  risingWeek: Product[];
  trendingBrand: { brand: string; products: Product[] } | null;
  dayIndex: number;
  weekIndex: number;
  monthIndex: number;
};

/** Score-curated homepage rails with period-based rotation and deduplication. */
export function getHomepageRails(limit = 12): HomepageRails {
  const day = getUtcDayIndex();
  const week = getUtcWeekIndex();
  const month = getUtcMonthIndex();
  const used = new Set<string>();
  const usedListingKeys = new Set<string>();

  const popularToday = registerRailProducts(
    pickPopularToday(limit, used, usedListingKeys, day),
    used,
    usedListingKeys
  );

  const latestFinds = registerRailProducts(
    pickLatestFinds(limit, used, usedListingKeys),
    used,
    usedListingKeys
  );

  const editorsPicks = registerRailProducts(
    pickEditorsPicks(limit, used, usedListingKeys, month),
    used,
    usedListingKeys
  );

  const bestUnder20 = registerRailProducts(
    pickBestUnder20(limit, used, usedListingKeys, week),
    used,
    usedListingKeys
  );

  const popularWeek = registerRailProducts(
    pickPopularWeek(limit, used, usedListingKeys, week),
    used,
    usedListingKeys
  );

  const recentlyAdded = registerRailProducts(
    pickRecentlyAdded(limit, used, usedListingKeys, day),
    used,
    usedListingKeys
  );

  const topQcFinds = registerRailProducts(
    pickTopQcFinds(limit, used, usedListingKeys, month),
    used,
    usedListingKeys
  );

  const budgetFinds = registerRailProducts(
    pickBudgetFinds(limit, used, usedListingKeys, week),
    used,
    usedListingKeys
  );

  const mostSavedWeek = registerRailProducts(
    pickMostSavedWeek(limit, used, usedListingKeys, week),
    used,
    usedListingKeys
  );

  const highestQcRated = registerRailProducts(
    pickHighestQcRated(limit, used, usedListingKeys, month),
    used,
    usedListingKeys
  );

  const risingWeek = registerRailProducts(
    pickRisingWeek(limit, used, usedListingKeys, week),
    used,
    usedListingKeys
  );

  const popularMonth = registerRailProducts(
    pickPopularMonth(limit, used, usedListingKeys, month),
    used,
    usedListingKeys
  );

  let trendingBrand = pickTrendingBrand(used, usedListingKeys, week);
  if (trendingBrand) {
    const brandProducts = registerRailProducts(
      trendingBrand.products,
      used,
      usedListingKeys
    );
    trendingBrand =
      brandProducts.length > 0
        ? { ...trendingBrand, products: brandProducts }
        : null;
  }

  return {
    popularToday,
    latestFinds,
    addedToday: latestFinds,
    editorsPicks,
    bestUnder20,
    popularWeek,
    recentlyAdded,
    topQcFinds,
    popularMonth,
    budgetFinds,
    mostSavedWeek,
    highestQcRated,
    risingWeek,
    trendingBrand,
    dayIndex: day,
    weekIndex: week,
    monthIndex: month,
  };
}

/** Shared editor's picks rail — monthly rotation, optional dedup set. */
export function getHomepageEditorsPicks(
  limit = 12,
  used: Set<string> = new Set(),
  usedListingKeys: Set<string> = new Set()
): Product[] {
  return pickEditorsPicks(limit, used, usedListingKeys, getUtcMonthIndex());
}

/** @deprecated use popularWeek */
export function getLegacyTrendingRail(limit = 12) {
  return getHomepageRails(limit).popularWeek;
}

export { isHomepageCuratedEligible };
