/** Core LitBuy authority URLs — single source for internal linking. */
import { LITBUY_SIGNUP_URL } from "./constants";

export const LITBUY_AUTHORITY_LINKS = [
  { href: "/litbuy-finds", label: "LitBuy Finds catalog" },
  { href: "/litbuy-spreadsheet", label: "LitBuy Spreadsheet" },
  { href: "/what-is-litbuy", label: "What is LitBuy" },
  { href: "/what-is-litbuy-finds", label: "What is LitBuy Finds" },
  { href: "/how-to-use-litbuy", label: "How to use LitBuy" },
  { href: "/litbuy-qc-photos", label: "LitBuy QC photos" },
  { href: LITBUY_SIGNUP_URL, label: "LitBuy coupons" },
  { href: "/telegram-litbuy", label: "LitBuy Telegram" },
  { href: "/litbuy-discord", label: "LitBuy Discord" },
  { href: "/discord-litbuy", label: "Join Discord" },
  { href: "/ai", label: "LitBuy AI" },
  { href: "/litbuy-review", label: "LitBuy review" },
  { href: "/is-litbuy-legit", label: "Is LitBuy legit" },
  { href: "/is-litbuy-safe", label: "Is LitBuy safe" },
] as const;

export const LITBUY_HUB_FOOTER_LINKS = [
  { href: "/litbuy-guide", label: "LitBuy guide hub" },
  { href: "/litbuy-spreadsheet-2026", label: "Spreadsheet 2026" },
  { href: "/guides", label: "All guides" },
  { href: "/about", label: "About LitBuy Finds" },
] as const;
