/** Maps brand slugs to shareable SEO collection pages. */
export const BRAND_COLLECTION_SLUGS: Record<string, string> = {
  nike: "best-nike-finds",
  jordan: "best-jordan-finds",
  moncler: "best-moncler-finds",
  stussy: "best-stussy-finds",
  corteiz: "best-corteiz-finds",
  adidas: "best-sneakers",
  gucci: "best-bags",
  "louis-vuitton": "best-bags",
  prada: "best-bags",
  "stone-island": "best-jackets",
  "ralph-lauren": "best-hoodies",
  balenciaga: "best-sneakers",
  dior: "best-bags",
  bape: "best-hoodies",
};

export function getBrandCollectionHref(brandSlug: string): string | undefined {
  const slug = BRAND_COLLECTION_SLUGS[brandSlug];
  return slug ? `/collections/${slug}` : undefined;
}

export function getBrandCollectionLabel(brandName: string): string {
  return `Best ${brandName} Finds`;
}
