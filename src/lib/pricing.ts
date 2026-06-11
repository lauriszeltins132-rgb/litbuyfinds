import type { CurrencyCode } from "./constants";
import { convertFromUsd, formatPrice } from "./currency";
import type { Product } from "./types";

/** Above this USD value we treat catalog prices as unverified (data-entry errors). */
export const MAX_VERIFIED_PRICE_USD = 400;

export type PriceStatus = "exact" | "unavailable" | "check_latest";

export type PriceAudit = {
  total: number;
  exact: number;
  unavailable: number;
  checkLatest: number;
  nullInSource: number;
  suspiciousSamples: { id: string; name: string; price: number }[];
};

export function getPriceStatus(usd: number | null | undefined): PriceStatus {
  if (usd === null || usd === undefined || !Number.isFinite(usd) || usd <= 0) {
    return "unavailable";
  }
  if (usd > MAX_VERIFIED_PRICE_USD) {
    return "check_latest";
  }
  return "exact";
}

export function hasExactPrice(usd: number | null | undefined): boolean {
  return getPriceStatus(usd) === "exact";
}

export function formatProductPrice(
  usd: number | null,
  currency: CurrencyCode
): string {
  const status = getPriceStatus(usd);

  if (status === "unavailable") {
    return "Price unavailable";
  }

  if (status === "check_latest") {
    return "Check latest price";
  }

  return formatPrice(usd, currency);
}

export function isPriceMismatchRisk(product: Product): boolean {
  return getPriceStatus(product.price) === "check_latest";
}

export function auditCatalogPrices(items: Product[]): PriceAudit {
  const audit: PriceAudit = {
    total: items.length,
    exact: 0,
    unavailable: 0,
    checkLatest: 0,
    nullInSource: 0,
    suspiciousSamples: [],
  };

  for (const product of items) {
    if (product.price === null) {
      audit.nullInSource += 1;
    }

    const status = getPriceStatus(product.price);
    if (status === "exact") audit.exact += 1;
    else if (status === "unavailable") audit.unavailable += 1;
    else {
      audit.checkLatest += 1;
      if (audit.suspiciousSamples.length < 12 && product.price !== null) {
        audit.suspiciousSamples.push({
          id: product.id,
          name: product.product_name,
          price: product.price,
        });
      }
    }
  }

  return audit;
}

export function getCatalogPriceAudit(): PriceAudit {
  const { products } = require("./products") as { products: Product[] };
  return auditCatalogPrices(products);
}

/** Verify converted amounts stay reasonable (no double-conversion bugs). */
export function verifyCurrencyConversion(usd: number, currency: CurrencyCode): boolean {
  const converted = convertFromUsd(usd, currency);
  if (converted === null) return false;
  if (currency === "USD") return converted === usd;
  if (currency === "EUR") return converted < usd;
  if (currency === "CNY") return converted > usd;
  return true;
}
