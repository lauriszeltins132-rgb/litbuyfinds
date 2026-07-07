import { SOCIAL_LINKS, TELEGRAM_CHANNEL_NAME } from "./constants";
import { BUYING_AGENTS } from "./agents";

/** Entity names and common search variants — used in schema, not as visible keyword blocks. */
export const SITE_ALTERNATE_NAMES = [
  "LitBuy Finds",
  "litbuyfinds",
  "LitBuy Spreadsheet",
  "litbuy spreadsheet",
  "litbuy finds spreadsheet",
  "kakobuy spreadsheet",
  "kakobuy finds",
  "mulebuy spreadsheet",
  "mulebuy finds",
  "oopbuy spreadsheet",
  "oopbuy finds",
  "acbuy spreadsheet",
  "acbuy finds",
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
    question: "What is the difference between LitBuy Finds and a spreadsheet?",
    answer:
      "A raw LitBuy spreadsheet is a long list of links and photos that is hard to search on mobile. LitBuy Finds organizes the same type of products into brand pages, category filters, QC badges, and shareable collection links — so you can find Nike, Moncler, or sneaker picks in seconds instead of scrolling hundreds of rows.",
  },
  {
    question: "Is LitBuy safe to use?",
    answer:
      "LitBuy is an established shopping agent used by thousands of buyers for Weidian and Taobao orders. LitBuy Finds only links to marketplace listings through verified agent URLs — we do not sell products directly. Always review QC photos, compare batches, and use common sense before shipping a haul.",
  },
  {
    question: "How do I order from LitBuy?",
    answer:
      "Create a free LitBuy account, open a product from LitBuy Finds, and add it to your cart through the agent link. Pay for the item, wait for warehouse QC photos, approve or exchange if needed, then combine items into a shipment. Our beginner guide walks through each step.",
  },
  {
    question: "Are QC photos real?",
    answer:
      "QC (quality control) photos are taken in the agent warehouse after your item arrives — not marketing renders from the seller. When a find on LitBuy Finds includes a QC reference, it usually means other buyers have documented that listing. Your own QC set will still be taken when your order lands.",
  },
  {
    question: "Does LitBuy ship worldwide?",
    answer:
      "Yes. LitBuy and the other supported agents ship to most countries via lines like EMS, DHL, and economy options. Shipping cost depends on weight, dimensions, and your destination — use rehearsal packing when available to avoid surprises.",
  },
  {
    question: "Can I use other agents besides LitBuy?",
    answer: `Yes. Every product page supports ${SUPPORTED_AGENT_NAMES}. LitBuy is recommended for shipping coupons and a smooth checkout, but you can switch agents before opening a link if you already have an account elsewhere.`,
  },
  {
    question: "How often are new finds added?",
    answer:
      "The catalog syncs daily with new spreadsheet finds, QC links, and price updates. Fresh drops appear in Latest Finds and Trending sections on the homepage — check back often or join Discord and Telegram for alerts.",
  },
  {
    question: "What are the best LitBuy finds right now?",
    answer:
      "Trending Today and Editor's Picks on the homepage highlight what buyers are clicking now. For brand-specific hauls, open collections like Best Nike Finds, Best Jordan Finds, or Best QC Approved Finds — each page is updated as the catalog syncs.",
  },
  {
    question: "Does LitBuy Finds support multiple agents?",
    answer: `Yes. Choose your preferred buying agent — ${SUPPORTED_AGENT_NAMES} — and open marketplace listings through that agent. LitBuy is recommended; you can switch anytime.`,
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
