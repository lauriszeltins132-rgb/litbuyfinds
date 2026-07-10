import { getTrendingScore, getEditorsPicks } from "./discovery";
import { hasExactPrice } from "./pricing";
import { getProductQualityBreakdown } from "./product-quality-score";
import { getRecencyPool } from "./recency";
import { BADGE_LABELS, badgeClassName } from "./product-badge-ui";
import type { Product, ProductBadgeKind } from "./types";

export type ProductBadge = {
  kind: ProductBadgeKind;
  label: string;
  priority: number;
};

export { badgeClassName };

let editorsPickIds: Set<string> | null = null;

function getEditorsPickIds(): Set<string> {
  if (!editorsPickIds) {
    editorsPickIds = new Set(getEditorsPicks(48).map((product) => product.id));
  }
  return editorsPickIds;
}

let popularIds: Set<string> | null = null;

function getPopularIds(): Set<string> {
  if (!popularIds) {
    popularIds = new Set(
      getEditorsPicks(48)
        .filter((product) => getTrendingScore(product) >= 62)
        .slice(0, 24)
        .map((product) => product.id)
    );
  }
  return popularIds;
}

let recentIds: Set<string> | null = null;

function getRecentIds(): Set<string> {
  if (!recentIds) {
    recentIds = new Set(getRecencyPool().slice(0, 36).map((product) => product.id));
  }
  return recentIds;
}

type BadgeOptions = {
  showTrendingScore?: boolean;
  maxBadges?: number;
  /** Future: manual overrides from catalog */
  manualBadges?: ProductBadgeKind[];
};

export function getProductBadges(
  product: Product,
  options: BadgeOptions = {}
): ProductBadge[] {
  const maxBadges = options.maxBadges ?? 2;
  const badges: ProductBadge[] = [];
  const heat = getTrendingScore(product);
  const breakdown = getProductQualityBreakdown(product);

  if (product.qc_link) {
    badges.push({ kind: "qc", label: BADGE_LABELS.qc, priority: 6 });
  }

  if (options.manualBadges?.length) {
    for (const kind of options.manualBadges) {
      badges.push({ kind, label: BADGE_LABELS[kind], priority: 0 });
    }
  } else if (product.manual_badges?.length) {
    for (const kind of product.manual_badges) {
      badges.push({ kind, label: BADGE_LABELS[kind], priority: 0 });
    }
  }

  if (getEditorsPickIds().has(product.id)) {
    badges.push({
      kind: "editors-pick",
      label: BADGE_LABELS["editors-pick"],
      priority: 1,
    });
  }

  const trendingThreshold = options.showTrendingScore ? 68 : 74;
  if (heat >= trendingThreshold) {
    badges.push({ kind: "trending", label: BADGE_LABELS.trending, priority: 2 });
  }

  if (getPopularIds().has(product.id)) {
    badges.push({ kind: "popular", label: BADGE_LABELS.popular, priority: 3 });
  }

  if (
    product.category_slug === "latest-finds" ||
    getRecentIds().has(product.id)
  ) {
    badges.push({ kind: "new", label: BADGE_LABELS.new, priority: 4 });
  }

  if (hasExactPrice(product.price)) {
    if (product.price! <= 20) {
      badges.push({
        kind: "budget-pick",
        label: BADGE_LABELS["budget-pick"],
        priority: 5,
      });
    } else if (
      product.price! <= 45 &&
      breakdown.total >= 74 &&
      product.qc_link
    ) {
      badges.push({
        kind: "best-value",
        label: BADGE_LABELS["best-value"],
        priority: 5,
      });
    }
  }

  if (breakdown.total >= 84 && product.qc_link && product.image) {
    badges.push({
      kind: "top-quality",
      label: BADGE_LABELS["top-quality"],
      priority: 7,
    });
  }

  const seen = new Set<ProductBadgeKind>();
  return badges
    .sort((a, b) => a.priority - b.priority)
    .filter((badge) => {
      if (seen.has(badge.kind)) return false;
      seen.add(badge.kind);
      return true;
    })
    .slice(0, maxBadges);
}
