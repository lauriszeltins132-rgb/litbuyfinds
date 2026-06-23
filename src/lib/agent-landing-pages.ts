import type { SeoLandingConfig } from "./seo-landing-pages";
import { filterFeaturedEligible } from "./product-media";
import { hasExactPrice } from "./pricing";
import { getAllProducts, getTrendingProducts } from "./products";

const AGENT_LINKS = [
  { href: "/litbuy-finds", label: "LitBuy finds" },
  { href: "/kakobuy-finds", label: "Kakobuy finds" },
  { href: "/oopbuy-finds", label: "OopBuy finds" },
  { href: "/hipobuy-finds", label: "HipoBuy finds" },
  { href: "/acbuy-finds", label: "ACBuy finds" },
  { href: "/mulebuy-finds", label: "MuleBuy finds" },
  { href: "/litbuy-spreadsheet", label: "LitBuy spreadsheet" },
];

function featuredProducts(limit = 72) {
  return filterFeaturedEligible(
    getAllProducts().filter((product) => hasExactPrice(product.price))
  ).slice(0, limit);
}

function trendingProducts(limit = 72) {
  return getTrendingProducts().slice(0, limit);
}

type AgentLandingSeed = {
  slug: string;
  agentName: string;
  title: string;
  metaDescription: string;
  badge: string;
  h1: string;
  intro: string;
  extraParagraph: string;
};

function buildAgentLandingConfig(seed: AgentLandingSeed): SeoLandingConfig {
  const path = `/${seed.slug}`;
  const isLitBuy = seed.agentName === "LitBuy";

  return {
    slug: seed.slug,
    path,
    title: seed.title,
    metaDescription: seed.metaDescription,
    badge: seed.badge,
    h1: seed.h1,
    intro: seed.intro,
    sections: [
      {
        heading: isLitBuy ? "Why LitBuy is recommended" : `Using ${seed.agentName} with LitBuy Finds`,
        paragraphs: [
          seed.extraParagraph,
          "Browse the same verified catalog on LitBuy Finds — photos, QC references where available, and filters by brand or category. Pick your preferred agent from the header before you buy.",
        ],
        links: AGENT_LINKS,
      },
      {
        heading: "How buying works",
        level: 3,
        paragraphs: [
          "Open any product, review photos and QC when available, then choose LitBuy (recommended) or another supported agent. Your agent preference is saved while you browse.",
          "Prices shown here come from the source catalog — always confirm the live listing price on your agent before checkout.",
        ],
      },
    ],
    faqs: [
      {
        question: `Can I buy with ${seed.agentName} on LitBuy Finds?`,
        answer: `Yes. LitBuy Finds stays LitBuy-first, but you can set ${seed.agentName} as your preferred agent in the header or choose it when you press Buy on any product.`,
      },
      {
        question: "Is LitBuy still the recommended agent?",
        answer:
          "Yes. LitBuy is our recommended agent for verified links, QC workflow, and the catalog this site is built around. Other agents are optional alternatives.",
      },
      {
        question: `Is this an official ${seed.agentName} spreadsheet?`,
        answer:
          "This is an independent curated finds directory. It helps you discover products and open them on your chosen agent — not a replacement for each agent's own tools.",
      },
    ],
    relatedLinks: AGENT_LINKS.filter((link) => link.href !== path),
    getProducts: () => (isLitBuy ? trendingProducts() : featuredProducts()),
    productSectionTitle: isLitBuy
      ? "Popular LitBuy finds"
      : `Browse finds — open on ${seed.agentName}`,
  };
}

