import type { StaticPageSection } from "./static-pages";
import { filterFeaturedEligible } from "./product-media";
import { hasExactPrice } from "./pricing";
import { getAllProducts } from "./products";
import { TOP_LISTS } from "./top-lists";
import type { Product } from "./types";
import {
  getKakobuySpreadsheetMetadataCopy,
} from "./metadata-copy";

function weidianProducts(limit = 72): Product[] {
  return filterFeaturedEligible(
    getAllProducts().filter(
      (product) => hasExactPrice(product.price) && /weidian/i.test(product.affiliate_link)
    )
  ).slice(0, limit);
}

export type SeoLandingPageType =
  | "collection"
  | "spreadsheet"
  | "comparison"
  | "freshness";

export type SeoLandingUpdateFrequency = "daily" | "weekly" | "monthly" | "static";

export type SeoLandingProductFilter = {
  brands?: string[];
  categories?: string[];
  keywords?: string[];
  maxPrice?: number;
  minPrice?: number;
  requireQc?: boolean;
  trending?: boolean;
  latest?: boolean;
  freshness?:
    | "popularToday"
    | "popularWeek"
    | "addedToday"
    | "editorsPicks"
    | "bestUnder20"
    | "bestValue";
};

export type SeoLandingCompareGroup = {
  label: string;
  filter?: SeoLandingProductFilter;
  getProducts?: () => Product[];
};

export type SeoLandingPageEntry = {
  slug: string;
  type: SeoLandingPageType;
  title: string;
  description: string;
  h1: string;
  intro: string;
  badge: string;
  keywords: string[];
  updateFrequency: SeoLandingUpdateFrequency;
  filter?: SeoLandingProductFilter;
  getProducts?: () => Product[];
  compareGroups?: SeoLandingCompareGroup[];
  sections?: StaticPageSection[];
  faqs: { question: string; answer: string }[];
  relatedLinks: { href: string; label: string }[];
  brandLinks?: string[];
  categoryLinks?: string[];
  productSectionTitle?: string;
  productLimit?: number;
  minProducts?: number;
};

function pathFor(slug: string): string {
  return `/${slug}`;
}

const BUYING_LINKS = [
  { href: "/guides/how-to-use-litbuy-finds", label: "How to use LitBuy Finds" },
  { href: "/guides/how-to-check-qc-photos", label: "QC photo guide" },
  { href: "/how-to-buy", label: "How to buy" },
];

