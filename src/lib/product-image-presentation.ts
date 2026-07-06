import { isDeadImageUrl, isCatalogImageUrlDead } from "./dead-images";
import {
  getImageFillClass,
  getImageQualityScore,
  needsWhiteKnockout,
  shouldEnhanceImage,
} from "./image-quality";
import { getProductImagePlan } from "./processed-images";
import type { Product } from "./types";

export type ResolvedProductImage = {
  displaySrc: string;
  sourceUrl: string;
  score: number;
  fillClass: string;
  needsMatte: boolean;
  knockoutWhite: boolean;
  enhance: boolean;
  isProcessed: boolean;
  fallbacks: string[];
};

export function resolveProductDisplayImage(
  product: Product
): ResolvedProductImage | null {
  if (!product.image) return null;

  const sourceUrl = product.image;
  const plan = getProductImagePlan(sourceUrl);

  if (isDeadImageUrl(sourceUrl) && !plan.isProcessed) return null;

  const catalogDead = isCatalogImageUrlDead(sourceUrl);
  const displaySrc =
    catalogDead && plan.isProcessed ? plan.src : sourceUrl;

  const knockoutWhite =
    !plan.isProcessed &&
    (plan.knockoutWhite || needsWhiteKnockout(sourceUrl));

  const baseScore = getImageQualityScore(sourceUrl);
  const score =
    plan.isProcessed && plan.src.startsWith("/processed/")
      ? Math.max(58, baseScore + 12)
      : baseScore + (plan.isProcessed ? 12 : 0);

  const fallbacks = [...new Set(
    [
      plan.isProcessed ? plan.src : null,
      ...plan.fallbacks,
      sourceUrl,
    ].filter((url): url is string => Boolean(url) && url !== displaySrc)
  )];

  return {
    displaySrc,
    sourceUrl,
    score,
    fillClass: plan.isProcessed && displaySrc.startsWith("/processed/")
      ? "product-float-asset--fill-balanced"
      : getImageFillClass(sourceUrl),
    needsMatte: false,
    knockoutWhite,
    enhance:
      shouldEnhanceImage(sourceUrl) ||
      plan.isProcessed ||
      displaySrc.startsWith("/processed/"),
    isProcessed: plan.isProcessed && displaySrc.startsWith("/processed/"),
    fallbacks,
  };
}

export function passesCardDisplayGate(product: Product): boolean {
  if (!product.image) return false;
  const plan = getProductImagePlan(product.image);
  if (isDeadImageUrl(product.image) && !plan.isProcessed) return false;
  const resolved = resolveProductDisplayImage(product);
  if (!resolved) return false;
  return resolved.score >= 42;
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
