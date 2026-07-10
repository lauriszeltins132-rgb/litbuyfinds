import type { ProductBadgeKind } from "./types";

export const BADGE_LABELS: Record<ProductBadgeKind, string> = {
  trending: "Trending",
  "editors-pick": "Editor's Pick",
  "best-value": "Best Value",
  "budget-pick": "Budget Pick",
  "top-quality": "Top Quality",
  new: "New",
  popular: "Popular",
  qc: "QC",
};

export function badgeClassName(kind: ProductBadgeKind): string {
  if (kind === "trending" || kind === "popular") {
    return "product-card-badge product-card-badge--accent";
  }
  if (kind === "editors-pick" || kind === "top-quality") {
    return "product-card-badge product-card-badge--premium";
  }
  return "product-card-badge";
}
