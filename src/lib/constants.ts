import { PUBLIC_CATALOG_COUNT } from "./catalog-count";
import { getHomepageMetadataCopy } from "./metadata-copy";

export const SITE_NAME = "LitBuy Finds";

export { PUBLIC_CATALOG_COUNT };

const homepageMeta = getHomepageMetadataCopy();

export const HOMEPAGE_TITLE = homepageMeta.title;

export const SITE_DESCRIPTION = homepageMeta.description;

export const SITE_OG_TITLE = HOMEPAGE_TITLE;

export const SITE_OG_DESCRIPTION = SITE_DESCRIPTION;

export const HERO_HEADLINE =
  "LitBuy Finds – 10,000+ QC Photos, Spreadsheet Finds & Best Reps 2026";

export const HERO_SUBHEADLINE =
  "Search QC photos, spreadsheet-style fashion and sneaker finds from Weidian and Taobao — open verified links through LitBuy, OopBuy, Kakobuy, MuleBuy, or ACBuy.";

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

export const TELEGRAM_CHANNEL_NAME = "RN Finds";

export const TELEGRAM_MEMBER_LABEL = "40,000+ members";

/** Business / advertising inquiries only — not general support */
export const TELEGRAM_COLLAB_CONTACT = "@smukasolas";

export const TELEGRAM_COLLAB_URL = "https://t.me/smukasolas";

export const CONTACT_EMAIL = "hello@litbuyfinds.io";

export const EXCHANGE_RATES = {
  USD: 1,
  EUR: 0.93,
  CNY: 6.5,
};

export type { AgentId } from "./agents";
export { AGENTS, BUYING_AGENTS, DEFAULT_AGENT_ID, isAgentId } from "./agents";
export type CurrencyCode = "USD" | "EUR" | "CNY";
