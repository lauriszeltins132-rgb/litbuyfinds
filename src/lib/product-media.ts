import { isUsableImageUrl, validateImageUrl } from "./image-url";
import { passesHomepageQualityGate, getImageQualityScore } from "./image-quality";
import { hasExactPrice } from "./pricing";
import { validateProduct } from "./product-validation";
import type { Product } from "./types";

export function hasUsableProductImage(product: Product): boolean {
  return isUsableImageUrl(product.image);
}

export function isFeaturedEligible(product: Product): boolean {
  return (
    hasUsableProductImage(product) &&
    hasExactPrice(product.price) &&
    getImageQualityScore(product.image) >= 45
  );
}

/** Stricter gate for homepage hero rails (Popular Today, Trending, etc.). */
export function isHomepageFeaturedEligible(product: Product): boolean {
  if (!hasUsableProductImage(product) || !hasExactPrice(product.price)) return false;
  if (!passesHomepageQualityGate(product)) return false;
  const validation = validateProduct(product);
  return validation.confidence >= 0.45;
}

export function filterFeaturedEligible(items: Product[]): Product[] {
  return items.filter(isFeaturedEligible);
}

export function filterHomepageFeatured(items: Product[]): Product[] {
  return items.filter(isHomepageFeaturedEligible);
}

export function getImageUrlIssue(product: Product): string | null {
  const validation = validateImageUrl(product.image);
  if (validation.valid) return null;
  return validation.issue ?? "invalid";
}
