import { PUBLIC_CATALOG_COUNT } from "./catalog-count-public";

export const META_SCALE = PUBLIC_CATALOG_COUNT;

export const META_AGENTS = "LitBuy, MuleBuy, OopBuy, Kakobuy and ACBuy";

/** Value stack used across descriptions — no weak openers (browse/explore/discover). */
export const META_VALUE_STACK =
  "verified shopping links, QC photos, shipping coupons, agent discounts and daily updates";

const DESCRIPTION_MAX = 158;
const TITLE_MAX = 58;

export function truncateMetaDescription(
  text: string,
  max = DESCRIPTION_MAX
): string {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= max) return normalized;
  const trimmed = normalized.slice(0, max - 1).trimEnd();
  const lastSpace = trimmed.lastIndexOf(" ");
  const cut =
    lastSpace > max * 0.55 ? trimmed.slice(0, lastSpace) : trimmed;
  return `${cut}…`;
}

/** Keep titles within typical Google SERP display width. */
export function truncateMetaTitle(text: string, max = TITLE_MAX): string {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= max) return normalized;
  const trimmed = normalized.slice(0, max - 1).trimEnd();
  const lastPipe = trimmed.lastIndexOf("|");
  const lastSpace = trimmed.lastIndexOf(" ");
  const cut =
    lastPipe > max * 0.45
      ? trimmed.slice(0, lastPipe).trimEnd()
      : lastSpace > max * 0.55
        ? trimmed.slice(0, lastSpace)
        : trimmed;
  return `${cut}…`;
}

export function getHomepageMetadataCopy() {
  return {
    title: truncateMetaTitle(
      `LitBuy Finds 2026 | ${META_SCALE} QC Photos, Spreadsheet Finds & Best Reps`,
      72
    ),
    description: truncateMetaDescription(
      `Browse ${META_SCALE} LitBuy finds with QC photos, spreadsheet discovery, sneaker and clothing finds, coupons, Discord community alerts, and multi-agent support.`
    ),
  };
}

export function getBrandsHubMetadataCopy() {
  return {
    title: truncateMetaTitle(
      `Nike, Jordan, Adidas & More | LitBuy Brand Directory`
    ),
    description: truncateMetaDescription(
      `Browse the LitBuy Finds catalog by brand — Nike, Jordan, Adidas, Louis Vuitton, Gucci and ${META_SCALE} indexed finds. ${META_VALUE_STACK}.`
    ),
  };
}

/** CollectionPage / on-page name — distinct from homepage title to avoid branded cannibalization. */
export const BRANDS_HUB_SCHEMA_NAME = "LitBuy Brand Directory";

export function getCategoriesHubMetadataCopy() {
  return {
    title: truncateMetaTitle(
      `${META_SCALE} QC-Approved Finds | Shoes, Jackets, Bags & Streetwear`
    ),
    description: truncateMetaDescription(
      `${META_SCALE} categorized QC finds — sneakers, hoodies, jackets, bags and accessories. ${META_VALUE_STACK}. ${META_AGENTS}.`
    ),
  };
}

export function getTrendingMetadataCopy() {
  return {
    title: truncateMetaTitle(
      "Trending QC Finds Today | Hot Picks, Coupons & Agent Links"
    ),
    description: truncateMetaDescription(
      `Today's hottest QC-approved finds with ${META_VALUE_STACK}. Multi-agent checkout via ${META_AGENTS}.`
    ),
  };
}

export function getCollectionsHubMetadataCopy() {
  return {
    title: truncateMetaTitle(
      `${META_SCALE} Curated Collections | QC Finds, Brands & Deals`
    ),
    description: truncateMetaDescription(
      `Hand-picked Nike, Jordan, Moncler and QC collections with ${META_VALUE_STACK}. ${META_AGENTS}.`
    ),
  };
}

