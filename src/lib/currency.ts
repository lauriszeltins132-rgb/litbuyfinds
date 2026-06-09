import type { CurrencyCode } from "./constants";
import { EXCHANGE_RATES } from "./constants";

export function convertFromUsd(
  usd: number | null,
  currency: CurrencyCode
): number | null {
  if (usd === null) return null;
  if (currency === "USD") return usd;
  if (currency === "EUR") return usd * EXCHANGE_RATES.EUR;
  return usd * EXCHANGE_RATES.CNY;
}

export function formatPrice(
  usd: number | null,
  currency: CurrencyCode
): string {
  if (usd === null) return "—";

  const value = convertFromUsd(usd, currency);
  if (value === null) return "—";

  const symbols: Record<CurrencyCode, string> = {
    USD: "$",
    EUR: "€",
    CNY: "¥",
  };

  return `${symbols[currency]}${value.toFixed(2)}`;
}
