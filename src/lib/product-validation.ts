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

function pickDisplayType(
  titleTypes: Set<string>,
  categorySlug: string
): string | null {
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
  titleTypes: Set<string>
): string {
  const typeLabel = pickDisplayType(titleTypes, product.category_slug);
  if (brand && typeLabel) return `${brand} ${typeLabel}`;
  if (brand) return `${brand} find`;
  if (typeLabel) return `${typeLabel.charAt(0).toUpperCase()}${typeLabel.slice(1)} find`;
  return `${singularCategory(product)} find`;
}

export function validateProduct(product: Product): ProductValidation {
  const title = product.product_name.trim();
  const titleBrands = extractAllBrands(title);
  const titleTypes = detectTypes(title);
  const urlBrands = product.image ? extractAllBrands(product.image) : [];
  const expectedTypes = CATEGORY_TYPES[product.category_slug] ?? [];

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

  if (titleBrands.length === 1 && urlBrands.length === 1) {
    if (
      titleBrands[0].toLowerCase() !== urlBrands[0].toLowerCase() &&
      !title.toLowerCase().includes(urlBrands[0].toLowerCase())
    ) {
      confidence -= 0.3;
      issues.push("image_url_brand_mismatch");
    }
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
  const isTitleTrusted = normalized >= 0.55;
  const primaryBrand =
    titleBrands.length === 1 ? titleBrands[0] : extractBrand(title);

  return {
    confidence: normalized,
    issues,
    isTitleTrusted,
    displayName: isTitleTrusted
      ? product.product_name
      : buildGenericTitle(product, primaryBrand, titleTypes),
    displayBrand: primaryBrand,
  };
}

export function getDisplayProductName(product: Product): string {
  return validateProduct(product).displayName;
}

export function getDisplayBrand(product: Product): string | null {
  return validateProduct(product).displayBrand;
}
