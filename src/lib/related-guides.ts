import { extractBrand } from "./brands";
import { getGuide, getAllGuides } from "./guides";
import type { Product } from "./types";

const CATEGORY_GUIDES: Record<string, string[]> = {
  shoes: [
    "best-rep-sneakers",
    "best-nike-finds",
    "best-jordan-finds",
    "qc-checklist-for-shoes",
  ],
  "hoodies-and-pants": ["best-hoodie-finds", "best-pants-finds", "best-streetwear-finds"],
  "coats-and-jackets": ["best-jacket-finds", "best-winter-finds"],
  "tshirts-and-shorts": ["best-tshirt-finds", "best-summer-finds"],
  accessories: ["best-accessory-finds", "best-bag-finds", "qc-checklist-for-bags"],
  electronics: ["how-to-use-litbuy-finds", "beginner-guide-to-litbuy"],
  "trending-now": ["best-rep-sneakers", "best-streetwear-finds"],
  "latest-finds": ["how-to-use-litbuy-finds", "best-budget-finds"],
};

const BRAND_GUIDES: Record<string, string[]> = {
  nike: ["best-nike-finds", "best-rep-sneakers"],
  jordan: ["best-jordan-finds", "qc-checklist-for-shoes"],
  adidas: ["best-adidas-finds", "best-rep-sneakers"],
  "new-balance": ["best-new-balance-finds"],
  asics: ["best-asics-finds"],
  gucci: ["best-gucci-finds"],
  "louis-vuitton": ["best-louis-vuitton-finds"],
  moncler: ["best-moncler-finds"],
  supreme: ["best-supreme-finds"],
  "ralph-lauren": ["best-ralph-lauren-finds"],
  prada: ["best-prada-finds"],
  "chrome-hearts": ["best-chrome-hearts-finds"],
};

const DEFAULT_GUIDES = [
  "beginner-guide-to-litbuy",
  "how-to-order-from-litbuy",
  "what-are-qc-photos",
  "how-to-check-qc-photos",
];

function resolveGuideSlugs(slugs: string[]): { href: string; label: string }[] {
  const links: { href: string; label: string }[] = [];
  const seen = new Set<string>();

  for (const slug of slugs) {
    if (seen.has(slug)) continue;
    const guide = getGuide(slug);
    if (!guide) continue;
    seen.add(slug);
    links.push({ href: guide.path, label: guide.title });
  }

  return links;
}

export function getRelatedGuidesForCategory(categorySlug: string, limit = 4) {
  return resolveGuideSlugs([
    ...(CATEGORY_GUIDES[categorySlug] ?? []),
    ...DEFAULT_GUIDES,
  ]).slice(0, limit);
}

export function getRelatedGuidesForBrand(brandSlug: string, limit = 4) {
  return resolveGuideSlugs([
    ...(BRAND_GUIDES[brandSlug] ?? []),
    "best-streetwear-finds",
    ...DEFAULT_GUIDES,
  ]).slice(0, limit);
}

export function getRelatedGuidesForProduct(product: Product, limit = 4) {
  const brand = extractBrand(product.product_name);
  const brandSlug = brand?.toLowerCase().replace(/\s+/g, "-") ?? "";
  const slugs = [
    ...(BRAND_GUIDES[brandSlug] ?? []),
    ...(CATEGORY_GUIDES[product.category_slug] ?? []),
    ...(product.qc_link ? ["how-to-check-qc-photos"] : []),
    ...DEFAULT_GUIDES,
  ];
  return resolveGuideSlugs(slugs).slice(0, limit);
}

export function getFeaturedGuides(limit = 3) {
  return resolveGuideSlugs(
    getAllGuides()
      .filter((guide) => guide.category === "beginner" || guide.category === "qc")
      .map((guide) => guide.slug)
  ).slice(0, limit);
}
