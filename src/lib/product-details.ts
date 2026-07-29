import {
  buildProductMetaDescription,
  buildProductMetaTitle,
} from "./metadata-copy";
import type { Product } from "./types";
import { formatPrice } from "./currency";
import { getProductSource } from "./filters";
import { getDatasetSyncedIso } from "./catalog-meta";
import { hasExactPrice } from "./pricing";
import {
  getDisplayBrand,
  getDisplayProductName,
  validateProduct,
} from "./product-validation";

export type ProductFacts = {
  displayName: string;
  brand: string | null;
  category: string;
  categorySlug: string;
  categoryPath: { label: string; href?: string }[];
  source: string;
  priceLabel: string | null;
  qcStatus: "available" | "not_linked";
  qcUrl: string | null;
  imageCount: number;
  catalogSyncedIso: string;
  titleConfidence: number;
  titleTrusted: boolean;
  validationIssues: string[];
};

export function getProductFacts(
  product: Product,
  categoryHref: string
): ProductFacts {
  const validation = validateProduct(product);
  const brand = getDisplayBrand(product);
  const source = getProductSource(product.affiliate_link);

  return {
    displayName: getDisplayProductName(product),
    brand,
    category: product.category,
    categorySlug: product.category_slug,
    categoryPath: [
      { label: "Home", href: "/" },
      { label: product.category, href: categoryHref },
      { label: getDisplayProductName(product) },
    ],
    source: source.toUpperCase(),
    priceLabel:
      hasExactPrice(product.price) && product.price !== null
        ? formatPrice(product.price, "USD")
        : null,
    qcStatus: product.qc_link ? "available" : "not_linked",
    qcUrl: product.qc_link || null,
    imageCount: product.image ? 1 : 0,
    catalogSyncedIso: getDatasetSyncedIso(),
    titleConfidence: validation.confidence,
    titleTrusted: validation.isTitleTrusted,
    validationIssues: validation.issues,
  };
}

/** Short factual copy — no generated marketing fluff. */
export function getProductDescription(product: Product): string {
  const brand = getDisplayBrand(product);
  const source = getProductSource(product.affiliate_link);
  const validation = validateProduct(product);

  const parts = [
    `Catalog listing in ${product.category}.`,
    brand ? `Listed brand: ${brand}.` : "Brand not verified in catalog metadata.",
    product.qc_link
      ? "QC reference is linked for this find."
      : "No QC reference attached to this listing.",
    `Buy link routes through ${source.toUpperCase()} on LitBuy.`,
    validation.isTitleTrusted
      ? null
      : "Display name simplified because catalog metadata looked inconsistent.",
  ].filter(Boolean) as string[];

  return parts.join(" ");
}

export function getProductHighlights(product: Product): string[] {
  const brand = getDisplayBrand(product);
  const highlights: string[] = [];
  if (brand) highlights.push(`Brand: ${brand}`);
  highlights.push(`Category: ${product.category}`);
  if (hasExactPrice(product.price) && product.price !== null) {
    highlights.push(`Price: ${formatPrice(product.price, "USD")}`);
  }
  highlights.push(`Source: ${getProductSource(product.affiliate_link).toUpperCase()}`);
  highlights.push(product.qc_link ? "QC: linked" : "QC: not linked");

  return highlights;
}

const CATEGORY_ALT_LABELS: Record<string, string> = {
  shoes: "sneaker find",
  "hoodies-and-pants": "streetwear clothing find",
  "coats-and-jackets": "jacket find",
  "tshirts-and-shorts": "clothing find",
  accessories: "accessory find",
  electronics: "electronics find",
};

function getCategoryAltLabel(categorySlug: string, categoryName: string): string {
  return CATEGORY_ALT_LABELS[categorySlug] ?? `${categoryName.toLowerCase()} find`;
}

export function getProductSeoTitle(product: Product): string {
  const name = getDisplayProductName(product);
  const brand = getDisplayBrand(product);
  const titled =
    brand && !name.toLowerCase().includes(brand.toLowerCase())
      ? `${brand} ${name}`
      : name;
  return buildProductMetaTitle(titled);
}

export function getProductImageAlt(product: Product): string {
  const brand = getDisplayBrand(product);
  const name = getDisplayProductName(product);
  const categoryLabel = getCategoryAltLabel(product.category_slug, product.category);
  if (brand) {
    return `${brand} ${name} — ${categoryLabel} with QC photos on LitBuy Finds`;
  }
  return `${name} — ${categoryLabel} on LitBuy Finds`;
}

export function getProductSeoDescription(product: Product): string {
  const brand = getDisplayBrand(product);
  const name = getDisplayProductName(product);
  const price =
    hasExactPrice(product.price) && product.price !== null
      ? formatPrice(product.price, "USD")
      : null;

  return buildProductMetaDescription({
    name,
    brand,
    price,
    hasQc: Boolean(product.qc_link),
  });
}
