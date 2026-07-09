import manifestData from "@/data/image-quality-manifest.json";
import { isDeadImageUrl } from "./dead-images";
import type { Product } from "./types";

export type ImageQualityEntry = {
  score: number;
  issues?: string[];
  borderBrightRatio?: number;
  width?: number;
  height?: number;
  aspectRatio?: number;
  contentFillRatio?: number;
  transparencyRatio?: number;
  emptySpaceRatio?: number;
  whiteBlankRatio?: number;
  isTransparent?: boolean;
  isScreenshotStyle?: boolean;
  needsMatte?: boolean;
  enhance?: boolean;
};

type ImageQualityManifest = {
  urls: Record<string, ImageQualityEntry>;
};

const catalog = manifestData as ImageQualityManifest;

export const HOMEPAGE_MIN_SCORE = 76;
export const CARD_DISPLAY_MIN_SCORE = 42;
export const FEATURED_MIN_SCORE = 55;

const DEFAULT_SCORE = 62;

export function getImageQualityDetails(imageUrl: string): ImageQualityEntry | null {
  if (!imageUrl || isDeadImageUrl(imageUrl)) return null;
  return catalog.urls[imageUrl] ?? null;
}

export function getImageQualityScore(imageUrl: string): number {
  if (!imageUrl || isDeadImageUrl(imageUrl)) return 0;
  return catalog.urls[imageUrl]?.score ?? DEFAULT_SCORE;
}

export function getImageQualityIssues(imageUrl: string): string[] {
  return catalog.urls[imageUrl]?.issues ?? [];
}

export function isHomepageImageQuality(imageUrl: string): boolean {
  return getImageQualityScore(imageUrl) >= HOMEPAGE_MIN_SCORE;
}

export function passesHomepageQualityGate(product: Product): boolean {
  if (!product.image || isDeadImageUrl(product.image)) return false;
  return isHomepageImageQuality(product.image);
}

export function needsTransparentMatte(imageUrl: string): boolean {
  const entry = catalog.urls[imageUrl];
  if (!entry) return false;
  return (
    entry.needsMatte === true ||
    (entry.isTransparent === true && (entry.transparencyRatio ?? 0) > 0.1)
  );
}

export function shouldEnhanceImage(imageUrl: string): boolean {
  const entry = catalog.urls[imageUrl];
  if (!entry) return false;
  return entry.enhance === true;
}

/** Subtle lift for catalog photos that read too dark on card backgrounds. */
export function needsDarkBoost(imageUrl: string): boolean {
  const entry = catalog.urls[imageUrl];
  if (!entry) return false;
  if (entry.enhance === true) return true;

  const whiteBlank = entry.whiteBlankRatio ?? 0;
  const border = entry.borderBrightRatio ?? 0;
  const fill = entry.contentFillRatio ?? 0;

  return (
    fill >= 0.42 &&
    whiteBlank < 0.06 &&
    border < 0.1 &&
    entry.score >= 45 &&
    entry.score < 72
  );
}

/** Studio white backdrops that should be knocked out on dark cards. */
export function needsWhiteKnockout(imageUrl: string): boolean {
  const entry = catalog.urls[imageUrl];
  if (!entry) return false;
  return (entry.whiteBlankRatio ?? 0) >= 0.12;
}

/** Scale class when product occupies too little of the frame. */
export function getImageFillClass(imageUrl: string): string {
  const fill = catalog.urls[imageUrl]?.contentFillRatio;
  if (fill == null) return "product-float-asset--fill-balanced";
  if (fill < 0.32) return "product-float-asset--fill-sparse";
  if (fill < 0.52) return "product-float-asset--fill-balanced";
  return "product-float-asset--fill-dense";
}
