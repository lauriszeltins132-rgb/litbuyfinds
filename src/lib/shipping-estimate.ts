/** Typical packed weights. These are category estimates, not measured item weights. */
const WEIGHTS: { test: RegExp; kg: number; kind: string }[] = [
  { test: /shoe|sneaker/, kg: 1.2, kind: "shoes" },
  { test: /jacket|coat/, kg: 1.1, kind: "a jacket" },
  { test: /hoodie|sweat|pant/, kg: 0.7, kind: "a hoodie or pants" },
  { test: /bag/, kg: 0.8, kind: "a bag" },
  { test: /accessor|hat|belt|jewel|watch/, kg: 0.15, kind: "an accessory" },
  { test: /tee|t-shirt|tshirt|shirt|short/, kg: 0.25, kind: "a t-shirt" },
];

export const SHIPPING_DESTINATIONS = [
  { id: "us", label: "United States" },
  { id: "uk", label: "United Kingdom" },
  { id: "de", label: "Germany" },
  { id: "fr", label: "France" },
  { id: "ca", label: "Canada" },
  { id: "au", label: "Australia" },
  { id: "other", label: "Other" },
] as const;

export type ShippingDestinationId = (typeof SHIPPING_DESTINATIONS)[number]["id"];

export function estimateCategoryWeight(category: string): {
  kg: number;
  kind: string;
} {
  const value = category.toLowerCase();
  const match = WEIGHTS.find((entry) => entry.test.test(value));
  return match ?? { kg: 0.5, kind: "this type of item" };
}

/**
 * Rough illustrative freight assumption for this site.
 * Not a verified LitBuy rate, and not destination-specific.
 */
export const ILLUSTRATIVE_SHIPPING_USD_PER_KG = { low: 9, high: 10 } as const;

function roundUsd(value: number): number {
  return Math.round(value * 100) / 100;
}

export function illustrativeShippingUsd(kg: number): {
  low: number;
  high: number;
  mid: number;
} {
  const { low: lowRate, high: highRate } = ILLUSTRATIVE_SHIPPING_USD_PER_KG;
  return {
    low: roundUsd(kg * lowRate),
    high: roundUsd(kg * highRate),
    mid: roundUsd(kg * ((lowRate + highRate) / 2)),
  };
}
