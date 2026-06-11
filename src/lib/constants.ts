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

export const LITBUY_SIGNUP_URL =
  "https://litbuy.com/register?inviteCode=SMKS";

export const LITBUY_OFFER_HEADLINE = "Verified LitBuy agent links";
export const LITBUY_OFFER_DESCRIPTION =
  "Register on LitBuy to buy through trusted agent checkout — confirm QC and pricing before you ship.";

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
