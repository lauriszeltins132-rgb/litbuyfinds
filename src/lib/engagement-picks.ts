import { getProductEngagementScore, getTopProductIds } from "./analytics-store";
import { isFeaturedEligible } from "./product-media";
import { getAllProducts } from "./products";
import type { Product } from "./types";

/** Server-only picks ranked by real click engagement. */
export function getEngagementPicks(limit = 12): Product[] {
  const byId = new Map(getAllProducts().map((p) => [p.id, p]));
  const fromAnalytics = getTopProductIds(limit * 3)
    .map((id) => byId.get(id))
    .filter((p): p is Product => !!p && isFeaturedEligible(p));

  if (fromAnalytics.length >= limit) {
    return fromAnalytics.slice(0, limit);
  }

  const seen = new Set(fromAnalytics.map((p) => p.id));
  const fallback = getAllProducts()
    .filter((p) => isFeaturedEligible(p) && !seen.has(p.id))
    .sort((a, b) => getProductEngagementScore(b.id) - getProductEngagementScore(a.id))
    .slice(0, limit - fromAnalytics.length);

  return [...fromAnalytics, ...fallback].slice(0, limit);
}
