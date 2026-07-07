import { PUBLIC_CATALOG_COUNT } from "./catalog-count";

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
      "LitBuy Finds | QC Photos, Spreadsheet Finds, Weidian & Taobao Links"
    ),
    description: truncateMetaDescription(
      `Search ${META_SCALE} LitBuy finds, QC photos, spreadsheet-style product links, Weidian finds, Taobao finds, sneaker finds, fashion finds, and agent shopping finds.`
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
      "LitBuy Spreadsheet | Verified QC Photos, Product Finds & Agent Links"
    ),
    description: truncateMetaDescription(
      "Browse a searchable LitBuy spreadsheet with QC photos, Weidian links, Taobao products, sneaker finds, fashion finds, bags, jackets, hoodies, and trending agent shopping finds."
    ),
  };
}

export function getKakobuySpreadsheetMetadataCopy() {
  return {
    title: truncateMetaTitle(
      "Kakobuy Spreadsheet | QC Photos, Product Finds & Weidian Links"
    ),
    description: truncateMetaDescription(
      "Explore Kakobuy spreadsheet-style finds with QC photos, Weidian products, Taobao links, sneaker finds, fashion items, budget picks, and trending product links."
    ),
  };
}

export function getMulebuyFindsMetadataCopy() {
  return {
    title: truncateMetaTitle(
      "MuleBuy Finds | QC Photos, Spreadsheet Links & Fashion Finds"
    ),
    description: truncateMetaDescription(
      "Find MuleBuy product links, QC photos, spreadsheet-style finds, Weidian items, Taobao products, sneakers, jackets, bags, hoodies, and fashion finds."
    ),
  };
}

export function getOopbuyFindsMetadataCopy() {
  return {
    title: truncateMetaTitle(
      "OopBuy Finds | QC Photos, Spreadsheet Links & Sneaker Finds"
    ),
    description: truncateMetaDescription(
      "Browse OopBuy product links, QC photos, spreadsheet-style finds, Weidian listings, Taobao products, sneakers, jackets, and streetwear picks."
    ),
  };
}

export function getAcbuyFindsMetadataCopy() {
  return {
    title: truncateMetaTitle(
      "ACBuy Finds | QC Photos, Spreadsheet Links & Fashion Finds"
    ),
    description: truncateMetaDescription(
      "Discover ACBuy product links, QC photos, spreadsheet-style finds, Weidian items, Taobao products, sneakers, bags, hoodies, and fashion finds."
    ),
  };
}

export function getKakobuyFindsMetadataCopy() {
  return {
    title: truncateMetaTitle(
      "Kakobuy Finds | QC Photos, Spreadsheet Links & Sneaker Finds"
    ),
    description: truncateMetaDescription(
      "Explore Kakobuy product links, QC photos, spreadsheet-style finds, Weidian listings, Taobao products, sneakers, jackets, and streetwear picks."
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
