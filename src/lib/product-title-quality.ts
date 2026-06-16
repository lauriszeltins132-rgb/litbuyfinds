import productsData from "@/data/products.json";
import { extractAllBrands } from "./brands";
import type { Product } from "./types";

const GENERIC_TYPE_PATTERN =
  /^(bag|bags|backpack|shoe|shoes|sneaker|sneakers|jacket|jackets|hoodie|hoodies|hat|hats|cap|caps|tee|tees|t-shirt|belt|belts|watch|watches|glasses|sunglasses|pants|shorts|vest|vests|coat|coats|parka|boot|boots|sandals|slide|slides|runner|runners|trainer|trainers|footwear|accessories|find|set|perfume|sweater|sweaters|polo|polos)$/i;

/** Spreadsheet rows often share a wrong "{Brand} {Type}" label across many listings. */
export function isGenericTwoWordTitle(name: string): boolean {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length !== 2) return false;
  const brands = extractAllBrands(parts[0]);
  if (brands.length !== 1) return false;
  return GENERIC_TYPE_PATTERN.test(parts[1]);
}

function listingKey(product: Product): string {
  return product.affiliate_link.trim().toLowerCase();
}

let batchMislabelTitles: Set<string> | null = null;

/** Titles reused across multiple distinct LitBuy listings — likely batch mislabels. */
export function getBatchMislabelTitles(): Set<string> {
  if (batchMislabelTitles) return batchMislabelTitles;

  const byTitle = new Map<string, Set<string>>();
  for (const product of productsData as Product[]) {
    const title = product.product_name.trim();
    if (!isGenericTwoWordTitle(title)) continue;
    const links = byTitle.get(title) ?? new Set<string>();
    links.add(listingKey(product));
    byTitle.set(title, links);
  }

  batchMislabelTitles = new Set(
    [...byTitle.entries()]
      .filter(([, links]) => links.size >= 2)
      .map(([title]) => title)
  );

  return batchMislabelTitles;
}

export function isBatchMislabelTitle(title: string): boolean {
  return getBatchMislabelTitles().has(title.trim());
}

export function extractMarketplaceListingId(
  affiliateLink: string
): { platform: "weidian" | "taobao"; id: string } | null {
  const weidian = affiliateLink.match(/weidian\/(\d+)/i);
  if (weidian) return { platform: "weidian", id: weidian[1] };

  const taobao = affiliateLink.match(/taobao\/(\d+)/i);
  if (taobao) return { platform: "taobao", id: taobao[1] };

  return null;
}

/**
 * Manual corrections for listings where spreadsheet metadata is wrong.
 * Key: `weidian:ID` or `taobao:ID`
 */
export const PRODUCT_NAME_OVERRIDES: Record<string, string> = {
  // Nike Elite backpacks — spreadsheet labelled "Adidas Bag"
  "weidian:7625857897": "Nike Elite Backpack",
  "weidian:7629307178": "Nike Elite Backpack",
  "weidian:7625755537": "Nike Backpack",
  "weidian:7626412049": "Nike Backpack",
  "weidian:7625847983": "Nike Backpack",
  "weidian:7626374245": "Nike Backpack",
};

export function getProductNameOverride(product: Product): string | null {
  const listing = extractMarketplaceListingId(product.affiliate_link);
  if (!listing) return null;
  return PRODUCT_NAME_OVERRIDES[`${listing.platform}:${listing.id}`] ?? null;
}

export function getEffectiveProductTitle(product: Product): string {
  return getProductNameOverride(product) ?? product.product_name.trim();
}
