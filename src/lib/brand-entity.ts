import { SOCIAL_LINKS, TELEGRAM_CHANNEL_NAME } from "./constants";
import { BUYING_AGENTS } from "./agents";

/** Entity names and common search variants — used in schema, not as visible keyword blocks. */
export const SITE_ALTERNATE_NAMES = [
  "LitBuy Finds",
  "litbuyfinds",
  "LitBuy Spreadsheet",
  "litbuy spreadsheet",
  "litbuy finds spreadsheet",
  "RN Finds",
  "RN Finds Telegram",
  "litbuyfids",
  "litbuy find",
  "litbuyfind",
  "litbuy finds",
  "litbuy qc finds",
] as const;

export const SITE_ENTITY_DESCRIPTION =
  "LitBuy Finds is a product discovery platform for QC photos, spreadsheet finds, fashion finds, sneaker finds, and multi-agent shopping links.";

const SUPPORTED_AGENT_NAMES = BUYING_AGENTS.filter((a) =>
  ["litbuy", "mulebuy", "oopbuy", "acbuy", "kakobuy"].includes(a.id)
)
  .map((a) => a.name)
  .join(", ");

export const HERO_ENTITY_LINE =
  "Verified listings from Weidian and Taobao — searchable like a litbuy spreadsheet catalog, with litbuy QC finds updated daily.";

/** One muted homepage line — natural phrasing for common misspellings, not a keyword list. */
export const HOMEPAGE_AKA_LINE = `Also known as ${TELEGRAM_CHANNEL_NAME} on Telegram and often searched as litbuy finds, litbuyfinds, or litbuy spreadsheet.`;

export const HOMEPAGE_ENTITY_FAQS = [
  {
    question: "What is LitBuy Finds?",
    answer: `${SITE_ENTITY_DESCRIPTION} It turns spreadsheet-style catalogs into searchable pages with QC references, filters, and verified agent buy links.`,
  },
  {
    question: "Is LitBuy Finds a spreadsheet?",
    answer:
      "LitBuy Finds is the searchable web catalog behind spreadsheet-style finds. You get the same type of litbuy spreadsheet and litbuy finds spreadsheet products — organized by brand, category, QC, and price — without scrolling a raw sheet.",
  },
  {
    question: "Does LitBuy Finds support multiple agents?",
    answer: `Yes. Choose your preferred buying agent — ${SUPPORTED_AGENT_NAMES} — and open marketplace listings through that agent. LitBuy is recommended; you can switch anytime.`,
  },
  {
    question: "How often are finds updated?",
    answer:
      "The catalog syncs regularly with new spreadsheet finds, QC links, and trending products. Fresh listings appear in Just Added and Trending sections on the homepage.",
  },
  {
    question: "What agents are supported?",
    answer: `LitBuy Finds supports ${SUPPORTED_AGENT_NAMES}. Each product page builds the correct agent link for Weidian and Taobao listings.`,
  },
] as const;

export function getOrganizationSameAsLinks(): string[] {
  return [
    SOCIAL_LINKS.telegram,
    SOCIAL_LINKS.discord,
    SOCIAL_LINKS.instagram,
    SOCIAL_LINKS.tiktok,
  ];
}

export function getOrganizationKnowsAbout(): string[] {
  return [
    "LitBuy product discovery",
    "litbuy spreadsheet finds",
    "litbuy QC finds",
    "shopping agents",
    "QC photos",
    "Weidian finds",
    "Taobao finds",
    "sneaker finds",
    "fashion finds",
    "multi-agent shopping links",
    TELEGRAM_CHANNEL_NAME,
  ];
}
