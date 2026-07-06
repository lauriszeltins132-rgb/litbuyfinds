import type { Product } from "./types";
import { extractBrand, extractAllBrands } from "./brands";
import {
  getEffectiveProductTitle,
  getProductNameOverride,
  isBatchMislabelTitle,
  isGenericTwoWordTitle,
} from "./product-title-quality";

export type ProductValidation = {
  confidence: number;
  issues: string[];
  isTitleTrusted: boolean;
  displayName: string;
  displayBrand: string | null;
};

const PRODUCT_TYPES: Record<string, RegExp> = {
  bag: /\b(bag|backpack|tote|crossbody|duffel|sling|wallet|purse|handbag)\b/i,
  hat: /\b(hat|cap|beanie|bucket|headwear|beret)\b/i,
  jacket: /\b(jacket|coat|puffer|parka|vest|down|shell|windbreaker|anorak)\b/i,
  shoe: /\b(sneaker|shoe|trainer|boot|sandal|slide|loafer|runner|footwear)\b/i,
  hoodie: /\b(hoodie|sweatshirt|crewneck|sweater|pullover|cardigan)\b/i,
  pants: /\b(pants|jeans|trouser|shorts|jogger|cargo|sweatpant)\b/i,
  shirt: /\b(tee|t-shirt|tshirt|shirt|polo|blouse|top)\b/i,
  glasses: /\b(glasses|sunglasses|eyewear|shades)\b/i,
  watch: /\b(watch|timepiece)\b/i,
  belt: /\b(belt)\b/i,
  scarf: /\b(scarf)\b/i,
};

const CATEGORY_TYPES: Record<string, string[]> = {
  shoes: ["shoe"],
  accessories: ["bag", "hat", "glasses", "watch", "belt", "scarf"],
  "coats-and-jackets": ["jacket"],
  "hoodies-and-pants": ["hoodie", "pants"],
  "tshirts-and-shorts": ["shirt", "pants"],
  electronics: ["watch"],
};

const TYPE_LABELS: Record<string, string> = {
  bag: "Bag",
  hat: "Hat",
  jacket: "Jacket",
  shoe: "Sneakers",
  hoodie: "Hoodie",
  pants: "Pants",
  shirt: "T-Shirt",
  glasses: "Sunglasses",
  watch: "Watch",
  belt: "Belt",
  scarf: "Scarf",
};

const CATEGORY_DEFAULT_LABELS: Record<string, string> = {
  shoes: "Sneakers",
  accessories: "Accessory",
  "coats-and-jackets": "Jacket",
  "hoodies-and-pants": "Hoodie",
  "tshirts-and-shorts": "T-Shirt",
  electronics: "Electronics",
  "trending-now": "Find",
  "latest-finds": "Find",
};

const INCOMPATIBLE_TYPES: [string, string][] = [
  ["bag", "shoe"],
  ["bag", "jacket"],
  ["hat", "shoe"],
  ["hat", "bag"],
  ["glasses", "shoe"],
  ["watch", "jacket"],
];

const COLLECTION_PATTERN =
  /\b(collection|assorted|multi|various|mix|set|pack|combo|lot|bundle|styles?)\b/i;

const SINGULAR_HEADWEAR =
  /\b(hat|cap|beanie|beret)\b/i;

const GENERIC_RAW_TITLE =
  /^(fashion\s+(top|bottoms?|hoodie|jacket|bag|find)|top|bottoms?|clothing|product|item|untitled|unknown)$/i;

function detectTypes(text: string): Set<string> {
  const found = new Set<string>();
  for (const [type, pattern] of Object.entries(PRODUCT_TYPES)) {
    if (pattern.test(text)) found.add(type);
  }
  return found;
}

function typesConflict(types: Set<string>): boolean {
  const list = [...types];
  for (const [a, b] of INCOMPATIBLE_TYPES) {
    if (list.includes(a) && list.includes(b)) return true;
  }
  return list.length > 2;
}

function singularCategory(product: Product): string {
  const map: Record<string, string> = {
    shoes: "Footwear",
    accessories: "Accessories",
    "coats-and-jackets": "Outerwear",
    "hoodies-and-pants": "Streetwear",
    "tshirts-and-shorts": "Apparel",
    electronics: "Electronics",
    "trending-now": "Trending",
    "latest-finds": "Latest",
  };
  return map[product.category_slug] ?? product.category;
}

