import { isDeadImageUrl } from "./dead-images";
import {
  getImageFillClass,
  getImageQualityScore,
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
  enhance: boolean;
  isProcessed: boolean;
  fallbacks: string[];
};

export function resolveProductDisplayImage(
  product: Product
): ResolvedProductImage | null {
  if (!product.image || isDeadImageUrl(product.image)) return null;

  const sourceUrl = product.image;
  const plan = getProductImagePlan(sourceUrl);

  return {
    displaySrc: plan.src,
    sourceUrl,
    score: getImageQualityScore(sourceUrl) + 12,
    fillClass: getImageFillClass(sourceUrl),
    needsMatte: false,
    enhance: shouldEnhanceImage(sourceUrl),
    isProcessed: true,
    fallbacks: plan.fallbacks,
  };
}

export function passesCardDisplayGate(product: Product): boolean {
  if (!product.image || isDeadImageUrl(product.image)) return false;
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
