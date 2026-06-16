import type { Product } from "./types";
import { getEffectiveProductTitle } from "./product-title-quality";
import { products } from "./products";

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getProductSlug(product: Product): string {
  const base = slugify(getEffectiveProductTitle(product)).slice(0, 55);
  return `${base}-${product.id}`;
}

export function getProductHref(product: Product): string {
  return `/find/${getProductSlug(product)}`;
}

export function getProductBySlug(slug: string): Product | undefined {
  const id = slug.split("-").pop();
  if (!id) return undefined;

  const byId = products.find((product) => product.id === id);
  if (byId) return byId;

  return products.find((product) => getProductSlug(product) === slug);
}

export function getAllProductSlugs(): string[] {
  return products.map(getProductSlug);
}
