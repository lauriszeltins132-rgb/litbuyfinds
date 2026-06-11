import type { CurrencyCode } from "./constants";
import { convertFromUsd, formatPrice } from "./currency";
import type { Product } from "./types";

/** Below this USD value prices are treated as bad data (e.g. parsed from "Jordan 1"). */
export const MIN_TRUSTED_PRICE_USD = 5;

/** Above this USD value we show "Check latest price" (likely CNY or data errors). */
export const MAX_VERIFIED_PRICE_USD = 400;

/** Upper bound for audit reporting. */
export const MAX_AUDIT_PRICE_USD = 5000;

export type PriceStatus = "exact" | "unavailable" | "check_latest";

export type PriceAudit = {
  total: number;
  exact: number;
  unavailable: number;
  checkLatest: number;
  nullInSource: number;
  belowMinimum: number;
  aboveAuditMax: number;
  suspiciousSamples: { id: string; name: string; price: number }[];
  belowMinimumSamples: { id: string; name: string; price: number }[];
  aboveMaxSamples: { id: string; name: string; price: number }[];
};

export function getPriceStatus(usd: number | null | undefined): PriceStatus {
  if (usd === null || usd === undefined || !Number.isFinite(usd) || usd <= 0) {
    return "unavailable";
  }
  if (usd < MIN_TRUSTED_PRICE_USD) {
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
    belowMinimum: 0,
    aboveAuditMax: 0,
    suspiciousSamples: [],
    belowMinimumSamples: [],
    aboveMaxSamples: [],
  };

  for (const product of items) {
    if (product.price === null) {
      audit.nullInSource += 1;
    }

    if (
      product.price !== null &&
      product.price > 0 &&
      product.price < MIN_TRUSTED_PRICE_USD
    ) {
      audit.belowMinimum += 1;
      if (audit.belowMinimumSamples.length < 20) {
        audit.belowMinimumSamples.push({
          id: product.id,
          name: product.product_name,
          price: product.price,
        });
      }
    }

    if (product.price !== null && product.price > MAX_AUDIT_PRICE_USD) {
      audit.aboveAuditMax += 1;
      if (audit.aboveMaxSamples.length < 12) {
        audit.aboveMaxSamples.push({
          id: product.id,
          name: product.product_name,
          price: product.price,
        });
      }
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

/** Verify converted amounts stay reasonable (no double-conversion bugs). */
export function verifyCurrencyConversion(usd: number, currency: CurrencyCode): boolean {
  const converted = convertFromUsd(usd, currency);
  if (converted === null) return false;
  if (currency === "USD") return converted === usd;
  if (currency === "EUR") return converted < usd;
  if (currency === "CNY") return converted > usd;
  return true;
}
