import { LITBUY_SIGNUP_URL } from "../constants";

export const CORE_LINKS = [
  { href: "/guides", label: "All guides" },
  { href: LITBUY_SIGNUP_URL, label: "LitBuy coupons" },
  { href: "/about", label: "About LitBuy Finds" },
  { href: "/contact", label: "Contact" },
  { href: "/trending", label: "Trending finds" },
  { href: "/recently-added", label: "Recently added" },
  { href: "/categories", label: "Browse categories" },
  { href: "/brands", label: "Browse brands" },
] as const;

export function guidePath(slug: string) {
  return `/guides/${slug}`;
}
