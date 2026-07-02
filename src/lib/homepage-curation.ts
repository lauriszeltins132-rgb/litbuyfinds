import { extractBrand } from "./brands";
import { getPremiumBrandBoost } from "./curation";
import { getImageQualityDetails } from "./image-quality";
import { resolveProductDisplayImage } from "./product-image-presentation";
import type { Product } from "./types";

/** Categories allowed on fashion-focused homepage rails. */
export const HOMEPAGE_FASHION_CATEGORIES = new Set([
  "trending-now",
  "latest-finds",
  "shoes",
  "hoodies-and-pants",
  "coats-and-jackets",
  "tshirts-and-shorts",
  "accessories",
]);

const NON_FASHION_CATEGORY_SLUGS = new Set(["electronics"]);

const NON_FASHION_NAME_PATTERN =
  /\b(vacuum|dyson|robot\s*vacuum|cleaner|blender|microwave|printer|keyboard|mouse|monitor|laptop|tablet|charger|cable|earbuds?|headphones?|speaker|appliance|household|mop|air\s*purifier|humidifier|\bfan\b|power\s*bank|smart\s*watch|camera|drill|tool\b|screwdriver|wrench|bulb|lamp\b|desk\b|chair\b|sofa\b|bedding|pillow|curtain|rug\b)/i;

const SCREENSHOT_NAME_PATTERN =
  /\b(screenshot|weidian\s*link|taobao\s*link|1688|spreadsheet|size\s*chart|measurement|qc\s*grid)\b/i;

const EDITORIAL_BRANDS = [
  "Nike",
  "Jordan",
  "Adidas",
  "Moncler",
  "Stone Island",
  "Chrome Hearts",
  "Gucci",
  "Louis Vuitton",
  "Stussy",
  "Corteiz",
  "Arc'teryx",
  "Canada Goose",
  "Prada",
  "Balenciaga",
];

export function isHomepageFashionProduct(product: Product): boolean {
  if (NON_FASHION_CATEGORY_SLUGS.has(product.category_slug)) return false;
  if (!HOMEPAGE_FASHION_CATEGORIES.has(product.category_slug)) return false;
  if (NON_FASHION_NAME_PATTERN.test(product.product_name)) return false;
  return true;
}

export function isEditorialBrandProduct(product: Product): boolean {
  const brand = extractBrand(product.product_name);
  if (!brand) return false;
  return EDITORIAL_BRANDS.some(
    (name) => name.toLowerCase() === brand.toLowerCase()
  );
}

export function getEditorialBrandBoost(product: Product): number {
  if (isEditorialBrandProduct(product)) return 22;
  const premium = getPremiumBrandBoost(product.product_name);
  if (premium >= 80) return 14;
  if (premium >= 70) return 8;
  return 0;
}

export function getWhiteBlankRatio(imageUrl: string): number {
  const details = getImageQualityDetails(imageUrl);
  if (!details) return 0.35;
  return (
    details.whiteBlankRatio ??
    Math.max(details.emptySpaceRatio ?? 0, details.borderBrightRatio ?? 0)
  );
}

export function hasLargeWhiteBackground(imageUrl: string): boolean {
  const details = getImageQualityDetails(imageUrl);
  if (!details) return true;

  const whiteBlank = getWhiteBlankRatio(imageUrl);
  const empty = details.emptySpaceRatio ?? 1 - (details.contentFillRatio ?? 0.5);
  const border = details.borderBrightRatio ?? 0;

  return whiteBlank > 0.4 || empty > 0.4 || border > 0.22;
}

export function isScreenshotStyleProduct(product: Product): boolean {
  if (SCREENSHOT_NAME_PATTERN.test(product.product_name)) return true;

  const details = getImageQualityDetails(product.image);
  if (!details) return false;

  if (details.isScreenshotStyle) return true;

  const ar = details.aspectRatio ?? 1;
  const border = details.borderBrightRatio ?? 0;
  const empty = details.emptySpaceRatio ?? 0;
  const fill = details.contentFillRatio ?? 0.5;
  const minDim = Math.min(details.width ?? 0, details.height ?? 0);

  if (ar > 1.75 && (border > 0.15 || empty > 0.45)) return true;
  if (ar < 0.48 && empty > 0.5) return true;
  if (minDim < 220 && ar > 1.5) return true;
  if (fill < 0.28 && border > 0.12) return true;

  return false;
}

export function hasTinyProductSubject(imageUrl: string): boolean {
  const details = getImageQualityDetails(imageUrl);
  if (!details) return false;
  return (
    (details.contentFillRatio ?? 1) < 0.32 ||
    details.issues?.includes("tiny_product") === true
  );
}

export function passesHomepageVisualPresentation(product: Product): boolean {
  if (!product.image) return false;
  const resolved = resolveProductDisplayImage(product);
  if (resolved?.isProcessed) {
    if (isScreenshotStyleProduct(product)) return false;
    return true;
  }
  if (hasLargeWhiteBackground(product.image)) return false;
  if (isScreenshotStyleProduct(product)) return false;
  if (hasTinyProductSubject(product.image)) return false;

  const details = getImageQualityDetails(product.image);
  if (details?.issues?.includes("white_border")) return false;
  if (details?.issues?.includes("damaged_cutout")) return false;
  if ((details?.contentFillRatio ?? 0) < 0.4) return false;

  return true;
}
