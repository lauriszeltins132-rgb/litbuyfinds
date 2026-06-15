export const SITE_NAME = "LitBuy Finds";

export const HOMEPAGE_TITLE =
  "LitBuy Finds | Premium Product Discovery, QC Guides & Verified Finds";

export const SITE_DESCRIPTION =
  "Discover trending sneakers, fashion finds, QC-approved products, buying guides, trusted agent resources and daily LitBuy finds.";

export const SITE_OG_DESCRIPTION =
  "Discover trending sneakers, fashion finds, QC-approved products, buying guides, trusted agent resources and daily LitBuy finds.";

export const HERO_HEADLINE = "Discover the Best LitBuy Finds";

export const HERO_SUBHEADLINE =
  "Curated fashion finds, verified links, QC photos, and daily updates.";

export const HERO_TAGLINE = HERO_SUBHEADLINE;

export const SITE_TAGLINE = "Fashion, sneakers & designer finds";

export const POPULAR_SEARCHES = [
  "Nike",
  "Jordan",
  "Moncler",
  "Stone Island",
  "Arc'teryx",
  "Canada Goose",
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
export const REGISTER_CTA_LABEL = "Get 30% Shipping Discount";
export const REGISTER_HEADER_CTA_LABEL = "Unlock QC Photos";
export const REGISTER_MODAL_CTA_LABEL = "Get Your LitBuy Account";
export const REGISTER_STICKY_CTA_LABEL = "Unlock Access";
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
