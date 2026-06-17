import { PUBLIC_CATALOG_COUNT, formatCatalogCountForSeo } from "./catalog-count";

export const SITE_NAME = "LitBuy Finds";

const CATALOG_COUNT = formatCatalogCountForSeo();

export { PUBLIC_CATALOG_COUNT };

export const HOMEPAGE_TITLE = `${CATALOG_COUNT} QC Approved LitBuy Finds`;

export const SITE_DESCRIPTION =
  "Browse 10,000+ curated LitBuy finds including sneakers, jackets, hoodies, bags, accessories, QC-approved products, verified links, and daily trending finds.";

export const SITE_OG_TITLE = `${CATALOG_COUNT} QC Approved LitBuy Finds`;

export const SITE_OG_DESCRIPTION =
  "Browse 10,000+ curated LitBuy finds including sneakers, jackets, hoodies, bags, accessories, QC-approved products, verified links, and daily trending finds.";

export const HERO_HEADLINE = "Discover the Best LitBuy Finds";

export const HERO_SUBHEADLINE =
  "LitBuy Finds turns spreadsheet-style catalogs into searchable pages — QC approved products from Weidian and Taobao with verified LitBuy links and daily updates.";

export const HERO_TAGLINE = HERO_SUBHEADLINE;

export const SITE_TAGLINE = "QC-approved fashion, sneakers & designer finds";

export const POPULAR_SEARCHES = [
  "Nike",
  "Jordan",
  "Moncler",
  "Canada Goose",
  "Stone Island",
  "Bags",
  "Jackets",
  "Sneakers",
] as const;

/** Universal promotional banner — OG/social only (not homepage hero) */
export const PROMO_BANNER_PROMO = "/banners/litbuy-finds-promo.webp";
export const PROMO_BANNER_MODAL = "/banners/litbuy-finds-modal.webp";
export const PROMO_BANNER_OG = "/banners/litbuy-finds-og.jpg";
export const PROMO_BANNER_ALT =
  "LitBuy Finds — Real finds. Real quality. Curated fashion, verified quality, updated daily.";

export const PROMO_OG_IMAGE_URL = `https://litbuyfinds.io${PROMO_BANNER_OG}`;

export const LITBUY_SIGNUP_URL =
  "https://litbuy.com/register?inviteCode=SMKS";

/** Benefit-driven CTAs site-wide */
export const REGISTER_CTA_LABEL = "Register & Get Shipping Discount";
export const REGISTER_HEADER_CTA_LABEL = "30% Off Shipping";
export const REGISTER_MODAL_CTA_LABEL = "Start Your LitBuy Haul";
export const REGISTER_STICKY_CTA_LABEL = "Unlock Verified Links";
export const MOBILE_POPUP_CTA_A = "Register & Save 30%";
export const MOBILE_POPUP_CTA_B = "Unlock Verified Links";
export const MOBILE_POPUP_BADGE = "Save up to 30% on shipping";
export const MOBILE_POPUP_HEADLINE = "Unlock Your LitBuy Account";
export const MOBILE_POPUP_SUBTEXT =
  "Get cheaper shipping, QC photos, verified links and order tracking.";

export const MOBILE_POPUP_BENEFITS = [
  "Save up to 30% on shipping",
  "Unlock QC photos",
  "Open verified product links",
  "Track all orders",
  "Save favorite finds",
] as const;

export const MOBILE_POPUP_URGENCY =
  "Most LitBuy users save money on shipping with a free account.";
export const REGISTER_SAVE_CTA_LABEL = "Register & Save Finds";
export const REGISTER_QC_CTA_LABEL = "Register & Unlock QC Photos";
export const REGISTER_EXIT_CTA_LABEL = "Create Free LitBuy Account";
export const BROWSE_FINDS_CTA_LABEL = "Browse Finds";

export const LITBUY_ACCOUNT_BENEFITS = [
  "Access QC photos",
  "Track warehouse orders",
  "Save favorite finds",
  "Compare sellers",
  "Get shipping discounts",
  "Faster checkout process",
] as const;

export const LITBUY_STICKY_BENEFITS = [
  "QC Photos",
  "Verified Links",
  "Order Tracking",
  "Shipping Discounts",
  "Save Favorites",
] as const;

export const LITBUY_OFFER_HEADLINE = "Get 30% Off Shipping";
export const LITBUY_OFFER_DESCRIPTION =
  "New LitBuy users can claim an exclusive shipping discount.";

export const SOCIAL_LINKS = {
  tiktok: "https://www.tiktok.com/@smks.reps?_r=1&_t=ZN-974SmdjFxFG",
  instagram:
    "https://www.instagram.com/smukasolass?igsh=bmFrMGlubmZpcXVy&utm_source=qr",
  discord: "https://discord.gg/G3Ryc2JE3Q",
  telegram: "https://t.me/RNFinds",
};

export const TELEGRAM_HANDLE = "@RNFinds";

export const CONTACT_EMAIL = "hello@litbuyfinds.io";

export const EXCHANGE_RATES = {
  USD: 1,
  EUR: 0.93,
  CNY: 6.5,
};

export const AGENTS = [
  {
    id: "litbuy",
    name: "LitBuy",
    signupUrl: LITBUY_SIGNUP_URL,
    description: "Primary buying agent",
  },
] as const;

export type AgentId = (typeof AGENTS)[number]["id"];
export type CurrencyCode = "USD" | "EUR" | "CNY";
