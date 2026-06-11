import { getTopProductIds } from "./analytics-store";
import { isFeaturedEligible } from "./product-media";
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

function pickRotated(
  pool: Product[],
  limit: number,
  used: Set<string>,
  day: number,
  salt: string
): Product[] {
  return pool
    .filter((product) => isFeaturedEligible(product) && !used.has(product.id))
    .sort(
      (a, b) => dayHash(b.id, salt, day) - dayHash(a.id, salt, day)
    )
    .slice(0, limit);
}

function pickPopularToday(
  limit: number,
  used: Set<string>,
  day: number
): Product[] {
  const byId = new Map(getAllProducts().map((product) => [product.id, product]));
  const fromAnalytics = getTopProductIds(limit * 4)
    .map((id) => byId.get(id))
    .filter(
      (product): product is Product =>
        !!product && isFeaturedEligible(product) && !used.has(product.id)
    );

  const picked = [...fromAnalytics];
  const block = new Set([...used, ...picked.map((product) => product.id)]);

  if (picked.length < limit) {
    const pool = getAllProducts().filter(
      (product) =>
        isFeaturedEligible(product) &&
        (product.qc_link || product.category_slug === "trending-now")
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
  const trending = getTrendingProducts().filter(isFeaturedEligible);
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
  const latest = getLatestProducts().filter(isFeaturedEligible);
  const recentCatalog = getAllProducts()
    .filter(
      (product) =>
        product.group === "category" && Number(product.id) >= 2550
    )
    .filter(isFeaturedEligible)
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
  const pool = getRecencyPool().filter(isFeaturedEligible);
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
