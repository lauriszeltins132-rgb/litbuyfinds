export const SITE_NAME = "LitBuy Finds";
export const SITE_TAGLINE = "Premium product discovery";
export const SITE_DESCRIPTION =
  "LitBuy Finds is a curated discovery platform for hand-picked products, verified links, real QC, and daily finds across fashion, sneakers, accessories, and electronics.";

export const LITBUY_SIGNUP_URL =
  "https://litbuy.com/register?inviteCode=SMKS";

export const LITBUY_OFFER_HEADLINE = "Get 40% Off Shipping";
export const LITBUY_OFFER_DESCRIPTION =
  "New users can register through LitBuy and unlock a shipping discount.";

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
