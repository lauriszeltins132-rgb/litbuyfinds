import { getCatalogBrightBgTreatment } from "./bright-bg";
import { isCatalogImageUrlDead, isDeadImageUrl } from "./dead-images";
import { classifyImageBackground } from "./image-background-analysis";
import { getCategoryFillClass } from "./image-presentation-presets";
import {
  CARD_DISPLAY_MIN_SCORE,
  getImageQualityDetails,
  getImageQualityScore,
} from "./image-quality";
import {
  getProductImagePlan,
  isProcessedAssetDamaged,
  isProcessedCutoutBlocked,
} from "./processed-images";
import type { Product } from "./types";

function usableFallbackUrl(url: string | null | undefined): url is string {
  if (!url) return false;
  if (url.startsWith("/processed/")) return true;
  return !isDeadImageUrl(url);
}

/**
 * Prefer full-resolution CDN originals when cutout quality fails.
 * Studio originals on white card panels beat damaged processed cutouts.
 */
function shouldPreferOriginalPhoto(
  sourceUrl: string,
  details: ReturnType<typeof getImageQualityDetails>
): boolean {
  if (isCatalogImageUrlDead(sourceUrl)) return false;
  if (!details) return false;
  if (details.issues?.includes("dead_url") && (details.score ?? 0) <= 0) {
    return false;
  }
  if (details.isScreenshotStyle) return true;
  if (details.isTransparent && (details.transparencyRatio ?? 0) > 0.15) {
    return true;
  }
  if (details.issues?.includes("bad_cutout")) return true;
  if (details.issues?.includes("hollow_cutout")) return true;
  if (details.issues?.includes("damaged_cutout")) return true;
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
  surfaceClass: string;
  isProcessed: boolean;
  fallbacks: string[];
};

/**
 * BoonBuy-style: prefer clean cutouts on white card panels; keep originals
 * only for QC / carpet / transparent catalog shots.
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
  const sourceIsDead = isCatalogImageUrlDead(sourceUrl);
  const cutoutUnsafe =
    isProcessedCutoutBlocked(sourceUrl, processedPath) ||
    details?.issues?.includes("damaged_cutout") === true;

  const useProcessed =
    Boolean(processedPath) &&
    (sourceIsDead
      ? !isProcessedAssetDamaged(processedPath)
      : !cutoutUnsafe && !shouldPreferOriginalPhoto(sourceUrl, details));

  let displaySrc = useProcessed && processedPath ? processedPath : sourceUrl;
  let showingProcessed = displaySrc.startsWith("/processed/");

  const fallbacks = [
    ...new Set(
      [
        showingProcessed ? sourceUrl : processedPath && !cutoutUnsafe ? processedPath : null,
        ...plan.fallbacks,
      ].filter(
        (url): url is string =>
          Boolean(url) && url !== displaySrc && usableFallbackUrl(url)
      )
    ),
  ];

  if (!showingProcessed && isCatalogImageUrlDead(displaySrc)) {
    const rescue = fallbacks.find((url) => url.startsWith("/processed/"));
    if (rescue) {
      displaySrc = rescue;
      showingProcessed = true;
    }
  }

  const sourceScore = getImageQualityScore(sourceUrl);
  const score =
    showingProcessed
      ? Math.max(sourceScore, CARD_DISPLAY_MIN_SCORE)
      : sourceScore;

  const background = classifyImageBackground(sourceUrl, {
    isProcessedCutout: showingProcessed,
  });

  return {
    displaySrc,
    sourceUrl,
    score,
    fillClass: getCategoryFillClass(
      product.category_slug,
      sourceUrl,
      showingProcessed
    ),
    surfaceClass: background.surfaceClass,
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
  if (
    !resolved.isProcessed &&
    isCatalogImageUrlDead(resolved.displaySrc)
  ) {
    return false;
  }
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