export const AGENT_LANDING_PAGES: Record<string, SeoLandingConfig> = {
  "kakobuy-finds": buildAgentLandingConfig({
    slug: "kakobuy-finds",
    agentName: "Kakobuy",
    title: "Kakobuy Finds & Spreadsheet",
    metaDescription:
      "Explore verified sneaker, fashion and streetwear finds. Use LitBuy as the recommended agent or choose Kakobuy, OopBuy, ACBuy, MuleBuy or HipoBuy before buying.",
    badge: "Kakobuy finds",
    h1: "Kakobuy Finds & Spreadsheet",
    intro:
      "Browse verified fashion and sneaker finds with support for LitBuy, Kakobuy, OopBuy, ACBuy, MuleBuy and HipoBuy. LitBuy is our recommended agent, but you can choose Kakobuy before checkout.",
    extraParagraph:
      "Kakobuy shoppers use this page to discover curated Weidian and Taobao listings, then import or open products on Kakobuy. LitBuy Finds keeps the same catalog while letting you switch agents anytime.",
  }),
  "oopbuy-finds": buildAgentLandingConfig({
    slug: "oopbuy-finds",
    agentName: "OopBuy",
    title: "OopBuy Finds & Spreadsheet",
    metaDescription:
      "Discover QC-curated sneakers, jackets and streetwear finds. LitBuy recommended — or choose OopBuy and other agents before you buy.",
    badge: "OopBuy finds",
    h1: "OopBuy Finds & Spreadsheet",
    intro:
      "Explore verified finds from the LitBuy Finds catalog and open them on OopBuy when that is your preferred agent. LitBuy remains the recommended default for verified links and QC.",
    extraParagraph:
      "OopBuy users can browse the same searchable catalog as LitBuy shoppers, with product photos, pricing, and QC references where available.",
  }),
  "hipobuy-finds": buildAgentLandingConfig({
    slug: "hipobuy-finds",
    agentName: "HipoBuy",
    title: "HipoBuy Finds & Spreadsheet",
    metaDescription:
      "Browse fashion and sneaker finds with LitBuy recommended, or choose HipoBuy and other supported agents at checkout.",
    badge: "HipoBuy finds",
    h1: "HipoBuy Finds & Spreadsheet",
    intro:
      "LitBuy Finds helps you discover trending fashion and sneaker listings. Set HipoBuy as your preferred agent, or keep LitBuy as the recommended option.",
    extraParagraph:
      "Use the agent selector on any product to open listings on HipoBuy while keeping LitBuy as the primary recommended workflow.",
  }),
  "acbuy-finds": buildAgentLandingConfig({
    slug: "acbuy-finds",
    agentName: "ACBuy",
    title: "ACBuy Finds & Spreadsheet",
    metaDescription:
      "Verified streetwear and sneaker finds with LitBuy recommended. Choose ACBuy or another agent before buying.",
    badge: "ACBuy finds",
    h1: "ACBuy Finds & Spreadsheet",
    intro:
      "Browse the LitBuy Finds catalog and open products on ACBuy when that is your agent of choice. LitBuy stays the recommended default across the site.",
    extraParagraph:
      "ACBuy shoppers can use the same curated product grid, filters, and QC-linked listings — then route purchases through ACBuy from the Buy button.",
  }),
  "mulebuy-finds": buildAgentLandingConfig({
    slug: "mulebuy-finds",
    agentName: "MuleBuy",
    title: "MuleBuy Finds & Spreadsheet",
    metaDescription:
      "Curated sneaker and fashion finds with LitBuy recommended. Select MuleBuy or another agent when you are ready to buy.",
    badge: "MuleBuy finds",
    h1: "MuleBuy Finds & Spreadsheet",
    intro:
      "Discover verified finds and choose MuleBuy as your preferred agent, or stay with LitBuy — our recommended option for QC and verified links.",
    extraParagraph:
      "MuleBuy users get the same searchable LitBuy Finds experience, with agent choice saved while you browse the catalog.",
  }),
};

export function getAgentLandingPage(slug: string): SeoLandingConfig | null {
  return AGENT_LANDING_PAGES[slug] ?? null;
}

export const AGENT_LANDING_SLUGS = Object.keys(AGENT_LANDING_PAGES);
