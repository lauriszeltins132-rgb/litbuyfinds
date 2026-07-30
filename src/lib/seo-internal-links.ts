import { LITBUY_SIGNUP_URL } from "./constants";

/** Cross-site SEO hub links — use in relatedLinks and contextual sections. */
export const SEO_HUB_LINKS = [
  { href: "/", label: "Homepage" },
  { href: "/finds", label: "Finds hub" },
  { href: "/litbuy-finds", label: "LitBuy finds" },
  { href: "/litbuy-spreadsheet", label: "LitBuy spreadsheet" },
  { href: LITBUY_SIGNUP_URL, label: "LitBuy coupons" },
  { href: "/litbuy-discord", label: "LitBuy Discord" },
  { href: "/telegram-litbuy", label: "LitBuy Telegram" },
] as const;

export const SPREADSHEET_CLUSTER_LINKS = [
  { href: "/litbuy-spreadsheet", label: "LitBuy spreadsheet" },
  { href: "/kakobuy-spreadsheet", label: "Kakobuy spreadsheet" },
  { href: "/mulebuy-spreadsheet", label: "MuleBuy spreadsheet" },
  { href: "/oopbuy-spreadsheet", label: "OopBuy spreadsheet" },
  { href: "/acbuy-spreadsheet", label: "ACBuy spreadsheet" },
  { href: "/nike-spreadsheet", label: "Nike spreadsheet" },
  { href: "/streetwear-spreadsheet", label: "Streetwear spreadsheet" },
] as const;

export const AGENT_FINDS_LINKS = [
  { href: "/litbuy-finds", label: "LitBuy finds" },
  { href: "/mulebuy-finds", label: "MuleBuy finds" },
  { href: "/kakobuy-finds", label: "Kakobuy finds" },
  { href: "/hipobuy-finds", label: "HipoBuy finds" },
  { href: "/oopbuy-finds", label: "OopBuy finds" },
  { href: "/acbuy-finds", label: "ACBuy finds" },
] as const;

export const CATEGORY_FINDS_LINKS = [
  { href: "/sneaker-finds", label: "Sneaker finds" },
  { href: "/clothing-finds", label: "Clothing finds" },
  { href: "/streetwear-finds", label: "Streetwear finds" },
  { href: "/hoodie-finds", label: "Hoodie finds" },
  { href: "/jacket-finds", label: "Jacket finds" },
  { href: "/bag-finds", label: "Bag finds" },
  { href: "/cheap-finds", label: "Cheap finds" },
  { href: "/best-rep-finds", label: "Best rep finds" },
] as const;
