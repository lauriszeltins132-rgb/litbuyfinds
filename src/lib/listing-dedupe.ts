import { getEffectiveProductTitle } from "./product-title-quality";
import type { Product } from "./types";

function normalizeAffiliateLink(link: string): string {
  const trimmed = link.trim();
  if (!trimmed) return "";

  try {
    const url = new URL(trimmed);
    return `${url.hostname}${url.pathname}`.toLowerCase();
  } catch {
    return trimmed.toLowerCase();
  }
}

function imageAssetKey(image: string): string {
  const normalized = image.trim().toLowerCase();
  const match = normalized.match(/[\da-f]{16,}_[\d_]+\.(?:jpg|jpeg|png|webp)/i);
  return match?.[0] ?? normalized;
}

/** Stable key for spreadsheet rows that share a marketplace listing or product photo. */
export function getListingDedupeKey(product: Product): string {
  const link = normalizeAffiliateLink(product.affiliate_link);
  if (link) return `link:${link}`;

  const title = getEffectiveProductTitle(product).trim().toLowerCase();
  const image = product.image?.trim() ?? "";
  if (title && image) return `title-image:${title}::${imageAssetKey(image)}`;

  return `id:${product.id}`;
}

/** Preserve order while collapsing duplicate marketplace listings. */
export function dedupeListingProducts(products: Product[]): Product[] {
  const seen = new Set<string>();
  const deduped: Product[] = [];

  for (const product of products) {
    const key = getListingDedupeKey(product);
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(product);
  }

  return deduped;
}

/** Preserve rail order while removing duplicate listings. */
export function dedupeListingRail(products: Product[]): Product[] {
  return dedupeListingProducts(products);
}