export const SEO_LANDING_CONFIG: Record<string, SeoLandingPageEntry> = {
  "best-nike-finds": {
    slug: "best-nike-finds",
    type: "collection",
    title: "Best Nike LitBuy Finds",
    description:
      "Best Nike finds on LitBuy Finds — Dunks, Air Max, Travis Scott and more with QC references, verified agent links, and daily catalog updates.",
    h1: "Best Nike finds",
    intro:
      "Nike leads search volume on LitBuy Finds. This page surfaces the strongest Nike listings in the catalog — ranked for photos, QC availability, and verified buy links — not a random dump of every row in a spreadsheet.",
    badge: "Best finds",
    keywords: ["best nike finds", "nike litbuy", "nike reps"],
    updateFrequency: "weekly",
    getProducts: TOP_LISTS["top-nike-finds"].getProducts,
    brandLinks: ["nike"],
    categoryLinks: ["shoes"],
    relatedLinks: [
      { href: "/brands/nike", label: "All Nike" },
      { href: "/top-nike-finds", label: "Top Nike list" },
      { href: "/best-jordan-finds", label: "Jordan finds" },
      { href: "/best-shoes", label: "Best shoes" },
    ],
    faqs: [
      {
        question: "How are Nike finds ranked?",
        answer:
          "We prioritize listings with clear photos, exact prices, QC references where available, and strong visual presentation — then rotate weekly so the grid stays fresh.",
      },
      {
        question: "Should I confirm price before buying?",
        answer:
          "Yes. Catalog prices can lag seller updates. Always confirm the live listing price on LitBuy before checkout.",
      },
    ],
    productSectionTitle: "Top Nike picks",
  },

  "best-jordan-finds": {
    slug: "best-jordan-finds",
    type: "collection",
    title: "Best Jordan LitBuy Finds",
    description:
      "Best Jordan finds on LitBuy — retros, collabs, and grails with photos, QC links, and verified agent buy buttons.",
    h1: "Best Jordan finds",
    intro:
      "Jordan retros and collabs are among the most clicked lanes on the site. Browse editor-ranked Jordan picks here, then open the full Nike or Jordan brand pages when you want every listing.",
    badge: "Best finds",
    keywords: ["best jordan finds", "jordan litbuy", "air jordan finds"],
    updateFrequency: "weekly",
    getProducts: TOP_LISTS["best-jordan-finds-2026"].getProducts,
    brandLinks: ["jordan", "nike"],
    categoryLinks: ["shoes"],
    relatedLinks: [
      { href: "/brands/jordan", label: "All Jordan" },
      { href: "/best-nike-finds", label: "Nike finds" },
      { href: "/best-jordan-finds-2026", label: "Jordan 2026 list" },
    ],
    faqs: [
      {
        question: "Are these the same as spreadsheet Jordan rows?",
        answer:
          "They come from the same catalog universe, but LitBuy Finds filters broken images, ranks by quality, and links each product to a shareable page.",
      },
    ],
    productSectionTitle: "Top Jordan picks",
  },

  "best-shoes": {
    slug: "best-shoes",
    type: "collection",
    title: "Best Shoe Finds on LitBuy",
    description:
      "Best shoe finds on LitBuy Finds — sneakers, runners, and casual footwear with QC photos, coupons context, and verified agent links.",
    h1: "Best shoe finds",
    intro:
      "Shoes are the core of most hauls. This collection pulls the strongest footwear listings across Nike, Jordan, Adidas, New Balance, and more — filtered for photos and buy-ready links.",
    badge: "Best finds",
    keywords: ["best shoes litbuy", "sneaker finds", "rep shoes"],
    updateFrequency: "weekly",
    filter: { categories: ["shoes"], requireQc: false },
    categoryLinks: ["shoes"],
    relatedLinks: [
      { href: "/categories/shoes", label: "Shoe category" },
      { href: "/top-rep-sneakers", label: "Top sneakers" },
      { href: "/best-nike-finds", label: "Nike finds" },
    ],
    faqs: [
      {
        question: "Does this include every shoe in the catalog?",
        answer:
          "No — it highlights quality listings. Use the shoe category page or search when you want the full catalog.",
      },
    ],
    productSectionTitle: "Top shoe picks",
  },

  "best-stussy-finds": {
    slug: "best-stussy-finds",
    type: "collection",
    title: "Best Stussy LitBuy Finds",
    description:
      "Best Stussy streetwear finds on LitBuy — hoodies, tees, and cargos with verified links and QC references where available.",
    h1: "Best Stussy finds",
    intro:
      "Stussy sits at the center of UK and US streetwear searches. These picks focus on listings with strong photos and clear pricing — a faster starting point than scrolling a raw spreadsheet column.",
    badge: "Best finds",
    keywords: ["stussy finds", "stussy litbuy"],
    updateFrequency: "weekly",
    filter: { brands: ["Stussy"] },
    brandLinks: ["stussy"],
    categoryLinks: ["hoodies-and-pants", "tshirts-and-shorts"],
    relatedLinks: [
      { href: "/brands/stussy", label: "All Stussy" },
      { href: "/best-hoodies", label: "Best hoodies" },
      { href: "/top-streetwear-finds", label: "Streetwear picks" },
    ],
    faqs: [
      {
        question: "How often does this page update?",
        answer: "The product grid rotates weekly while the catalog syncs daily.",
      },
    ],
    productSectionTitle: "Top Stussy picks",
  },

  "nike-spreadsheet": {
    slug: "nike-spreadsheet",
    type: "spreadsheet",
    title: "Nike Spreadsheet Finds on LitBuy",
    description:
      "Browse Nike spreadsheet-style finds as searchable LitBuy pages — Dunks, Air Force, Travis collabs with QC photos and verified agent links.",
    h1: "Nike spreadsheet finds",
    intro:
      "Community Nike spreadsheets are rows of links and prices. LitBuy Finds turns that same Nike inventory into filterable product pages — better on mobile and easier to share one listing at a time.",
    badge: "Spreadsheet",
    keywords: ["nike spreadsheet", "nike finds spreadsheet"],
    updateFrequency: "weekly",
    getProducts: TOP_LISTS["top-nike-finds"].getProducts,
    sections: [
      {
        heading: "Spreadsheet vs searchable catalog",
        paragraphs: [
          "Spreadsheets are great for bulk reference. LitBuy Finds is better when you want photos, QC badges, brand filters, and a direct agent buy button on each product.",
        ],
        links: [
          { href: "/litbuy-spreadsheet", label: "LitBuy spreadsheet guide" },
          { href: "/best-nike-finds", label: "Best Nike finds" },
        ],
      },
    ],
    relatedLinks: [
      { href: "/brands/nike", label: "Nike brand page" },
      { href: "/litbuy-spreadsheet", label: "LitBuy spreadsheet hub" },
      ...BUYING_LINKS,
    ],
    faqs: [
      {
        question: "Is this an official Nike spreadsheet?",
        answer:
          "No. It is an independent curated catalog that indexes the same type of marketplace listings buyers track in community sheets.",
      },
    ],
    productSectionTitle: "Nike spreadsheet picks",
  },

  "jordan-spreadsheet": {
    slug: "jordan-spreadsheet",
    type: "spreadsheet",
    title: "Jordan Spreadsheet Finds on LitBuy",
    description:
      "Jordan spreadsheet finds as searchable product pages — retros, collabs, and grails with QC references and LitBuy agent links.",
    h1: "Jordan spreadsheet finds",
    intro:
      "Jordan rows dominate many community sheets. Use this page to browse the same product universe with photos and QC markers, then open LitBuy when you are ready to order.",
    badge: "Spreadsheet",
    keywords: ["jordan spreadsheet", "jordan finds sheet"],
    updateFrequency: "weekly",
    getProducts: TOP_LISTS["best-jordan-finds-2026"].getProducts,
    relatedLinks: [
      { href: "/brands/jordan", label: "Jordan brand page" },
      { href: "/best-jordan-finds", label: "Best Jordan finds" },
      { href: "/litbuy-spreadsheet", label: "Spreadsheet hub" },
    ],
    faqs: [
      {
        question: "Can I still use my old Jordan sheet?",
        answer:
          "Yes. Many buyers keep a reference sheet and use LitBuy Finds for daily discovery and sharing individual links.",
      },
    ],
    productSectionTitle: "Jordan spreadsheet picks",
  },

  "shoe-spreadsheet": {
    slug: "shoe-spreadsheet",
    type: "spreadsheet",
    title: "Shoe Spreadsheet Finds on LitBuy",
    description:
      "Shoe spreadsheet finds on LitBuy Finds — sneakers and footwear from Weidian and Taobao with QC photos and agent checkout links.",
    h1: "Shoe spreadsheet finds",
    intro:
      "Footwear spreadsheets mix Nike, Jordan, Adidas, and budget batches in one long list. This page highlights quality shoe listings you can open individually — without losing mobile usability.",
    badge: "Spreadsheet",
    keywords: ["shoe spreadsheet", "sneaker spreadsheet litbuy"],
    updateFrequency: "weekly",
    filter: { categories: ["shoes"] },
    categoryLinks: ["shoes"],
    relatedLinks: [
      { href: "/categories/shoes", label: "All shoes" },
      { href: "/best-shoes", label: "Best shoes" },
      { href: "/litbuy-spreadsheet", label: "LitBuy spreadsheet" },
    ],
    faqs: [
      {
        question: "Which agents work with these links?",
        answer:
          "LitBuy is recommended on this site, but you can switch to MuleBuy, OopBuy, Kakobuy, or ACBuy from the header before you buy.",
      },
    ],
    productSectionTitle: "Shoe spreadsheet picks",
  },

  "streetwear-spreadsheet": {
    slug: "streetwear-spreadsheet",
    type: "spreadsheet",
    title: "Streetwear Spreadsheet Finds on LitBuy",
    description:
      "Streetwear spreadsheet finds — Stussy, Corteiz, Supreme, and hype labels with searchable LitBuy pages and QC references.",
    h1: "Streetwear spreadsheet finds",
    intro:
      "Streetwear sheets move fast. LitBuy Finds keeps the same discovery value while adding photos, QC badges, and shareable URLs for Discord and Telegram.",
    badge: "Spreadsheet",
    keywords: ["streetwear spreadsheet", "hype finds sheet"],
    updateFrequency: "weekly",
    filter: {
      keywords: ["stussy", "corteiz", "supreme", "bape", "hoodie", "cargo"],
    },
    relatedLinks: [
      { href: "/top-streetwear-finds", label: "Top streetwear" },
      { href: "/best-hoodies", label: "Best hoodies" },
      { href: "/litbuy-spreadsheet", label: "Spreadsheet hub" },
    ],
    faqs: [
      {
        question: "How is this different from a Google Sheet?",
        answer:
          "Sheets are static files. This catalog syncs with imports and filters out many broken listings automatically.",
      },
    ],
    productSectionTitle: "Streetwear spreadsheet picks",
  },

  "mulebuy-spreadsheet": {
    slug: "mulebuy-spreadsheet",
    type: "spreadsheet",
    title: "MuleBuy Spreadsheet | QC Photos, Product Finds & Weidian Links",
    description:
      "Browse MuleBuy spreadsheet-style finds with QC photos, Weidian products, Taobao links, sneaker finds, fashion items, and trending product links.",
    h1: "MuleBuy spreadsheet finds",
    intro:
      "MuleBuy shoppers often start from community spreadsheets. LitBuy Finds indexes the same product universe — set MuleBuy as your preferred agent in the header, then browse normally.",
    badge: "Agent spreadsheet",
    keywords: ["mulebuy spreadsheet", "mulebuy finds"],
    updateFrequency: "weekly",
    filter: { trending: true },
    relatedLinks: [
      { href: "/mulebuy-finds", label: "MuleBuy finds hub" },
      { href: "/litbuy-spreadsheet", label: "LitBuy spreadsheet" },
      { href: "/litbuy-vs-mulebuy", label: "LitBuy vs MuleBuy" },
    ],
    faqs: [
      {
        question: "Is LitBuy required?",
        answer:
          "No. LitBuy is recommended, but you can choose MuleBuy before pressing Buy on any product.",
      },
    ],
    productSectionTitle: "Trending finds for MuleBuy shoppers",
  },

  "kakobuy-spreadsheet": {
    slug: "kakobuy-spreadsheet",
    type: "spreadsheet",
    title: getKakobuySpreadsheetMetadataCopy().title,
    description: getKakobuySpreadsheetMetadataCopy().description,
    h1: "Kakobuy spreadsheet finds",
    intro:
      "Use this page like a Kakobuy-friendly spreadsheet view: curated rows become product cards with photos, filters, and your saved agent preference.",
    badge: "Agent spreadsheet",
    keywords: ["kakobuy spreadsheet", "kakobuy finds sheet"],
    updateFrequency: "weekly",
    filter: { trending: true },
    relatedLinks: [
      { href: "/kakobuy-finds", label: "Kakobuy finds hub" },
      { href: "/litbuy-spreadsheet", label: "LitBuy spreadsheet" },
    ],
    faqs: [
      {
        question: "Can I import links to Kakobuy?",
        answer:
          "Open any product and choose Kakobuy as your agent. Import workflows depend on Kakobuy's own tools.",
      },
    ],
    productSectionTitle: "Trending finds for Kakobuy shoppers",
  },

  "oopbuy-spreadsheet": {
    slug: "oopbuy-spreadsheet",
    type: "spreadsheet",
    title: "OopBuy Spreadsheet | QC Photos, Product Finds & Weidian Links",
    description:
      "Explore OopBuy spreadsheet-style finds with QC photos, Weidian products, Taobao links, sneaker finds, fashion items, and trending product links.",
    h1: "OopBuy spreadsheet finds",
    intro:
      "OopBuy users can treat this as a cleaner spreadsheet front-end: same catalog data, better photos, and agent switching without leaving the site.",
    badge: "Agent spreadsheet",
    keywords: ["oopbuy spreadsheet", "oopbuy finds"],
    updateFrequency: "weekly",
    filter: { trending: true },
    relatedLinks: [
      { href: "/oopbuy-finds", label: "OopBuy finds hub" },
      { href: "/litbuy-vs-oopbuy", label: "LitBuy vs OopBuy" },
    ],
    faqs: [
      {
        question: "Which agent is default?",
        answer: "LitBuy is recommended site-wide, but OopBuy can be selected anytime.",
      },
    ],
    productSectionTitle: "Trending finds for OopBuy shoppers",
  },

  "acbuy-spreadsheet": {
    slug: "acbuy-spreadsheet",
    type: "spreadsheet",
    title: "ACBuy Spreadsheet | QC Photos, Product Finds & Weidian Links",
    description:
      "Browse ACBuy spreadsheet-style finds with QC photos, Weidian products, Taobao links, sneaker finds, fashion items, and trending product links.",
    h1: "ACBuy spreadsheet finds",
    intro:
      "ACBuy shoppers get the same indexed catalog as everyone else. Filter by brand, compare QC-linked listings, then route purchases through ACBuy if that is your preference.",
    badge: "Agent spreadsheet",
    keywords: ["acbuy spreadsheet", "acbuy finds sheet"],
    updateFrequency: "weekly",
    filter: { trending: true },
    relatedLinks: [
      { href: "/acbuy-finds", label: "ACBuy finds hub" },
      { href: "/litbuy-spreadsheet", label: "LitBuy spreadsheet" },
    ],
    faqs: [
      {
        question: "Are prices identical across agents?",
        answer:
          "Base listing prices are similar, but fees, coupons, and shipping lines vary by agent and destination.",
      },
    ],
    productSectionTitle: "Trending finds for ACBuy shoppers",
  },

  "litbuy-vs-mulebuy": {
    slug: "litbuy-vs-mulebuy",
    type: "comparison",
    title: "LitBuy vs MuleBuy — Which Agent?",
    description:
      "Balanced comparison of LitBuy and MuleBuy for buying from Weidian and Taobao — fees, QC workflow, and when each may fit your haul.",
    h1: "LitBuy vs MuleBuy",
    intro:
      "Both agents can purchase from Chinese marketplaces. LitBuy is our recommended default on this site, but MuleBuy is a supported alternative. The right choice depends on your coupons, shipping line, and personal preference — not a single universal winner.",
    badge: "Comparison",
    keywords: ["litbuy vs mulebuy", "mulebuy or litbuy"],
    updateFrequency: "monthly",
    sections: [
      {
        heading: "What is similar",
        paragraphs: [
          "Both provide warehouse storage, QC photos, and international shipping lines. Both can open Weidian and Taobao listings you find on LitBuy Finds.",
        ],
      },
      {
        heading: "What may differ",
        paragraphs: [
          "Coupon campaigns, payment methods, shipping routes, and support response times change over time. Compare live fees in each dashboard before a large haul.",
          "LitBuy Finds links and QC workflow examples on this site are LitBuy-first. MuleBuy users can still browse the same catalog and switch agents in the header.",
        ],
        links: [
          { href: "/mulebuy-finds", label: "MuleBuy finds" },
          { href: "/litbuy-finds", label: "LitBuy finds" },
        ],
      },
    ],
    compareGroups: [
      {
        label: "Popular on LitBuy Finds",
        filter: { freshness: "popularToday" },
      },
      {
        label: "QC-linked picks",
        filter: { requireQc: true },
      },
    ],
    relatedLinks: [
      { href: "/guides/what-is-a-shopping-agent", label: "Shopping agent guide" },
      { href: "/litbuy-vs-other-agents", label: "More comparisons" },
      { href: "/best-shopping-agent", label: "Best shopping agent" },
    ],
    faqs: [
      {
        question: "Is LitBuy always cheaper than MuleBuy?",
        answer:
          "Not necessarily. Promotions and shipping choices vary. Compare totals for your country and parcel weight.",
      },
      {
        question: "Can I switch agents after browsing?",
        answer:
          "Yes. Set your preferred agent in the site header or choose at checkout on each product.",
      },
    ],
    productSectionTitle: "Compare finds",
  },

  "litbuy-vs-oopbuy": {
    slug: "litbuy-vs-oopbuy",
    type: "comparison",
    title: "LitBuy vs OopBuy — Which Agent?",
    description:
      "LitBuy vs OopBuy for marketplace buys — balanced notes on QC, fees, and when each agent may work better for you.",
    h1: "LitBuy vs OopBuy",
    intro:
      "OopBuy is a supported alternative to LitBuy on this site. We recommend LitBuy for the QC workflow this catalog is built around, but many buyers stick with OopBuy for habit, coupons, or regional shipping — that is a personal call.",
    badge: "Comparison",
    keywords: ["litbuy vs oopbuy", "oopbuy or litbuy"],
    updateFrequency: "monthly",
    sections: [
      {
        heading: "Using both with LitBuy Finds",
        paragraphs: [
          "Browse and shortlist here. Open listings on LitBuy or OopBuy depending on your agent setting. The discovery layer stays the same either way.",
        ],
      },
    ],
    compareGroups: [
      {
        label: "Trending this week",
        filter: { freshness: "popularWeek" },
      },
      {
        label: "Budget under $30",
        filter: { maxPrice: 30 },
      },
    ],
    relatedLinks: [
      { href: "/oopbuy-finds", label: "OopBuy finds" },
      { href: "/litbuy-finds", label: "LitBuy finds" },
      { href: "/best-shopping-agent", label: "Agent overview" },
    ],
    faqs: [
      {
        question: "Does OopBuy have the same QC steps?",
        answer:
          "Both offer warehouse photos, but UI and optional services differ. Check each agent's order panel for your item type.",
      },
    ],
    productSectionTitle: "Sample finds to compare",
  },

  "best-shopping-agent": {
    slug: "best-shopping-agent",
    type: "comparison",
    title: "Best Shopping Agent for LitBuy Finds",
    description:
      "How to choose a shopping agent for Weidian and Taobao finds — LitBuy, MuleBuy, OopBuy, Kakobuy, and ACBuy compared at a high level.",
    h1: "Best shopping agent for these finds",
    intro:
      "There is no single best agent for every buyer. LitBuy is our recommended default because this catalog and QC examples are LitBuy-first. MuleBuy, OopBuy, Kakobuy, and ACBuy are supported alternatives when their fees or shipping lines fit your country better.",
    badge: "Agent guide",
    keywords: ["best shopping agent", "litbuy agent comparison"],
    updateFrequency: "monthly",
    sections: [
      {
        heading: "What to compare",
        paragraphs: [
          "Look at warehouse QC options, storage time, international lines to your country, payment methods, and current coupons — not just hype in a Discord poll.",
        ],
        links: [
          { href: "/guides/what-is-a-shopping-agent", label: "What is an agent?" },
          { href: "/guides/how-shipping-works-with-agents", label: "Shipping basics" },
        ],
      },
    ],
    filter: { freshness: "editorsPicks" },
    relatedLinks: [
      { href: "/litbuy-finds", label: "LitBuy finds" },
      { href: "/mulebuy-finds", label: "MuleBuy finds" },
      { href: "/kakobuy-finds", label: "Kakobuy finds" },
      { href: "/oopbuy-finds", label: "OopBuy finds" },
      { href: "/acbuy-finds", label: "ACBuy finds" },
    ],
    faqs: [
      {
        question: "Why does LitBuy Finds recommend LitBuy?",
        answer:
          "Our buy links, QC references, and guides are tested around LitBuy's workflow. You can still switch agents per product.",
      },
      {
        question: "Can I use multiple agents?",
        answer:
          "Yes. Many experienced buyers use different agents for different hauls depending on promotions.",
      },
    ],
    productSectionTitle: "Editor-ranked finds to start with",
  },

  "trending-today": {
    slug: "trending-today",
    type: "freshness",
    title: "Trending LitBuy Finds Today",
    description:
      "Trending finds today on LitBuy Finds — daily rotated picks from engagement signals and catalog quality filters.",
    h1: "Trending today",
    intro:
      "Today's trending grid combines engagement signals with strict image and pricing filters. The selection stays stable through the UTC day, then rotates tomorrow.",
    badge: "Trending",
    keywords: ["trending litbuy finds", "popular today"],
    updateFrequency: "daily",
    filter: { freshness: "popularToday" },
    productLimit: 48,
    relatedLinks: [
      { href: "/most-popular-finds-now", label: "Most popular now" },
      { href: "/trending-this-week", label: "Trending this week" },
      { href: "/recently-added", label: "Recently added" },
    ],
    faqs: [
      {
        question: "How often does this page change?",
        answer:
          "The product grid uses a daily seed — stable for the full UTC day, then refreshed the next day.",
      },
    ],
    productSectionTitle: "Trending picks today",
  },

  "trending-this-week": {
    slug: "trending-this-week",
    type: "freshness",
    title: "Trending LitBuy Finds This Week",
    description:
      "Trending finds this week — sneakers, jackets, and streetwear rotated weekly from the LitBuy Finds catalog.",
    h1: "Trending this week",
    intro:
      "Weekly trending highlights the catalog's momentum picks — popular sneakers, outerwear, and streetwear with verified links. The grid updates each week, not on every page refresh.",
    badge: "Trending",
    keywords: ["trending this week", "weekly litbuy finds"],
    updateFrequency: "weekly",
    filter: { freshness: "popularWeek" },
    productLimit: 48,
    relatedLinks: [
      { href: "/trending", label: "Trending hub" },
      { href: "/trending-today", label: "Trending today" },
      { href: "/best-finds-this-week", label: "Best this week" },
    ],
    faqs: [
      {
        question: "Is this the same as the homepage trending rail?",
        answer:
          "It uses the same weekly rotation logic with a full-page grid and extra context links.",
      },
    ],
    productSectionTitle: "Trending picks this week",
  },

  "best-value-finds": {
    slug: "best-value-finds",
    type: "freshness",
    title: "Best Value LitBuy Finds",
    description:
      "Best value finds under $20 with QC references where available — weekly rotated budget picks that still look premium.",
    h1: "Best value finds",
    intro:
      "Value does not have to mean bad photos or mystery batches. This page blends sub-$20 listings with QC-linked standouts — rotated weekly so budget buyers see fresh options.",
    badge: "Value",
    keywords: ["best value finds", "budget litbuy finds"],
    updateFrequency: "weekly",
    filter: { freshness: "bestValue" },
    productLimit: 48,
    relatedLinks: [
      { href: "/best-under-20", label: "Best under $20" },
      { href: "/top-budget-finds", label: "Top budget finds" },
      { href: "/collections/best-budget-finds", label: "Budget collection" },
    ],
    faqs: [
      {
        question: "Are cheap finds lower quality?",
        answer:
          "Not always, but batch variance is real. Use QC references and warehouse photos before shipping.",
      },
    ],
    productSectionTitle: "Best value picks",
  },

  "weidian-finds": {
    slug: "weidian-finds",
    type: "collection",
    title: "Weidian Finds | QC Photos, Spreadsheet Links & Streetwear",
    description:
      "Browse Weidian finds with QC photos, spreadsheet-style product links, sneakers, jackets, hoodies, bags, and verified agent shopping links.",
    h1: "Weidian finds",
    intro:
      "Weidian is a major source for streetwear and sneaker finds. LitBuy Finds indexes Weidian-linked products with searchable pages, photos, pricing, and QC references where available.",
    badge: "Weidian",
    keywords: ["weidian finds", "weidian litbuy", "weidian spreadsheet"],
    updateFrequency: "weekly",
    filter: {
      keywords: ["weidian"],
    },
    getProducts: () => weidianProducts(),
    relatedLinks: [
      { href: "/litbuy-weidian", label: "Weidian guide" },
      { href: "/taobao-finds", label: "Taobao finds" },
      { href: "/litbuy-spreadsheet", label: "LitBuy spreadsheet" },
      { href: "/trending", label: "Trending" },
      { href: "/categories", label: "Categories" },
    ],
    faqs: [
      {
        question: "What are Weidian finds?",
        answer:
          "Products listed on Weidian, a Chinese marketplace. LitBuy and other agents place orders on your behalf for international shipping.",
      },
      {
        question: "Can I buy Weidian finds without an agent?",
        answer:
          "Most buyers use a shopping agent like LitBuy, MuleBuy, or Kakobuy to pay, receive warehouse QC, and ship internationally.",
      },
    ],
    productSectionTitle: "Top Weidian finds",
  },

  "taobao-finds": {
    slug: "taobao-finds",
    type: "collection",
    title: "Taobao Finds | QC Photos, Spreadsheet Links & Fashion Picks",
    description:
      "Explore Taobao finds with QC photos, spreadsheet-style product links, sneakers, hoodies, jackets, bags, and verified agent shopping links.",
    h1: "Taobao finds",
    intro:
      "Taobao offers a massive range of fashion and sneaker finds. LitBuy Finds curates Taobao-linked listings so you can discover products before opening your agent to complete purchase.",
    badge: "Taobao",
    keywords: ["taobao finds", "taobao litbuy", "taobao spreadsheet"],
    updateFrequency: "weekly",
    filter: { categories: ["shoes", "hoodies-and-pants", "coats-and-jackets", "accessories"] },
    relatedLinks: [
      { href: "/litbuy-taobao", label: "Taobao guide" },
      { href: "/weidian-finds", label: "Weidian finds" },
      { href: "/litbuy-spreadsheet", label: "LitBuy spreadsheet" },
      { href: "/latest", label: "Latest finds" },
      { href: "/brands", label: "Brands" },
    ],
    faqs: [
      {
        question: "Can I search Taobao finds in English?",
        answer:
          "Yes — use English brand names and keywords in the LitBuy Finds search bar or browse this page's product grid.",
      },
    ],
    productSectionTitle: "Taobao-linked finds",
  },

  "qc-finds": {
    slug: "qc-finds",
    type: "collection",
    title: "QC Finds | QC Photo Finds, Spreadsheet Links & Verified Picks",
    description:
      "Browse QC finds and QC photo finds — sneakers, jackets, bags, and streetwear with quality control reference photos and verified agent links.",
    h1: "QC finds",
    intro:
      "QC (quality control) finds include reference photos from previous buyers or batches. Use them to compare stitching, materials, and shape before you order — then request warehouse QC after purchase.",
    badge: "QC finds",
    keywords: ["qc finds", "qc photo finds", "qc approved finds"],
    updateFrequency: "weekly",
    filter: { requireQc: true },
    relatedLinks: [
      { href: "/litbuy-qc", label: "LitBuy QC guide" },
      { href: "/top-qc-finds", label: "Top QC finds" },
      { href: "/sneaker-finds", label: "Sneaker finds" },
      { href: "/trending", label: "Trending" },
      { href: "/categories", label: "Categories" },
    ],
    faqs: [
      {
        question: "What are QC photo finds?",
        answer:
          "Listings with quality control reference photos attached — useful for comparing materials and construction before you buy.",
      },
      {
        question: "Is reference QC the same as warehouse QC?",
        answer:
          "No. Reference QC shows examples from other orders. Warehouse QC is taken of your exact item after you pay.",
      },
    ],
    productSectionTitle: "QC photo finds",
  },

  "sneaker-finds": {
    slug: "sneaker-finds",
    type: "collection",
    title: "Sneaker Finds | QC Photos, Spreadsheet Links & Agent Shopping",
    description:
      "Browse sneaker finds and sneaker finds spreadsheets — Nike, Jordan, Adidas, New Balance picks with QC photos and verified agent links.",
    h1: "Sneaker finds",
    intro:
      "Sneakers are the most searched category on LitBuy Finds. This page surfaces current Nike, Jordan, Adidas, and New Balance picks with photos, pricing, and direct agent purchase links.",
    badge: "Sneakers",
    keywords: ["sneaker finds", "sneaker finds spreadsheet", "rep sneakers"],
    updateFrequency: "weekly",
    getProducts: TOP_LISTS["top-rep-sneakers"].getProducts,
    categoryLinks: ["shoes"],
    relatedLinks: [
      { href: "/litbuy-sneakers", label: "LitBuy sneakers" },
      { href: "/best-sneakers", label: "Best sneakers" },
      { href: "/brands/nike", label: "Nike" },
      { href: "/brands/jordan", label: "Jordan" },
      { href: "/qc-finds", label: "QC finds" },
    ],
    faqs: [
      {
        question: "What are the best sneaker finds right now?",
        answer:
          "Popular picks rotate daily. Check Trending Today and this page's product grid for current Nike and Jordan heat.",
      },
    ],
    productSectionTitle: "Top sneaker finds",
  },

  "fashion-finds": {
    slug: "fashion-finds",
    type: "collection",
    title: "Fashion Finds | QC Photos, Spreadsheet Links & Streetwear",
    description:
      "Explore fashion finds and fashion finds spreadsheets — hoodies, jackets, tees, cargos, and streetwear with QC photos and verified agent links.",
    h1: "Fashion finds",
    intro:
      "Fashion finds cover hoodies, jackets, tees, cargos, and designer streetwear from Weidian and Taobao sellers. Browse curated picks with photos, QC references, and verified buy links.",
    badge: "Fashion",
    keywords: ["fashion finds", "fashion finds spreadsheet", "streetwear finds"],
    updateFrequency: "weekly",
    getProducts: TOP_LISTS["top-streetwear-finds"].getProducts,
    categoryLinks: ["hoodies-and-pants", "coats-and-jackets", "tshirts-and-shorts"],
    relatedLinks: [
      { href: "/top-streetwear-finds", label: "Top streetwear" },
      { href: "/best-hoodies", label: "Best hoodies" },
      { href: "/fashion-finds-telegram", label: "Fashion Telegram" },
      { href: "/trending", label: "Trending" },
      { href: "/categories", label: "Categories" },
    ],
    faqs: [
      {
        question: "What counts as a fashion find?",
        answer:
          "Streetwear layers, graphic tees, cargos, jackets, and designer-inspired clothing from Weidian and Taobao sellers.",
      },
    ],
    productSectionTitle: "Top fashion finds",
  },

  "designer-finds": {
    slug: "designer-finds",
    type: "collection",
    title: "Designer Finds | QC Photos, Bags, Jackets & Spreadsheet Links",
    description:
      "Browse designer finds and designer finds spreadsheets — Louis Vuitton, Gucci, Prada, Dior bags, jackets, and accessories with QC photos and agent links.",
    h1: "Designer finds",
    intro:
      "Designer finds include luxury bags, belts, jackets, and accessories from high-demand brands. QC references matter most here — compare hardware, stitching, and materials before shipping.",
    badge: "Designer",
    keywords: ["designer finds", "designer finds spreadsheet", "designer bags"],
    updateFrequency: "weekly",
    getProducts: TOP_LISTS["top-designer-bags"].getProducts,
    brandLinks: ["louis-vuitton", "gucci", "prada", "dior"],
    categoryLinks: ["accessories", "coats-and-jackets"],
    relatedLinks: [
      { href: "/top-designer-bags", label: "Designer bags" },
      { href: "/top-louis-vuitton-finds", label: "Louis Vuitton" },
      { href: "/top-gucci-finds", label: "Gucci finds" },
      { href: "/qc-finds", label: "QC finds" },
      { href: "/brands", label: "All brands" },
    ],
    faqs: [
      {
        question: "Which designer brands have the most QC references?",
        answer:
          "Louis Vuitton, Gucci, and Goyard styles tend to have the most community QC threads. Always request warehouse photos before shipping.",
      },
    ],
    productSectionTitle: "Top designer finds",
  },

  "agent-spreadsheet": {
    slug: "agent-spreadsheet",
    type: "spreadsheet",
    title: "Shopping Agent Spreadsheet | QC Photos, Finds & Agent Links",
    description:
      "Browse shopping agent spreadsheet finds — LitBuy, Kakobuy, MuleBuy, OopBuy, and ACBuy product links with QC photos, Weidian items, Taobao products, and verified buy buttons.",
    h1: "Shopping agent spreadsheet finds",
    intro:
      "Community agent spreadsheets list Weidian and Taobao links, prices, and QC notes. LitBuy Finds turns that same catalog into searchable pages with photos, filters, and your preferred agent at checkout.",
    badge: "Agent spreadsheet",
    keywords: [
      "shopping agent spreadsheet",
      "agent spreadsheet finds",
      "litbuy spreadsheet",
      "kakobuy spreadsheet",
    ],
    updateFrequency: "weekly",
    filter: { trending: true },
    sections: [
      {
        heading: "Agent spreadsheet hubs",
        paragraphs: [
          "Each supported agent has its own spreadsheet-style landing page. Browse the catalog once, then open products on LitBuy (recommended), Kakobuy, MuleBuy, OopBuy, or ACBuy.",
        ],
        links: [
          { href: "/litbuy-spreadsheet", label: "LitBuy spreadsheet" },
          { href: "/kakobuy-spreadsheet", label: "Kakobuy spreadsheet" },
          { href: "/mulebuy-spreadsheet", label: "MuleBuy spreadsheet" },
          { href: "/oopbuy-spreadsheet", label: "OopBuy spreadsheet" },
          { href: "/acbuy-spreadsheet", label: "ACBuy spreadsheet" },
        ],
      },
    ],
    relatedLinks: [
      { href: "/litbuy-finds", label: "LitBuy finds" },
      { href: "/best-shopping-agent", label: "Best shopping agent" },
      { href: "/weidian-finds", label: "Weidian finds" },
      { href: "/taobao-finds", label: "Taobao finds" },
      { href: "/trending", label: "Trending" },
    ],
    faqs: [
      {
        question: "What is a shopping agent spreadsheet?",
        answer:
          "A shared list of marketplace product links buyers track in Google Sheets or Excel. LitBuy Finds indexes the same product universe into searchable pages.",
      },
      {
        question: "Which agent should I use?",
        answer:
          "LitBuy is recommended on this site, but you can switch to MuleBuy, Kakobuy, OopBuy, or ACBuy from the header before buying.",
      },
    ],
    productSectionTitle: "Trending agent spreadsheet picks",
  },
};

export const SEO_LANDING_CONFIG_SLUGS = Object.keys(SEO_LANDING_CONFIG);

export function getSeoLandingConfig(slug: string): SeoLandingPageEntry | undefined {
  return SEO_LANDING_CONFIG[slug];
}

export function getSeoLandingConfigPath(slug: string): string {
  return pathFor(slug);
}

export function getPublishedSeoLandingConfigs(): SeoLandingPageEntry[] {
  return SEO_LANDING_CONFIG_SLUGS.map((slug) => SEO_LANDING_CONFIG[slug]).filter(
    Boolean
  );
}
