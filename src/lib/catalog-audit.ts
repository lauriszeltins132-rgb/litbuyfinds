import { isUsableImageUrl, validateImageUrl } from "./image-url";
import { auditCatalogPrices } from "./pricing";
import { products } from "./products";
import { STATIC_PAGES } from "./static-pages";
import { GUIDE_PAGES, GUIDES_HUB } from "./guides";
import { SEO_LIST_ROUTES } from "./seo-list-routes";
import { getAllProductSlugs } from "./slugs";
import type { Product } from "./types";

export type SiteAuditReport = {
  images: {
    missing: number;
    invalidUrl: number;
    valid: number;
    invalidSamples: { id: string; issue: string }[];
  };
  prices: ReturnType<typeof auditCatalogPrices>;
  seo: {
    staticPages: number;
    guidePages: number;
    topListPages: number;
    productPages: number;
    duplicateTitles: string[];
    missingDescriptions: string[];
  };
  sitemap: {
    includedPaths: number;
    productSlugs: number;
  };
};

function auditImages(items: Product[]) {
  let missing = 0;
  let invalidUrl = 0;
  let valid = 0;
  const invalidSamples: { id: string; issue: string }[] = [];

  for (const product of items) {
    if (!product.image) {
      missing += 1;
      continue;
    }
    const validation = validateImageUrl(product.image);
    if (validation.valid) {
      valid += 1;
    } else {
      invalidUrl += 1;
      if (invalidSamples.length < 15) {
        invalidSamples.push({
          id: product.id,
          issue: validation.issue ?? "invalid",
        });
      }
    }
  }

  return { missing, invalidUrl, valid, invalidSamples };
}

export function runSiteAudit(): SiteAuditReport {
  const titles = new Map<string, string[]>();
  const missingDescriptions: string[] = [];

  const pages = [
    ...Object.values(STATIC_PAGES),
    ...Object.values(GUIDE_PAGES),
    ...Object.values(SEO_LIST_ROUTES),
    { path: GUIDES_HUB.path, title: GUIDES_HUB.title, metaDescription: GUIDES_HUB.metaDescription },
  ];

  for (const page of pages) {
    if (!page.metaDescription?.trim()) {
      missingDescriptions.push(page.path);
    }
    const list = titles.get(page.title) ?? [];
    list.push(page.path);
    titles.set(page.title, list);
  }

  const duplicateTitles = [...titles.entries()]
    .filter(([, paths]) => paths.length > 1)
    .map(([title, paths]) => `${title} (${paths.join(", ")})`);

  const productSlugs = getAllProductSlugs().length;
  const includedPaths =
    pages.length + productSlugs + Object.keys(SEO_LIST_ROUTES).length;

  return {
    images: auditImages(products),
    prices: auditCatalogPrices(products),
    seo: {
      staticPages: Object.keys(STATIC_PAGES).length,
      guidePages: Object.keys(GUIDE_PAGES).length,
      topListPages: Object.keys(SEO_LIST_ROUTES).length,
      productPages: productSlugs,
      duplicateTitles,
      missingDescriptions,
    },
    sitemap: {
      includedPaths,
      productSlugs,
    },
  };
}

export function countBrokenImageCandidates(items: Product[]): number {
  return items.filter((p) => p.image && !isUsableImageUrl(p.image)).length;
}
