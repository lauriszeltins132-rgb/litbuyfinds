import { isHomepageFashionProduct } from "./homepage-curation";
import type { HomepageRails } from "./homepage-rails";
import { dedupeListingRail, getListingDedupeKey } from "./listing-dedupe";
import { passesCardDisplayGate } from "./product-image-presentation";
import { getProductById } from "./products";
import { hasExactPrice } from "./pricing";
import { spreadsheetMobileProductsNewestFirst } from "./spreadsheet-mobile-order";
import type { Product } from "./types";

/** Share of a 12-card budget rail that should be current Mobile products. */
const BUDGET_MOBILE_CAP = 8;
/** Share of a category rail reserved for current Mobile products. */
const CATEGORY_MOBILE_CAP = 6;

/**
 * Shoes and accessories have only a couple of Mobile rows.
 * Keep those rows for their named rails instead of spending them in the
 * budget rail or the latest grid.
 */
const THIN_CATEGORY_SLUGS = new Set(["shoes", "accessories"]);

function resolveMobileProduct(product: Product): Product {
  return getProductById(product.id) ?? product;
}

function isHomepageMobileCandidate(product: Product): boolean {
  if (!isHomepageFashionProduct(product)) return false;
  if (!product.image) return false;
  return passesCardDisplayGate(product);
}

/** Newest Mobile rows that can render on an existing homepage card. */
export function homepageMobileProductsNewestFirst(): Product[] {
  return dedupeListingRail(
    spreadsheetMobileProductsNewestFirst()
      .map(resolveMobileProduct)
      .filter(isHomepageMobileCandidate)
  );
}

function takeProducts(
  candidates: Product[],
  limit: number,
  usedIds: Set<string>,
  usedKeys: Set<string>
): Product[] {
  const picked: Product[] = [];

  for (const product of candidates) {
    if (picked.length >= limit) break;
    const key = getListingDedupeKey(product);
    if (usedIds.has(product.id) || usedKeys.has(key)) continue;
    usedIds.add(product.id);
    usedKeys.add(key);
    picked.push(product);
  }

  return picked;
}

function mixProducts(
  preferred: Product[],
  fallback: Product[],
  limit: number,
  preferredCap: number,
  usedIds: Set<string>,
  usedKeys: Set<string>
): Product[] {
  const head = takeProducts(
    preferred,
    Math.min(limit, preferredCap),
    usedIds,
    usedKeys
  );
  const tail = takeProducts(fallback, limit - head.length, usedIds, usedKeys);
  return [...head, ...tail];
}

function mobileInCategory(products: Product[], categorySlug: string): Product[] {
  return products.filter((product) => product.category_slug === categorySlug);
}

/**
 * Homepage-only product order.
 * Daily Finds, Weekly Finds, and Editor's Picks stay on their current
 * analytics / QC selection. Other rails lead with the newest Mobile rows.
 */
export function prioritizeHomepageMobileRails(
  rails: HomepageRails,
  limit: number
): HomepageRails {
  const mobile = homepageMobileProductsNewestFirst();
  const usedIds = new Set<string>();
  const usedKeys = new Set<string>();
  const gridLimit = rails.latestLitBuyFinds.length || limit;

  const latestFinds = takeProducts(mobile, limit, usedIds, usedKeys);

  const bestUnder20 = mixProducts(
    mobile.filter(
      (product) =>
        !THIN_CATEGORY_SLUGS.has(product.category_slug) &&
        hasExactPrice(product.price) &&
        (product.price as number) <= 20
    ),
    rails.bestUnder20,
    limit,
    BUDGET_MOBILE_CAP,
    usedIds,
    usedKeys
  );

  const latestLitBuyFinds = takeProducts(
    mobile.filter((product) => !THIN_CATEGORY_SLUGS.has(product.category_slug)),
    gridLimit,
    usedIds,
    usedKeys
  );
  if (latestLitBuyFinds.length < gridLimit) {
    latestLitBuyFinds.push(
      ...takeProducts(
        rails.latestLitBuyFinds,
        gridLimit - latestLitBuyFinds.length,
        usedIds,
        usedKeys
      )
    );
  }

  const trendingSneakers = mixProducts(
    mobileInCategory(mobile, "shoes"),
    rails.trendingSneakers,
    limit,
    CATEGORY_MOBILE_CAP,
    usedIds,
    usedKeys
  );
  const jacketsOuterwear = mixProducts(
    mobileInCategory(mobile, "coats-and-jackets"),
    rails.jacketsOuterwear,
    limit,
    CATEGORY_MOBILE_CAP,
    usedIds,
    usedKeys
  );
  const hoodiesPants = mixProducts(
    mobileInCategory(mobile, "hoodies-and-pants"),
    rails.hoodiesPants,
    limit,
    CATEGORY_MOBILE_CAP,
    usedIds,
    usedKeys
  );
  const accessories = mixProducts(
    mobileInCategory(mobile, "accessories"),
    rails.accessories,
    limit,
    CATEGORY_MOBILE_CAP,
    usedIds,
    usedKeys
  );

  return {
    ...rails,
    latestFinds,
    addedToday: latestFinds,
    bestUnder20,
    latestLitBuyFinds,
    trendingSneakers,
    jacketsOuterwear,
    hoodiesPants,
    accessories,
  };
}
