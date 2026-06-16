import { getProductEngagementScore } from "./analytics-store";
import { extractBrand, getBrandsFromProducts, type BrandInfo } from "./brands";
import { getContextualBestOfLinks } from "./best-of-pages";
import { filterFeaturedEligible } from "./product-media";
import { hasExactPrice } from "./pricing";
import { getAllProducts, getTrendingProducts } from "./products";
import type { Product } from "./types";

export type BrandPageRails = {
  topProducts: Product[];
  trendingProducts: Product[];
  mostEngaged: Product[];
  bestUnder50: Product[];
  recentlyAdded: Product[];
  relatedBrands: BrandInfo[];
  bestOfLinks: { href: string; label: string }[];
};

function scoreBrandProduct(product: Product): number {
  let score = getProductEngagementScore(product.id) * 15;
  if (product.qc_link) score += 12;
  if (product.image) score += 8;
  if (hasExactPrice(product.price)) score += 5;
  return score;
}

export function getBrandPageRails(
  brandSlug: string,
  brandName: string,
  products: Product[]
): BrandPageRails {
  const eligible = filterFeaturedEligible(products.filter((p) => p.image));
  const scored = [...eligible].sort((a, b) => scoreBrandProduct(b) - scoreBrandProduct(a));

  const topProducts = scored.slice(0, 12);
  const used = new Set(topProducts.map((p) => p.id));

  const trendingProducts = getTrendingProducts()
    .filter((p) => extractBrand(p.product_name) === brandName && !used.has(p.id))
    .slice(0, 8);
  trendingProducts.forEach((p) => used.add(p.id));

  const mostEngaged = scored.filter((p) => !used.has(p.id)).slice(0, 8);
  mostEngaged.forEach((p) => used.add(p.id));

  const bestUnder50 = eligible
    .filter((p) => hasExactPrice(p.price) && p.price! <= 50 && !used.has(p.id))
    .slice(0, 8);
  bestUnder50.forEach((p) => used.add(p.id));

  const recentlyAdded = [...eligible]
    .sort((a, b) => Number(b.id) - Number(a.id))
    .filter((p) => !used.has(p.id))
    .slice(0, 8);

  const allBrands = getBrandsFromProducts(getAllProducts());
  const relatedBrands = allBrands
    .filter((b) => b.slug !== brandSlug)
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const bestOfLinks = getContextualBestOfLinks({ brandSlug });

  return {
    topProducts,
    trendingProducts,
    mostEngaged,
    bestUnder50,
    recentlyAdded,
    relatedBrands,
    bestOfLinks,
  };
}
