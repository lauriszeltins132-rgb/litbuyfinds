import { getProductQualityBreakdown } from "./product-quality-score";
import { validateProduct } from "./product-validation";
import { hasExactPrice } from "./pricing";
import type { Product } from "./types";

export type RnScoreConfidence = "high" | "medium" | "low";

export type RnScoreResult = {
  /** 1.0–10.0 */
  score: number;
  display: string;
  confidence: RnScoreConfidence;
  /** Whether the score has enough signal to show publicly */
  show: boolean;
  /** Future manual override from catalog */
  manualOverride?: number;
};

/**
 * RN Score — conservative find quality rating derived from catalog signals.
 * Only surfaces when enough real data exists; never invents precision.
 */
export function getRnScore(product: Product): RnScoreResult {
  if (product.rn_score_override != null) {
    const score = Math.min(10, Math.max(1, product.rn_score_override));
    return {
      score,
      display: `${score.toFixed(1)}/10`,
      confidence: "high",
      show: true,
      manualOverride: score,
    };
  }

  const validation = validateProduct(product);
  const breakdown = getProductQualityBreakdown(product);
  const signalCount = [
    breakdown.imageQuality >= 60,
    breakdown.visualAppeal >= 60,
    Boolean(product.qc_link),
    breakdown.clicks > 0 || breakdown.saves > 0,
    hasExactPrice(product.price),
    validation.confidence >= 0.5,
  ].filter(Boolean).length;

  if (signalCount < 3 || breakdown.total < 68) {
    return {
      score: 0,
      display: "",
      confidence: "low",
      show: false,
    };
  }

  const raw = breakdown.total / 10;
  const score = Math.round(raw * 10) / 10;
  const confidence: RnScoreConfidence =
    signalCount >= 5 && breakdown.total >= 78
      ? "high"
      : signalCount >= 4
        ? "medium"
        : "low";

  return {
    score,
    display: `${score.toFixed(1)}/10`,
    confidence,
    show: score >= 7.2,
  };
}
