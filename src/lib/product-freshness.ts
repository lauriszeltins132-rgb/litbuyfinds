import { getRecencyPool } from "./recency";
import type { Product } from "./types";

let recencyRankById: Map<string, number> | null = null;

function getRecencyRank(productId: string): number | null {
  if (!recencyRankById) {
    recencyRankById = new Map(
      getRecencyPool().map((product, index) => [product.id, index])
    );
  }
  const rank = recencyRankById.get(productId);
  return rank === undefined ? null : rank;
}

/**
 * Conservative freshness labels — no fabricated dates without real timestamps.
 */
export function getProductFreshnessLabel(product: Product): string | null {
  if (product.category_slug === "latest-finds") {
    return "Added recently";
  }

  const rank = getRecencyRank(product.id);
  if (rank === null) return null;
  if (rank < 12) return "Added recently";
  if (rank < 36) return "New this week";
  if (rank < 96) return "Recently indexed";

  return null;
}