export function getSpreadsheetMetadataCopy() {
  return {
    title: truncateMetaTitle(
      `LitBuy Spreadsheet | ${META_SCALE} QC Photos & Agent Links`
    ),
    description: truncateMetaDescription(
      `Searchable LitBuy spreadsheet with ${META_SCALE} curated finds, QC photos, ${META_VALUE_STACK}. ${META_AGENTS}.`
    ),
  };
}

const CATEGORY_TITLE_SUFFIX: Record<string, string> = {
  shoes: "Nike, Jordan, Adidas & More",
  hoodies: "Streetwear Layers & QC Picks",
  jackets: "Moncler, Stone Island & More",
  tshirts: "Graphic Tees & Daily Staples",
  bags: "Designer Bags & Backpacks",
  pants: "Joggers, Cargos & Streetwear",
  "hoodies-and-pants": "Streetwear Layers & QC Picks",
  "coats-and-jackets": "Moncler, Canada Goose & More",
  "tshirts-and-shorts": "Tees, Shorts & Summer Picks",
  accessories: "Bags, Belts & Designer Picks",
  "electronic-products": "Tech & Gadget Picks",
  electronics: "Tech & Gadget Picks",
};

export function buildCategoryMetaTitle(name: string, slug: string): string {
  const suffix =
    CATEGORY_TITLE_SUFFIX[slug] ?? "QC Photos & Verified Links";
  return truncateMetaTitle(`QC-Approved ${name} Finds | ${suffix}`);
}

export function buildCategoryMetaDescription(
  name: string,
  count: number
): string {
  return truncateMetaDescription(
    `${count.toLocaleString()} QC-approved ${name.toLowerCase()} finds with ${META_VALUE_STACK}. ${META_AGENTS}.`
  );
}

const PREMIUM_BRAND_SLUGS = new Set([
  "nike",
  "jordan",
  "adidas",
  "gucci",
  "louis-vuitton",
  "moncler",
  "balenciaga",
  "prada",
  "dior",
  "chrome-hearts",
  "stussy",
]);

export function buildBrandMetaTitle(name: string, slug: string): string {
  if (PREMIUM_BRAND_SLUGS.has(slug)) {
    return truncateMetaTitle(
      `${name} QC Finds | QC Photos, Coupons & Verified Links`
    );
  }
  return truncateMetaTitle(`${name} LitBuy Finds | QC Photos & Agent Discounts`);
}

export function buildBrandMetaDescription(
  name: string,
  count: number,
  categoryLine: string
): string {
  return truncateMetaDescription(
    `${count.toLocaleString()} QC-approved ${name} finds — ${categoryLine}. ${META_VALUE_STACK}. ${META_AGENTS}.`
  );
}

export function buildProductMetaTitle(productName: string): string {
  return truncateMetaTitle(
    `${productName} | QC Photos, Price & Verified Agent Links`
  );
}

/** SEO title for product detail pages — rep-find focused. */
export function buildProductRepFindTitle(options: {
  name: string;
  brand: string | null;
  hasQc: boolean;
}): string {
  const { name, brand, hasQc } = options;
  const lead =
    brand && !name.toLowerCase().includes(brand.toLowerCase())
      ? `${brand} ${name}`
      : name;
  const qcBit = hasQc ? " - QC Photos" : "";
  return truncateMetaTitle(`${lead} Rep Find${qcBit} & Agent Link`);
}

export function buildProductMetaDescription(options: {
  name: string;
  brand: string | null;
  price: string | null;
  hasQc: boolean;
}): string {
  const { name, brand, price, hasQc } = options;
  const lead = brand ? `${brand} ${name}` : name;
  const priceBit = price ? ` from ${price}` : "";
  const qcBit = hasQc ? "QC photos, " : "";

  return truncateMetaDescription(
    `${lead}${priceBit} — ${qcBit}verified shopping links, shipping coupons, agent discounts and ${META_AGENTS} checkout.`
  );
}
