import { LITBUY_SIGNUP_URL, SOCIAL_LINKS } from "./constants";

export const LITBUY_SEO_HOME_TITLE =
  "LitBuy Finds – Verified QC Items & Top Spreadsheet Finds";

export const LITBUY_SEO_HOME_DESCRIPTION =
  "Discover verified LitBuy finds with QC photos, spreadsheet picks, Telegram alerts, Discord community, coupons, and agent links — updated daily.";

export const LITBUY_HERO_SUBTITLE = "Discover verified finds from LitBuy";

export const LITBUY_PLATFORM_CTAS = [
  {
    href: SOCIAL_LINKS.telegram,
    label: "Join LitBuy Telegram ✅",
    external: true,
    variant: "telegram" as const,
  },
  {
    href: SOCIAL_LINKS.discord,
    label: "Join LitBuy Discord ✅",
    external: true,
    variant: "discord" as const,
  },
  {
    href: "/litbuy-coupons",
    label: "Claim LitBuy Coupon ✅",
    external: false,
    variant: "coupon" as const,
  },
  {
    href: "/litbuy-spreadsheet",
    label: "View LitBuy Spreadsheet",
    external: false,
    variant: "spreadsheet" as const,
  },
] as const;

export const LITBUY_SEO_HUB_LINKS = [
  { href: "/", label: "LitBuy Finds homepage" },
  { href: "/telegram-litbuy", label: "LitBuy Telegram" },
  { href: "/discord-litbuy", label: "LitBuy Discord" },
  { href: "/litbuy-coupons", label: "LitBuy Coupons" },
  { href: "/best-litbuy-coupons", label: "Best LitBuy Coupons" },
  { href: "/litbuy-coupons-2026", label: "LitBuy Coupons 2026" },
  { href: "/litbuy-spreadsheet", label: "LitBuy Spreadsheet" },
  { href: "/litbuy-finds", label: "LitBuy Finds catalog" },
  { href: "/litbuy-qc", label: "LitBuy QC guide" },
  { href: "/trending", label: "Trending finds" },
] as const;

export const LITBUY_SPREADSHEET_CTA = {
  href: "/#browse",
  label: "Browse LitBuy Spreadsheet Finds",
};

export const LITBUY_COUPON_CLAIM_URL = LITBUY_SIGNUP_URL;
