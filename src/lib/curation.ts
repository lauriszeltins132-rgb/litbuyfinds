/** Premium brands weighted higher on homepage Popular Today rail. */
export const PREMIUM_BRAND_WEIGHTS: Record<string, number> = {
  Nike: 100,
  Jordan: 95,
  Adidas: 90,
  Moncler: 88,
  "Stone Island": 86,
  "Arc'teryx": 84,
  Arcteryx: 84,
  "Canada Goose": 82,
  Chrome: 87,
  "Chrome Hearts": 87,
  Gucci: 80,
  "Louis Vuitton": 78,
  Stussy: 76,
  Corteiz: 74,
};

export function getPremiumBrandBoost(productName: string): number {
  const upper = productName.toUpperCase();
  let boost = 0;
  for (const [brand, weight] of Object.entries(PREMIUM_BRAND_WEIGHTS)) {
    if (upper.includes(brand.toUpperCase())) {
      boost = Math.max(boost, weight);
    }
  }
  return boost;
}
