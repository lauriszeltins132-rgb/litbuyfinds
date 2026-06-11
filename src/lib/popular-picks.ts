import { getTopProductIds } from "./analytics-store";
import { isFeaturedEligible } from "./product-media";
import {
  getAllProducts,
  getLatestProducts,
  getTrendingProducts,
} from "./products";
import type { Product } from "./types";

/** Analytics-backed popular picks; falls back to trending when data is sparse. */
export function getPopularToday(limit = 12): Product[] {
  const byId = new Map(getAllProducts().map((product) => [product.id, product]));
  const fromAnalytics = getTopProductIds(limit * 2)
    .map((id) => byId.get(id))
    .filter((product): product is Product => !!product && isFeaturedEligible(product));

  if (fromAnalytics.length >= Math.min(limit, 6)) {
    return fromAnalytics.slice(0, limit);
  }

  return getTrendingProducts()
    .filter((product) => isFeaturedEligible(product))
    .slice(0, limit);
}

export function getMonthlyHighlights(limit = 96): Product[] {
  const pool = [...getTrendingProducts(), ...getLatestProducts()];
  const seen = new Set<string>();

  return pool
    .filter((product) => {
      if (!isFeaturedEligible(product) || seen.has(product.id)) return false;
      seen.add(product.id);
      return true;
    })
    .slice(0, limit);
}
