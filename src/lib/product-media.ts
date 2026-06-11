import { isUsableImageUrl, validateImageUrl } from "./image-url";
import { hasExactPrice } from "./pricing";
import type { Product } from "./types";

export function hasUsableProductImage(product: Product): boolean {
  return isUsableImageUrl(product.image);
}

export function isFeaturedEligible(product: Product): boolean {
  return hasUsableProductImage(product) && hasExactPrice(product.price);
}

export function filterFeaturedEligible(items: Product[]): Product[] {
  return items.filter(isFeaturedEligible);
}

export function getImageUrlIssue(product: Product): string | null {
  const validation = validateImageUrl(product.image);
  if (validation.valid) return null;
  return validation.issue ?? "invalid";
}
