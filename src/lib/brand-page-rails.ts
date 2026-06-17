import { getProductEngagementScore } from "./analytics-store";
import { extractBrand, getBrandsFromProducts, type BrandInfo } from "./brands";
import { getContextualBestOfLinks } from "./best-of-pages";
import {
  getBrandCollectionHref,
  getBrandCollectionLabel,
} from "./brand-collections";
import { filterFeaturedEligible } from "./product-media";
import { hasExactPrice } from "./pricing";
import { getAllProducts, getTrendingProducts, getCategories } from "./products";
import type { Product } from "./types";

import type { CategoryInfo } from "./types";

export type BrandPageRails = {
  topProducts: Product[];
  trendingProducts: Product[];
  bestQcProducts: Product[];
  recentlyAdded: Product[];
  bestUnder50: Product[];
  relatedBrands: BrandInfo[];
  relatedCategories: CategoryInfo[];
  bestOfLinks: { href: string; label: string }[];
  stats: {
    totalIndexed: number;
    topCount: number;
    trendingCount: number;
    recentlyAddedCount: number;
    bestQcCount: number;
    budgetCount: number;
  };
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

  const recentlyAdded = [...eligible]
    .sort((a, b) => Number(b.id) - Number(a.id))
    .filter((p) => !used.has(p.id))
    .slice(0, 8);
  recentlyAdded.forEach((p) => used.add(p.id));

  const bestQcProducts = [...eligible]
    .filter((p) => p.qc_link && !used.has(p.id))
    .sort((a, b) => scoreBrandProduct(b) - scoreBrandProduct(a))
    .slice(0, 8);
  bestQcProducts.forEach((p) => used.add(p.id));

  const bestUnder50 = eligible
    .filter((p) => hasExactPrice(p.price) && p.price! <= 50 && !used.has(p.id))
    .slice(0, 8);

  const categoryCounts = new Map<string, number>();
  for (const product of products) {
    categoryCounts.set(
      product.category_slug,
      (categoryCounts.get(product.category_slug) ?? 0) + 1
    );
  }
  const categoryBySlug = new Map(getCategories().map((c) => [c.slug, c]));
  const relatedCategories = [...categoryCounts.entries()]
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6)
    .map(([slug, count]) => {
      const cat = categoryBySlug.get(slug);
      return {
        name: cat?.name ?? slug,
        slug,
        count,
        href: cat?.href ?? `/categories/${slug}`,
        group: cat?.group ?? ("category" as const),
      };
    });

  const allBrands = getBrandsFromProducts(getAllProducts());
  const relatedBrands = allBrands
    .filter((b) => b.slug !== brandSlug)
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const bestOfLinks = getContextualBestOfLinks({ brandSlug });
  const collectionHref = getBrandCollectionHref(brandSlug);
  if (collectionHref) {
    bestOfLinks.unshift({
      href: collectionHref,
      label: getBrandCollectionLabel(brandName),
    });
  }

  return {
    topProducts,
    trendingProducts,
    bestQcProducts,
    recentlyAdded,
    bestUnder50,
    relatedBrands,
    relatedCategories,
    bestOfLinks,
    stats: {
      totalIndexed: products.length,
      topCount: topProducts.length,
      trendingCount: trendingProducts.length,
      recentlyAddedCount: recentlyAdded.length,
      bestQcCount: bestQcProducts.length,
      budgetCount: bestUnder50.length,
    },
  };
}
