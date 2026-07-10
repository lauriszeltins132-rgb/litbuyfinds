import batchMislabelData from "@/data/batch-mislabel-titles.json";
import { extractAllBrands } from "./brands";
import type { Product } from "./types";

const GENERIC_TYPE_PATTERN =
  /^(bag|bags|backpack|shoe|shoes|sneaker|sneakers|jacket|jackets|hoodie|hoodies|hat|hats|cap|caps|tee|tees|t-shirt|belt|belts|watch|watches|glasses|sunglasses|pants|shorts|vest|vests|coat|coats|parka|boot|boots|sandals|slide|slides|runner|runners|trainer|trainers|footwear|accessories|find|set|perfume|sweater|sweaters|polo|polos|shirt|shirts|top|tops|scarf|scarves|wallet|wallets|ring|rings|necklace|necklaces|bracelet|bracelets)$/i;

/** Spreadsheet rows often share a wrong "{Brand} {Type}" label across many listings. */
export function isGenericTwoWordTitle(name: string): boolean {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length !== 2) return false;
  const brands = extractAllBrands(parts[0]);
  if (brands.length !== 1) return false;
  return GENERIC_TYPE_PATTERN.test(parts[1]);
}

const batchMislabelTitles = new Set(batchMislabelData.titles ?? []);

/** Titles reused across multiple distinct LitBuy listings — likely batch mislabels. */
export function getBatchMislabelTitles(): Set<string> {
  return batchMislabelTitles;
}

export function isBatchMislabelTitle(title: string): boolean {
  return batchMislabelTitles.has(title.trim());
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
