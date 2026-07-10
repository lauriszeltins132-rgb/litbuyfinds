import { getCatalogBrightBgTreatment } from "./bright-bg";
import { isDeadImageUrl } from "./dead-images";
import {
  getImageFillClass,
  getImageQualityDetails,
  getImageQualityScore,
} from "./image-quality";
import {
  getProductImagePlan,
  isProcessedCutoutBlocked,
} from "./processed-images";
import type { Product } from "./types";

function isNaturalProductPhoto(
  sourceUrl: string,
  details: ReturnType<typeof getImageQualityDetails>
): boolean {
  if (!details) return false;
  if (details.issues?.includes("dead_url") && (details.score ?? 0) <= 0) {
    return false;
  }
  if (details.isScreenshotStyle) return true;
  if (details.isTransparent && (details.transparencyRatio ?? 0) > 0.15) {
    return true;
  }
  if (getCatalogBrightBgTreatment(sourceUrl) === "none") {
    const whiteBlank = details.whiteBlankRatio ?? 0;
    const border = details.borderBrightRatio ?? 0;
    if (whiteBlank < 0.03 && border < 0.05) return true;
  }
  return false;
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
 * Prefer clean transparent cutouts for studio-white photos; keep originals
 * for QC / carpet shots. No CSS white knockout — real alpha PNGs only.
 */
export function resolveProductDisplayImage(
  product: Product
): ResolvedProductImage | null {
  if (!product.image) return null;

  const sourceUrl = product.image;
  const plan = getProductImagePlan(sourceUrl);
  const details = getImageQualityDetails(sourceUrl);

  if (isDeadImageUrl(sourceUrl) && !plan.isProcessed) return null;

  const processedPath =
    plan.isProcessed && plan.src.startsWith("/processed/") ? plan.src : undefined;
  const cutoutUnsafe =
    isProcessedCutoutBlocked(sourceUrl, processedPath) ||
    details?.issues?.includes("damaged_cutout") === true;

  const useProcessed =
    Boolean(processedPath) &&
    !cutoutUnsafe &&
    !isNaturalProductPhoto(sourceUrl, details);

  const displaySrc = useProcessed && processedPath ? processedPath : sourceUrl;
  const showingProcessed = displaySrc.startsWith("/processed/");

  const fallbacks = [
    ...new Set(
      [
        showingProcessed ? sourceUrl : processedPath && !cutoutUnsafe ? processedPath : null,
        ...plan.fallbacks,
      ].filter((url): url is string => Boolean(url) && url !== displaySrc)
    ),
  ];

  return {
    displaySrc,
    sourceUrl,
    score: getImageQualityScore(sourceUrl),
    fillClass: showingProcessed
      ? "product-float-asset--fill-balanced"
      : getImageFillClass(sourceUrl),
    needsMatte: false,
    knockoutWhite: false,
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
