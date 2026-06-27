import { getTopProductIds } from "./analytics-store";
import { isFeaturedEligible } from "./product-media";
import {
  pickFeaturedProducts,
  sortByProductQuality,
} from "./product-quality-score";
import { getAllProducts } from "./products";
import { getUtcDayIndex } from "./rotation-seeds";
import type { Product } from "./types";

/** Server-only picks ranked by product quality score and engagement. */
export function getEngagementPicks(limit = 12): Product[] {
  const byId = new Map(getAllProducts().map((p) => [p.id, p]));
  const ranks = new Map<string, number>();
  getTopProductIds(limit * 6).forEach((id, index) => ranks.set(id, index));

  const analyticsPool = [...ranks.keys()]
    .map((id) => byId.get(id))
    .filter((p): p is Product => !!p && isFeaturedEligible(p));

  const picked = pickFeaturedProducts(
    analyticsPool.length > 0 ? analyticsPool : getAllProducts(),
    limit,
    new Set(),
    getUtcDayIndex(),
    "engagement-picks",
    { analyticsRankById: ranks }
  );

  if (picked.length >= limit) return picked;

  const seen = new Set(picked.map((p) => p.id));
  const fallback = sortByProductQuality(
    getAllProducts().filter((p) => isFeaturedEligible(p) && !seen.has(p.id))
  ).slice(0, limit - picked.length);

  return [...picked, ...fallback].slice(0, limit);
}
