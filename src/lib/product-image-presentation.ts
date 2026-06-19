import { isDeadImageUrl } from "./dead-images";
import {
  getImageFillClass,
  getImageQualityDetails,
  getImageQualityScore,
  shouldEnhanceImage,
  needsTransparentMatte,
  CARD_DISPLAY_MIN_SCORE,
} from "./image-quality";
import { getProductImagePlan } from "./processed-images";
import type { Product } from "./types";

export type ResolvedProductImage = {
  /** URL passed to `<img src>` — processed matte when quality benefits. */
  displaySrc: string;
  /** Original catalog image URL used for quality metadata. */
  sourceUrl: string;
  score: number;
  fillClass: string;
  needsMatte: boolean;
  enhance: boolean;
  isProcessed: boolean;
  fallbacks: string[];
};

function uniqueUrls(urls: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const url of urls) {
    if (!url || seen.has(url)) continue;
    seen.add(url);
    out.push(url);
  }
  return out;
}

function effectiveScore(
  sourceUrl: string,
  displaySrc: string,
  isProcessed: boolean
): number {
  let score = getImageQualityScore(sourceUrl);
  if (isProcessed && displaySrc !== sourceUrl) score += 10;
  const details = getImageQualityDetails(sourceUrl);
  if (details?.contentFillRatio && details.contentFillRatio >= 0.55) score += 5;
  if (details?.transparencyRatio && details.transparencyRatio > 0.2 && isProcessed) {
    score += 8;
  }
  return score;
}

export function resolveProductDisplayImage(
  product: Product
): ResolvedProductImage | null {
  if (!product.image || isDeadImageUrl(product.image)) return null;

  const sourceUrl = product.image;
  const plan = getProductImagePlan(sourceUrl);
  const primaryScore = getImageQualityScore(sourceUrl);
  const details = getImageQualityDetails(sourceUrl);

  const preferProcessed =
    plan.isProcessed &&
    plan.src !== sourceUrl &&
    (primaryScore < 65 ||
      (details?.transparencyRatio ?? 0) > 0.12 ||
      (details?.contentFillRatio ?? 1) < 0.48 ||
      (details?.issues ?? []).includes("unprocessed") ||
      (details?.issues ?? []).includes("transparent_cutout") ||
      (details?.issues ?? []).includes("white_border"));

  const displaySrc = preferProcessed ? plan.src : sourceUrl;
  const isProcessed = preferProcessed;

  const fallbacks = uniqueUrls([
    displaySrc,
    ...(displaySrc !== sourceUrl ? [sourceUrl] : []),
    ...(plan.isProcessed && plan.src !== displaySrc ? [plan.src] : []),
  ]);

  return {
    displaySrc,
    sourceUrl,
    score: effectiveScore(sourceUrl, displaySrc, isProcessed),
    fillClass: getImageFillClass(sourceUrl),
    needsMatte: needsTransparentMatte(sourceUrl) && !isProcessed,
    enhance: shouldEnhanceImage(sourceUrl),
    isProcessed,
    fallbacks,
  };
}

export function passesCardDisplayGate(product: Product): boolean {
  if (!product.image || isDeadImageUrl(product.image)) return false;
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