function capitalizeLabel(value: string): string {
  if (!value) return value;
  return value
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function looksLikeMultiItemListing(title: string, imageUrl: string): boolean {
  const combined = `${title} ${imageUrl}`;
  if (COLLECTION_PATTERN.test(combined)) return true;
  if (/\b\d+\s*(pc|pcs|piece|color|style)/i.test(combined)) return true;
  if (SINGULAR_HEADWEAR.test(title) && !COLLECTION_PATTERN.test(title)) {
    if (/\b(multi|assort|various|styles|colors)\b/i.test(imageUrl)) return true;
  }
  return false;
}

function pickDisplayType(
  titleTypes: Set<string>,
  categorySlug: string,
  title: string
): string | null {
  if (/\bbackpack\b/i.test(title)) return "Backpack";
  if (/\b(beanie|knit|knitted)\b/i.test(title)) return "Beanie";
  if (/\b(hat|cap)\b/i.test(title)) return "Hat";
  if (/\b(sweatpant|jogger)\b/i.test(title)) return "Sweatpants";
  if (/\b(shorts)\b/i.test(title)) return "Shorts";
  if (/\b(vest)\b/i.test(title)) return "Vest";

  const expected = CATEGORY_TYPES[categorySlug] ?? [];
  for (const type of expected) {
    if (titleTypes.has(type)) return TYPE_LABELS[type] ?? type;
  }

  const first = [...titleTypes][0];
  return first ? (TYPE_LABELS[first] ?? capitalizeLabel(first)) : null;
}

function buildGenericTitle(
  product: Product,
  brand: string | null,
  titleTypes: Set<string>,
  multiItem: boolean
): string {
  const categoryDefault = CATEGORY_DEFAULT_LABELS[product.category_slug];
  const typeLabel = pickDisplayType(
    titleTypes,
    product.category_slug,
    product.product_name
  );
  const typePart =
    typeLabel ?? categoryDefault ?? singularCategory(product);
  const suffix = multiItem ? " Set" : "";

  if (brand) return `${brand} ${typePart}${suffix}`;
  return `${typePart}${suffix}`;
}

function resolveTrustedBrand(
  title: string,
  titleBrands: string[],
  urlBrands: string[],
  brandConflict: boolean
): string | null {
  if (brandConflict) return null;
  if (titleBrands.length === 1) return titleBrands[0];
  if (titleBrands.length === 0 && urlBrands.length === 1) return urlBrands[0];
  return extractBrand(title);
}

function isCollabTitle(title: string, titleBrands: string[]): boolean {
  return (
    titleBrands.length > 1 &&
    /\s(x|×|&|and)\s/i.test(title) &&
    detectTypes(title).size >= 1
  );
}

export function validateProduct(product: Product): ProductValidation {
  const title = getEffectiveProductTitle(product);
  const titleBrands = extractAllBrands(title);
  const titleTypes = detectTypes(title);
  const imageUrl = product.image ?? "";
  const urlBrands = imageUrl ? extractAllBrands(imageUrl) : [];
  const expectedTypes = CATEGORY_TYPES[product.category_slug] ?? [];
  const multiItem = looksLikeMultiItemListing(title, imageUrl);
  const hasOverride = getProductNameOverride(product) !== null;
  const isBrandTypeTitle =
    isGenericTwoWordTitle(title) && titleBrands.length === 1;
  const batchMislabel =
    !hasOverride &&
    product.category_slug !== "latest-finds" &&
    isBatchMislabelTitle(product.product_name);

  let confidence = 1;
  const issues: string[] = [];

  if (batchMislabel && !isBrandTypeTitle) {
    confidence -= 0.55;
    issues.push("batch_generic_mislabel");
  }

  if (titleBrands.length > 1 && !isCollabTitle(title, titleBrands)) {
    confidence -= 0.5;
    issues.push("multiple_brands_in_title");
  }

  if (typesConflict(titleTypes)) {
    confidence -= 0.4;
    issues.push("conflicting_product_types");
  }

  if (titleTypes.size > 0 && expectedTypes.length > 0) {
    const matchesCategory = [...titleTypes].some((type) =>
      expectedTypes.includes(type)
    );
    if (!matchesCategory) {
      confidence -= 0.35;
      issues.push("category_type_mismatch");
    }
  }

  if (titleBrands.length === 1 && urlBrands.length >= 1) {
    const titleBrand = titleBrands[0].toLowerCase();
    const urlHasConflict = urlBrands.some(
      (brand) =>
        brand.toLowerCase() !== titleBrand &&
        !title.toLowerCase().includes(brand.toLowerCase())
    );
    if (urlHasConflict) {
      confidence -= 0.35;
      issues.push("image_url_brand_mismatch");
    }
  }

  if (titleBrands.length === 0 && urlBrands.length === 1) {
    confidence += 0.05;
  }

  if (multiItem && !COLLECTION_PATTERN.test(title)) {
    confidence -= 0.25;
    issues.push("likely_multi_item_listing");
  }

  if (title.split(/\s+/).filter(Boolean).length < 2) {
    confidence -= 0.15;
    issues.push("title_too_short");
  }

  if (/^(item|product|find|new)\b/i.test(title) || GENERIC_RAW_TITLE.test(title)) {
    confidence -= 0.2;
    issues.push("generic_title");
  }

  const normalized = Math.max(0, Math.min(1, confidence));
  const brandConflict =
    issues.includes("multiple_brands_in_title") ||
    issues.includes("image_url_brand_mismatch") ||
    issues.includes("category_type_mismatch");
  const trustBrand = resolveTrustedBrand(
    title,
    titleBrands,
    urlBrands,
    brandConflict
  );

  const collabTitle = isCollabTitle(title, titleBrands);
  const isTitleTrusted =
    isBrandTypeTitle ||
    collabTitle ||
    (normalized >= 0.6 &&
      !issues.includes("likely_multi_item_listing") &&
      !issues.includes("batch_generic_mislabel") &&
      !issues.includes("generic_title"));

  let displayName = isTitleTrusted ? title : "";
  if (!isTitleTrusted) {
    displayName = buildGenericTitle(
      { ...product, product_name: title },
      trustBrand ?? (urlBrands.length === 1 ? urlBrands[0] : null),
      titleTypes,
      multiItem
    );
  } else if (
    multiItem &&
    issues.includes("likely_multi_item_listing") &&
    !/\bcollection\b/i.test(title)
  ) {
    displayName = `${title} Collection`;
  }

  return {
    confidence: normalized,
    issues,
    isTitleTrusted,
    displayName,
    displayBrand: trustBrand ?? (isBrandTypeTitle ? titleBrands[0] : null),
  };
}

const validationCache = new WeakMap<Product, ProductValidation>();

export function validateProductCached(product: Product): ProductValidation {
  const cached = validationCache.get(product);
  if (cached) return cached;
  const result = validateProduct(product);
  validationCache.set(product, result);
  return result;
}

export function getDisplayProductName(product: Product): string {
  return validateProductCached(product).displayName;
}

export function getDisplayBrand(product: Product): string | null {
  return validateProductCached(product).displayBrand;
}
