import type { Product } from "./types";
import { extractBrand, extractAllBrands } from "./brands";

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
  electronics: ["watch"],
};

const TYPE_LABELS: Record<string, string> = {
  bag: "bag",
  hat: "hat",
  jacket: "jacket",
  shoe: "footwear",
  hoodie: "top",
  pants: "bottoms",
  glasses: "eyewear",
  watch: "watch",
  belt: "belt",
  scarf: "scarf",
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
    electronics: "Electronics",
  };
  return map[product.category_slug] ?? product.category;
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
  if (/\b(beanie|knit|knitted)\b/i.test(title)) return "Beanie Set";
  if (/\b(hat|cap)\b/i.test(title)) return "Hat Set";
  const expected = CATEGORY_TYPES[categorySlug] ?? [];
  for (const type of expected) {
    if (titleTypes.has(type)) return TYPE_LABELS[type] ?? type;
  }
  const first = [...titleTypes][0];
  return first ? (TYPE_LABELS[first] ?? first) : null;
}

function buildGenericTitle(
  product: Product,
  brand: string | null,
  titleTypes: Set<string>,
  useBrand: boolean,
  multiItem: boolean
): string {
  const typeLabel = pickDisplayType(
    titleTypes,
    product.category_slug,
    product.product_name
  );
  const fashionLabel = typeLabel
    ? `${typeLabel.charAt(0).toUpperCase()}${typeLabel.slice(1)}`
    : singularCategory(product);
  const suffix = multiItem ? " Set" : "";

  if (useBrand && brand && typeLabel) return `${brand} ${fashionLabel}${suffix}`;
  if (useBrand && brand) return `${brand} find`;
  if (typeLabel) return `Fashion ${fashionLabel}${suffix}`;
  return `${singularCategory(product)} find`;
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

export function validateProduct(product: Product): ProductValidation {
  const title = product.product_name.trim();
  const titleBrands = extractAllBrands(title);
  const titleTypes = detectTypes(title);
  const imageUrl = product.image ?? "";
  const urlBrands = imageUrl ? extractAllBrands(imageUrl) : [];
  const expectedTypes = CATEGORY_TYPES[product.category_slug] ?? [];
  const multiItem = looksLikeMultiItemListing(title, imageUrl);

  let confidence = 1;
  const issues: string[] = [];

  if (titleBrands.length > 1) {
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

  if (/^(item|product|find|new)\b/i.test(title)) {
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
  const isTitleTrusted =
    normalized >= 0.6 && !issues.includes("likely_multi_item_listing");

  let displayName = isTitleTrusted ? product.product_name : "";
  if (!isTitleTrusted) {
    displayName = buildGenericTitle(
      product,
      trustBrand,
      titleTypes,
      !brandConflict,
      multiItem
    );
  } else if (
    multiItem &&
    issues.includes("likely_multi_item_listing") &&
    !/\bcollection\b/i.test(title)
  ) {
    displayName = `${product.product_name} Collection`;
  }

  return {
    confidence: normalized,
    issues,
    isTitleTrusted,
    displayName,
    displayBrand: trustBrand,
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
