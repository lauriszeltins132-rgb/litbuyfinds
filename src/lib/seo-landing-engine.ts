import { extractBrand } from "./brands";
import { getHomepageRails } from "./homepage-rails";
import { filterFeaturedEligible, sortByVisualQuality } from "./product-media";
import { hasExactPrice } from "./pricing";
import {
  getAllProducts,
  getLatestProducts,
  getTrendingProducts,
} from "./products";
import type { Product } from "./types";
import type {
  SeoLandingCompareGroup,
  SeoLandingPageEntry,
  SeoLandingProductFilter,
} from "./seo-landing-config";
import { SEO_LANDING_CONFIG, SEO_LANDING_CONFIG_SLUGS } from "./seo-landing-config";

export const SEO_LANDING_MIN_PRODUCTS = 6;

export function filterQualityProducts(products: Product[]): Product[] {
  return sortByVisualQuality(
    filterFeaturedEligible(products.filter((product) => hasExactPrice(product.price)))
  );
}

function matchKeywords(name: string, keywords: string[]): boolean {
  return keywords.some((keyword) => {
    try {
      return new RegExp(keyword, "i").test(name);
    } catch {
      return name.toLowerCase().includes(keyword.toLowerCase());
    }
  });
}

export function resolveProductsFromFilter(
  filter: SeoLandingProductFilter,
  limit = 96
): Product[] {
  let pool = getAllProducts().filter((product) => hasExactPrice(product.price));

  if (filter.brands?.length) {
    const brands = new Set(filter.brands.map((brand) => brand.toLowerCase()));
    pool = pool.filter((product) => {
      const brand = extractBrand(product.product_name)?.toLowerCase();
      return brand && brands.has(brand);
    });
  }

  if (filter.categories?.length) {
    pool = pool.filter((product) =>
      filter.categories!.includes(product.category_slug)
    );
  }

  if (filter.keywords?.length) {
    pool = pool.filter((product) =>
      matchKeywords(product.product_name, filter.keywords!)
    );
  }

  if (filter.maxPrice != null) {
    pool = pool.filter((product) => product.price! <= filter.maxPrice!);
  }

  if (filter.minPrice != null) {
    pool = pool.filter((product) => product.price! >= filter.minPrice!);
  }

  if (filter.requireQc) {
    pool = pool.filter((product) => product.qc_link);
  }

  if (filter.trending) {
    const trendingIds = new Set(getTrendingProducts().map((product) => product.id));
    pool = pool.filter((product) => trendingIds.has(product.id));
  }

  if (filter.latest) {
    const latest = getLatestProducts();
    const latestIds = new Set(latest.map((product) => product.id));
    pool = [
      ...latest,
      ...pool.filter((product) => !latestIds.has(product.id)),
    ];
  }

  return filterQualityProducts(pool).slice(0, limit);
}

export function resolveFreshnessProducts(
  kind: NonNullable<SeoLandingProductFilter["freshness"]>,
  limit = 48
): Product[] {
  const rails = getHomepageRails(Math.max(limit, 12));

  switch (kind) {
    case "popularToday":
      return rails.popularToday.slice(0, limit);
    case "popularWeek":
      return rails.popularWeek.slice(0, limit);
    case "addedToday":
      return rails.addedToday.slice(0, limit);
    case "editorsPicks":
      return rails.editorsPicks.slice(0, limit);
    case "bestUnder20":
      return rails.bestUnder20.slice(0, limit);
    case "bestValue": {
      const used = new Set<string>();
      const merged = [...rails.bestUnder20, ...rails.topQcFinds].filter(
        (product) => {
          if (used.has(product.id)) return false;
          used.add(product.id);
          return true;
        }
      );
      return merged.slice(0, limit);
    }
    default:
      return [];
  }
}

export function resolveSeoLandingProducts(entry: SeoLandingPageEntry): Product[] {
  if (entry.getProducts) {
    return filterQualityProducts(entry.getProducts()).slice(
      0,
      entry.productLimit ?? 96
    );
  }

  if (entry.filter?.freshness) {
    return resolveFreshnessProducts(
      entry.filter.freshness,
      entry.productLimit ?? 48
    );
  }

  if (entry.filter) {
    return resolveProductsFromFilter(entry.filter, entry.productLimit ?? 96);
  }

  return [];
}

export function resolveCompareGroups(
  groups: SeoLandingCompareGroup[]
): { label: string; products: Product[] }[] {
  return groups.map((group) => ({
    label: group.label,
    products: filterQualityProducts(
      group.getProducts?.() ??
        (group.filter ? resolveProductsFromFilter(group.filter, 24) : [])
    ).slice(0, 24),
  }));
}

export function isSeoLandingPagePublished(entry: SeoLandingPageEntry): boolean {
  if (entry.type === "comparison") {
    const groups = resolveCompareGroups(entry.compareGroups ?? []);
    return groups.some((group) => group.products.length >= 3);
  }

  const minimum = entry.minProducts ?? SEO_LANDING_MIN_PRODUCTS;
  return resolveSeoLandingProducts(entry).length >= minimum;
}

export function getSitemapChangeFrequency(
  entry: SeoLandingPageEntry
): "daily" | "weekly" | "monthly" {
  switch (entry.updateFrequency) {
    case "daily":
      return "daily";
    case "weekly":
      return "weekly";
    default:
      return "monthly";
  }
}

export function getPublishedSeoLandingConfigs(): SeoLandingPageEntry[] {
  return SEO_LANDING_CONFIG_SLUGS.map((slug) => SEO_LANDING_CONFIG[slug]).filter(
    (entry) => entry && isSeoLandingPagePublished(entry)
  );
}

export function getPublishedSeoLandingSlugs(): string[] {
  return getPublishedSeoLandingConfigs().map((entry) => entry.slug);
}
