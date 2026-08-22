"use client";

import type { Product } from "@/lib/types";
import {
  formatSaveCount,
  getProductPopularity,
  getVisibleSaveCount,
} from "@/lib/product-popularity";

type ProductSaveSignalProps = {
  product: Product;
  isSaved: boolean;
  analyticsSaves?: number;
  /** When provided, the whole signal acts as the save control. */
  onToggleSave?: () => void;
  compact?: boolean;
  className?: string;
};

/**
 * Lightweight marketplace save signal — count is deterministic + local save delta.
 */
export default function ProductSaveSignal({
  product,
  isSaved,
  analyticsSaves = 0,
  onToggleSave,
  compact = false,
  className = "",
}: ProductSaveSignalProps) {
  const count = getVisibleSaveCount(product, isSaved, analyticsSaves);
  const label = `${formatSaveCount(count)} saves`;
  const classes = [
    "product-save-signal",
    compact ? "product-save-signal--compact" : "",
    isSaved ? "product-save-signal--saved" : "",
    onToggleSave ? "product-save-signal--interactive" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (onToggleSave) {
    return (
      <button
        type="button"
        onClick={onToggleSave}
        aria-pressed={isSaved}
        aria-label={isSaved ? `Unsave · ${label}` : `Save · ${label}`}
        className={classes}
      >
        <span aria-hidden>❤️</span>
        <span>{label}</span>
      </button>
    );
  }

  return (
    <p className={classes} aria-label={label}>
      <span aria-hidden>❤️</span>
      <span>{label}</span>
    </p>
  );
}

type ProductPopularitySectionProps = {
  product: Product;
  isSaved: boolean;
  analyticsSaves?: number;
  onToggleSave: () => void;
  forceTrending?: boolean;
};

export function ProductPopularitySection({
  product,
  isSaved,
  analyticsSaves = 0,
  onToggleSave,
  forceTrending = false,
}: ProductPopularitySectionProps) {
  const popularity = getProductPopularity(product);
  const showTrending = forceTrending || popularity.trendingFind;

  return (
    <div className="product-popularity">
      <p className="product-popularity__label">Popularity</p>
      <div className="product-popularity__row">
        <ProductSaveSignal
          product={product}
          isSaved={isSaved}
          analyticsSaves={analyticsSaves}
          onToggleSave={onToggleSave}
        />
        {showTrending ? (
          <span className="product-popularity__trend">
            <span aria-hidden>🔥</span> Trending Find
          </span>
        ) : null}
      </div>
    </div>
  );
}
