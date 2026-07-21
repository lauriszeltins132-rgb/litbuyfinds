import { getImageFillClass } from "./image-quality";

const SHOE_CATEGORIES = new Set([
  "sneakers",
  "shoes",
  "footwear",
  "boots",
  "sandals",
  "slides",
]);

const BAG_CATEGORIES = new Set([
  "bags",
  "backpacks",
  "handbags",
  "totes",
  "crossbody-bags",
]);

const CLOTHING_CATEGORIES = new Set([
  "jackets",
  "hoodies",
  "sweaters",
  "coats",
  "puffer-jackets",
  "tees",
  "pants",
  "shorts",
  "vests",
]);

const ACCESSORY_CATEGORIES = new Set([
  "accessories",
  "watches",
  "belts",
  "hats",
  "caps",
  "glasses",
  "jewelry",
  "socks",
]);

function normalizeCategorySlug(categorySlug?: string | null): string {
  return (categorySlug ?? "").trim().toLowerCase();
}

/**
 * Category-aware object-fit padding presets without per-product CSS.
 */
export function getCategoryFillClass(
  categorySlug: string | undefined,
  sourceUrl: string,
  isProcessedCutout = false
): string {
  if (isProcessedCutout) return "product-float-asset--fill-balanced";

  const slug = normalizeCategorySlug(categorySlug);
  const base = getImageFillClass(sourceUrl);

  if (SHOE_CATEGORIES.has(slug) || slug.includes("sneaker") || slug.includes("shoe")) {
    return "product-float-asset--fill-shoes";
  }
  if (BAG_CATEGORIES.has(slug) || slug.includes("bag")) {
    return "product-float-asset--fill-bags";
  }
  if (
    CLOTHING_CATEGORIES.has(slug) ||
    slug.includes("jacket") ||
    slug.includes("hoodie") ||
    slug.includes("coat")
  ) {
    return "product-float-asset--fill-apparel";
  }
  if (ACCESSORY_CATEGORIES.has(slug) || slug.includes("accessor")) {
    return "product-float-asset--fill-accessory";
  }

  return base;
}
