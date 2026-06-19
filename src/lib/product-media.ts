import { isDeadImageUrl } from "./dead-images";
import {
  getImageQualityScore,
  FEATURED_MIN_SCORE,
  HOMEPAGE_MIN_SCORE,
} from "./image-quality";
import {
  compareProductVisualQuality,
  passesCardDisplayGate,
  resolveProductDisplayImage,
} from "./product-image-presentation";
import {
  isHomepageCuratedEligible,
  passesHomepageImageThreshold,
} from "./product-quality-score";
import { hasExactPrice } from "./pricing";
import { validateProduct } from "./product-validation";
import { isUsableImageUrl, validateImageUrl } from "./image-url";
import type { Product } from "./types";

export function hasUsableProductImage(product: Product): boolean {
  return isUsableImageUrl(product.image);
}

export function isFeaturedEligible(product: Product): boolean {
  if (!passesCardDisplayGate(product)) return false;
  if (!hasExactPrice(product.price)) return false;
  const resolved = resolveProductDisplayImage(product);
  return (resolved?.score ?? 0) >= FEATURED_MIN_SCORE;
}

/** Stricter gate for homepage hero rails (Popular Today, Trending, etc.). */
export function isHomepageFeaturedEligible(product: Product): boolean {
  return isHomepageCuratedEligible(product);
}

export function passesHomepageQualityGate(product: Product): boolean {
  if (!product.image || isDeadImageUrl(product.image)) return false;
  return passesHomepageImageThreshold(product);
}

export { HOMEPAGE_MIN_SCORE };

export function filterFeaturedEligible(items: Product[]): Product[] {
  return items.filter(isFeaturedEligible);
}

export function filterHomepageFeatured(items: Product[]): Product[] {
  return items.filter(isHomepageFeaturedEligible);
}

export function filterCatalogDisplayEligible(items: Product[]): Product[] {
  return items.filter((product) => {
    if (!product.image) return false;
    if (isDeadImageUrl(product.image)) return false;
    return passesCardDisplayGate(product);
  });
}

export function sortByVisualQuality(items: Product[]): Product[] {
  return [...items].sort(compareProductVisualQuality);
}

export function getImageUrlIssue(product: Product): string | null {
  const validation = validateImageUrl(product.image);
  if (validation.valid) return null;
  return validation.issue ?? "invalid";
}

export function getProductImageScore(product: Product): number {
  return resolveProductDisplayImage(product)?.score ?? getImageQualityScore(product.image);
}
