export const SITE_NAME = "LitBuy Finds";

export const HOMEPAGE_TITLE =
  "LitBuy Finds | Premium Product Discovery, QC Guides & Verified Finds";

export const SITE_DESCRIPTION =
  "Discover trending sneakers, fashion finds, QC-approved products, buying guides, trusted agent resources and daily LitBuy finds.";

export const SITE_OG_DESCRIPTION =
  "Discover trending sneakers, fashion finds, QC-approved products, buying guides, trusted agent resources and daily LitBuy finds.";

export const HERO_TAGLINE =
  "Discover the best LitBuy finds, QC-approved products, verified links and trending fashion finds.";

export const SITE_TAGLINE = "Fashion, sneakers & designer finds";

/** Universal promotional banner — homepage, modal, and social previews */
export const PROMO_BANNER_PROMO = "/banners/litbuy-finds-promo.webp";
export const PROMO_BANNER_MODAL = "/banners/litbuy-finds-modal.webp";
export const PROMO_BANNER_OG = "/banners/litbuy-finds-og.jpg";
export const PROMO_BANNER_ALT =
  "LitBuy Finds — Real finds. Real quality. Curated fashion, verified quality, updated daily.";

export const PROMO_OG_IMAGE_URL = `https://litbuyfinds.io${PROMO_BANNER_OG}`;

export const LITBUY_SIGNUP_URL =
  "https://litbuy.com/register?inviteCode=SMKS";

/** Primary register CTA — use on every signup button site-wide */
export const REGISTER_CTA_LABEL = "Claim 30% Coupon";
export const REGISTER_HEADER_CTA_LABEL = "Free account";
export const REGISTER_MODAL_CTA_LABEL = "Register on LitBuy";
export const BROWSE_FINDS_CTA_LABEL = "Browse Finds";

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
