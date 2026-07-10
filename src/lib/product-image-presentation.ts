import { getCatalogBrightBgTreatment } from "./bright-bg";
import { isDeadImageUrl } from "./dead-images";
import {
  getImageFillClass,
  getImageQualityDetails,
  getImageQualityScore,
  needsWhiteKnockout,
} from "./image-quality";
import {
  getProductImagePlan,
  isProcessedCutoutBlocked,
} from "./processed-images";
import type { Product } from "./types";

/** True when the catalog original has a studio white / bright backdrop. */
function imageHasBrightBackground(sourceUrl: string): boolean {
  const details = getImageQualityDetails(sourceUrl);
  if (details?.isScreenshotStyle) return false;
  if (!details || details.issues?.includes("dead_url")) return true;
  if (getCatalogBrightBgTreatment(sourceUrl) !== "none") return true;
  if (needsWhiteKnockout(sourceUrl)) return true;
  if (details.issues?.includes("white_blank")) return true;
  if (details.issues?.includes("white_border")) return true;

  const whiteBlank = details.whiteBlankRatio ?? 0;
  const border = details.borderBrightRatio ?? 0;
  const empty = details.emptySpaceRatio ?? 0;
  if (whiteBlank >= 0.04 || border >= 0.08 || empty >= 0.2) return true;
  return true;
}

export type ResolvedProductImage = {
  displaySrc: string;
  sourceUrl: string;
  score: number;
  fillClass: string;
  needsMatte: boolean;
  knockoutWhite: boolean;
  enhance: boolean;
  darkBoost: boolean;
  isProcessed: boolean;
  fallbacks: string[];
};

/**
 * Card-safe image resolution: always prefer the catalog original so we avoid
 * broken transparent cutouts. White studio backgrounds are removed via CSS
 * blend mode instead of pre-processed PNGs.
 */
export function resolveProductDisplayImage(
  product: Product
): ResolvedProductImage | null {
  if (!product.image) return null;

  const sourceUrl = product.image;
  const plan = getProductImagePlan(sourceUrl);

  if (isDeadImageUrl(sourceUrl) && !plan.isProcessed) return null;

  const processedPath =
    plan.isProcessed && plan.src.startsWith("/processed/") ? plan.src : undefined;
  const cutoutUnsafe = isProcessedCutoutBlocked(sourceUrl, processedPath);
  const hasBrightBg = imageHasBrightBackground(sourceUrl);

  const displaySrc = sourceUrl;
  const showingProcessed = false;
  const knockoutWhite = hasBrightBg;

  const fallbacks = [
    ...new Set(
      [
        plan.isProcessed && !cutoutUnsafe ? plan.src : null,
        ...plan.fallbacks,
      ].filter((url): url is string => Boolean(url) && url !== displaySrc)
    ),
  ];

  return {
    displaySrc,
    sourceUrl,
    score: getImageQualityScore(sourceUrl),
    fillClass: getImageFillClass(sourceUrl),
    needsMatte: false,
    knockoutWhite,
    enhance: false,
    darkBoost: false,
    isProcessed: showingProcessed,
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
