import { isDeadImageUrl } from "./dead-images";
import {
  CARD_DISPLAY_MIN_SCORE,
  getImageFillClass,
  getImageQualityScore,
} from "./image-quality";
import type { Product } from "./types";

export type ResolvedProductImage = {
  displaySrc: string;
  sourceUrl: string;
  score: number;
  fillClass: string;
  isProcessed: boolean;
  fallbacks: string[];
};

/** Always serve the catalog original on white card panels. */
export function resolveProductDisplayImage(
  product: Product
): ResolvedProductImage | null {
  if (!product.image) return null;

  const sourceUrl = product.image;
  if (isDeadImageUrl(sourceUrl)) return null;

  return {
    displaySrc: sourceUrl,
    sourceUrl,
    score: getImageQualityScore(sourceUrl),
    fillClass: getImageFillClass(sourceUrl),
    isProcessed: false,
    fallbacks: [],
  };
}

export function passesCardDisplayGate(product: Product): boolean {
  if (!product.image) return false;
  if (isDeadImageUrl(product.image)) return false;
  const resolved = resolveProductDisplayImage(product);
  if (!resolved) return false;
  return resolved.score >= CARD_DISPLAY_MIN_SCORE;
}

export function getProductVisualScore(product: Product): number {
  const resolved = resolveProductDisplayImage(product);
  let score = resolved?.score ?? 0;
  if (product.qc_link) score += 12;
  if (product.image) score += 8;
  return score;
}

export function compareProductVisualQuality(a: Product, b: Product): number {
  return getProductVisualScore(b) - getProductVisualScore(a);
}
