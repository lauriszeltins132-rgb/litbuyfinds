import { getCatalogBrightBgTreatment } from "./bright-bg";
import { isDeadImageUrl, isCatalogImageUrlDead } from "./dead-images";
import {
  getImageFillClass,
  getImageQualityDetails,
  getImageQualityScore,
  needsWhiteKnockout,
  shouldEnhanceImage,
} from "./image-quality";
import damagedData from "@/data/damaged-processed-manifest.json";
import {
  getProcessedApiSrc,
  getProductImagePlan,
  type ProductImagePlan,
} from "./processed-images";
import type { Product } from "./types";

type DamagedProcessedManifest = {
  urls: string[];
  paths: string[];
};

const damagedCatalog = damagedData as DamagedProcessedManifest;
const damagedUrls = new Set(damagedCatalog.urls ?? []);
const damagedPaths = new Set(damagedCatalog.paths ?? []);

/** Pre-built cutouts that eat dark fabric or leave harsh white speckles. */
function cutoutDisplayIsUnsafe(
  sourceUrl: string,
  processedPath?: string
): boolean {
  const details = getImageQualityDetails(sourceUrl);
  if (details?.issues?.includes("damaged_cutout")) return true;
  if (damagedUrls.has(sourceUrl)) return true;
  if (processedPath && damagedPaths.has(processedPath)) return true;
  return false;
}

/** True when the catalog original has a studio white / bright backdrop. */
function imageHasBrightBackground(sourceUrl: string): boolean {
  const details = getImageQualityDetails(sourceUrl);
  const whiteBlank = details?.whiteBlankRatio ?? 0;
  const border = details?.borderBrightRatio ?? 0;

  // Dark product photos should stay on the original even if flagged for vignette.
  if (details && whiteBlank < 0.08 && border < 0.12) return false;

  if (getCatalogBrightBgTreatment(sourceUrl) !== "none") return true;
  if (needsWhiteKnockout(sourceUrl)) return true;

  if (!details) return false;

  if (details.issues?.includes("white_blank")) return true;
  if (details.issues?.includes("white_border")) return true;

  const empty = details.emptySpaceRatio ?? 0;

  return whiteBlank >= 0.12 || border >= 0.15 || empty >= 0.35;
}

function shouldPreferProcessedDisplay(
  sourceUrl: string,
  plan: ProductImagePlan,
  catalogDead: boolean
): boolean {
  if (!plan.isProcessed) return false;
  if (cutoutDisplayIsUnsafe(sourceUrl, plan.src)) return false;
  if (catalogDead) return true;
  return imageHasBrightBackground(sourceUrl);
}

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
  const useProcessed = shouldPreferProcessedDisplay(sourceUrl, plan, catalogDead);
  const hasBrightBg = imageHasBrightBackground(sourceUrl);

  const canUseLiveProcessing =
    hasBrightBg && !cutoutDisplayIsUnsafe(sourceUrl, plan.src);

  const displaySrc = useProcessed
    ? plan.src
    : canUseLiveProcessing
      ? getProcessedApiSrc(sourceUrl)
      : sourceUrl;

  const showingProcessed =
    displaySrc.startsWith("/processed/") ||
    displaySrc.startsWith("/api/processed-image");

  const knockoutWhite =
    !showingProcessed &&
    (plan.knockoutWhite || needsWhiteKnockout(sourceUrl));

  const baseScore = getImageQualityScore(sourceUrl);
  const score =
    plan.isProcessed && plan.src.startsWith("/processed/")
      ? Math.max(58, baseScore + 12)
      : baseScore + (plan.isProcessed ? 12 : 0);

  const fallbacks = [
    ...new Set(
      [
        sourceUrl,
        plan.isProcessed ? plan.src : null,
        canUseLiveProcessing ? getProcessedApiSrc(sourceUrl) : null,
        ...plan.fallbacks,
      ].filter((url): url is string => Boolean(url) && url !== displaySrc)
    ),
  ];

  return {
    displaySrc,
    sourceUrl,
    score,
    fillClass: showingProcessed
      ? "product-float-asset--fill-balanced"
      : getImageFillClass(sourceUrl),
    needsMatte: false,
    knockoutWhite,
    enhance: showingProcessed || shouldEnhanceImage(sourceUrl),
    isProcessed: useProcessed,
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
