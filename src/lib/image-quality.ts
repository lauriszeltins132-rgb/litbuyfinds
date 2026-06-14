import manifestData from "@/data/image-quality-manifest.json";
import { isDeadImageUrl } from "./dead-images";
import type { Product } from "./types";

type ImageQualityEntry = {
  score: number;
  issues?: string[];
  borderBrightRatio?: number;
  width?: number;
  height?: number;
};

type ImageQualityManifest = {
  urls: Record<string, ImageQualityEntry>;
};

const catalog = manifestData as ImageQualityManifest;

const HOMEPAGE_MIN_SCORE = 70;

export function getImageQualityScore(imageUrl: string): number {
  if (!imageUrl || isDeadImageUrl(imageUrl)) return 0;
  return catalog.urls[imageUrl]?.score ?? 65;
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

export { HOMEPAGE_MIN_SCORE };
