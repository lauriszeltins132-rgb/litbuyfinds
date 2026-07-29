import type { StaticPageSection } from "./static-pages";
import { PUBLIC_CATALOG_COUNT } from "./catalog-count-public";
import { TOP_LISTS } from "./top-lists";
import type { SeoLandingPageEntry } from "./seo-landing-config";
import {
  AGENT_FINDS_LINKS,
  CATEGORY_FINDS_LINKS,
  SEO_HUB_LINKS,
  SPREADSHEET_CLUSTER_LINKS,
} from "./seo-internal-links";
import { LITBUY_SIGNUP_URL } from "./constants";

const HUB = [...SEO_HUB_LINKS];
const SPREADSHEETS = [...SPREADSHEET_CLUSTER_LINKS];
const AGENTS = [...AGENT_FINDS_LINKS];
const CATEGORIES = [...CATEGORY_FINDS_LINKS];

function spreadsheetSections(agentLine: string): StaticPageSection[] {
  return [
    {
      heading: "Quick answer",
      paragraphs: [
        `LitBuy spreadsheet contains thousands of curated products with QC photos, prices, and agent links. LitBuy Finds turns that spreadsheet universe into ${PUBLIC_CATALOG_COUNT} searchable pages — updated daily with verified buy buttons for ${agentLine}.`,
      ],
    },
    {
      heading: "How to use this spreadsheet view",
      paragraphs: [
        "Search by brand or category, open a product page for QC references, then click through to your preferred agent. Switch agents in the site header without losing your shortlist.",
        "Spreadsheet rows are great for bulk reference; LitBuy Finds is better for mobile discovery, sharing single products, and filtering by price or QC status.",
      ],
      links: SPREADSHEETS.slice(0, 6),
    },
    {
      heading: "Supported agents",
      paragraphs: [
        "Every product supports LitBuy, MuleBuy, Kakobuy, HipoBuy, OopBuy, and ACBuy checkout links. LitBuy is recommended for shipping coupons and QC workflow — you can switch per product.",
      ],
      links: AGENTS,
    },
  ];
}

const SPREADSHEET_FAQS = [
  {
    question: "How many products are in the LitBuy spreadsheet catalog?",
    answer: `LitBuy Finds indexes ${PUBLIC_CATALOG_COUNT} curated finds with daily syncs. The underlying spreadsheet universe is larger, but we filter broken images and missing prices before publishing.`,
  },
  {
    question: "How often is the spreadsheet updated?",
    answer:
      "The catalog syncs daily. New finds appear in Latest Finds and collection pages after each import — check the homepage timestamp for the last sync.",
  },
  {
    question: "Can I use Kakobuy or MuleBuy with spreadsheet finds?",
    answer:
      "Yes. Set your preferred agent in the header or open each product through the agent button you already use. Spreadsheet links and LitBuy Finds product pages support the same marketplace URLs.",
  },
] as const;

export const SEO_EXPANSION_PAGES: Record<string, SeoLandingPageEntry> = {
  "sneaker-finds": {
    slug: "sneaker-finds",
    type: "collection",
    title: "Best Sneaker Finds 2026 | LitBuy QC Photos & Agent Links",
    description:
      "Best sneaker finds on LitBuy Finds — Nike, Jordan, Adidas, designer runners and budget sneakers with QC photos, spreadsheet links, and verified agent buy buttons.",
    h1: "Best sneaker finds",
    intro:
      "Sneaker finds are the most searched lane on LitBuy Finds. This page surfaces Nike Dunks, Jordan retros, Adidas campus styles, New Balance runners, and designer batches — each with photos, prices, QC references where available, and one-click agent links.",
    badge: "Sneaker finds",
    keywords: ["sneaker finds", "litbuy sneakers", "rep sneakers", "best sneaker finds 2026"],
    updateFrequency: "weekly",
    filter: { categories: ["shoes"] },
    categoryLinks: ["shoes"],
    brandLinks: ["nike", "jordan", "adidas", "new-balance"],
    sections: [
      {
        heading: "Popular sneaker categories",
        paragraphs: [
          "Nike and Jordan dominate search volume — Dunks, Air Force 1, Travis Scott collabs, and Jordan 1/4 retros lead clicks. Adidas Samba and Campus rows are strong budget picks. Designer runners from Balenciaga, Dior, and Louis Vuitton appear in the shoes category with QC history when available.",
        ],
        links: [
          { href: "/brands/nike", label: "Nike finds" },
          { href: "/brands/jordan", label: "Jordan finds" },
          { href: "/best-nike-finds", label: "Best Nike" },
          { href: "/top-rep-sneakers", label: "Top rep sneakers" },
        ],
      },
      {
        heading: "QC photos for sneakers",
        paragraphs: [
          "Sneakers benefit most from warehouse QC — check sole shape, stitching, and logo placement before shipping. Reference QC on find pages shows batch examples; your warehouse QC is the final check.",
        ],
        links: [
          { href: "/litbuy-qc-photos", label: "LitBuy QC photos" },
          { href: "/collections/best-qc-approved-finds", label: "QC collection" },
        ],
      },
    ],
    relatedLinks: [
      { href: "/litbuy-sneakers", label: "LitBuy sneakers hub" },
      { href: "/shoe-spreadsheet", label: "Shoe spreadsheet" },
      { href: "/litbuy-spreadsheet", label: "LitBuy spreadsheet" },
      ...HUB.filter((l) => !["/litbuy-finds"].includes(l.href)).slice(0, 4),
    ],
    faqs: [
      {
        question: "Where do sneaker finds come from?",
        answer:
          "Most listings originate from Weidian and Taobao sellers indexed in community LitBuy spreadsheets. LitBuy Finds normalizes them into searchable product pages.",
      },
      {
        question: "Are budget sneakers worth it?",
        answer:
          "Budget batches can be fine for beaters — always check QC references and compare multiple listings before ordering.",
      },
    ],
    productSectionTitle: "Top sneaker picks",
  },

  "clothing-finds": {
    slug: "clothing-finds",
    type: "collection",
    title: "Best Clothing Finds 2026 | LitBuy Fashion & Streetwear",
    description:
      "Clothing finds on LitBuy Finds — hoodies, jackets, tees, pants, and fashion layers with QC photos, spreadsheet-style discovery, and multi-agent links.",
    h1: "Best clothing finds",
    intro:
      "Clothing finds cover hoodies, jackets, tees, cargos, and everyday fashion layers from Weidian and Taobao. Browse curated picks with photos and prices — faster than scrolling a 5,000-row spreadsheet on mobile.",
    badge: "Clothing finds",
    keywords: ["clothing finds", "fashion finds", "litbuy clothing", "rep clothing"],
    updateFrequency: "weekly",
    filter: {
      categories: ["hoodies-and-pants", "coats-and-jackets", "tshirts-and-shorts"],
    },
    sections: [
      {
        heading: "What clothing is indexed",
        paragraphs: [
          "Streetwear hoodies, puffer jackets, graphic tees, cargos, and designer fashion layers from Moncler, Stone Island, Ralph Lauren, Stussy, and more. Each listing links to verified agent checkout.",
        ],
        links: [
          { href: "/streetwear-finds", label: "Streetwear finds" },
          { href: "/hoodie-finds", label: "Hoodie finds" },
          { href: "/jacket-finds", label: "Jacket finds" },
        ],
      },
    ],
    relatedLinks: [
      { href: "/litbuy-finds", label: "LitBuy finds catalog" },
      { href: "/litbuy-spreadsheet", label: "LitBuy spreadsheet" },
      { href: "/litbuy-discord", label: "LitBuy Discord" },
      ...CATEGORIES.filter((l) => l.href !== "/clothing-finds").slice(0, 4),
    ],
    faqs: [
      {
        question: "Is clothing on LitBuy Finds the same as spreadsheet rows?",
        answer:
          "Same product universe — LitBuy Finds adds search, filters, QC badges, and shareable product URLs.",
      },
      {
        question: "How do I find my size?",
        answer:
          "Open the LitBuy listing from the product page and check the seller size chart on Weidian or Taobao before ordering.",
      },
    ],
    productSectionTitle: "Top clothing picks",
  },

  "streetwear-finds": {
    slug: "streetwear-finds",
    type: "collection",
    title: "Best Streetwear Finds 2026 | Stussy, Corteiz & Hype",
    description:
      "Streetwear finds on LitBuy Finds — Stussy, Corteiz, Supreme, Essentials, and hype labels with QC photos and agent spreadsheet links.",
    h1: "Best streetwear finds",
    intro:
      "Streetwear finds combine UK and US hype labels — Stussy, Corteiz, Supreme, Fear of God Essentials, and Chrome Hearts-style pieces. This page highlights listings with strong photos and verified buy links.",
    badge: "Streetwear finds",
    keywords: ["streetwear finds", "hype finds", "stussy finds", "corteiz finds"],
    updateFrequency: "weekly",
    filter: {
      keywords: ["stussy", "corteiz", "supreme", "essentials", "chrome", "streetwear", "fear of god"],
    },
    brandLinks: ["stussy", "corteiz", "supreme", "essentials"],
    sections: [
      {
        heading: "Streetwear brands to browse",
        paragraphs: [
          "Stussy and Corteiz lead UK streetwear searches. Supreme and Essentials remain staple haul picks. Use brand pages for full inventory when you know the label you want.",
        ],
        links: [
          { href: "/brands/stussy", label: "Stussy" },
          { href: "/brands/corteiz", label: "Corteiz" },
          { href: "/top-streetwear-finds", label: "Top streetwear list" },
          { href: "/streetwear-spreadsheet", label: "Streetwear spreadsheet" },
        ],
      },
    ],
    relatedLinks: [
      { href: "/clothing-finds", label: "Clothing finds" },
      { href: "/hoodie-finds", label: "Hoodie finds" },
      { href: "/litbuy-spreadsheet", label: "Spreadsheet hub" },
      ...HUB.slice(0, 4),
    ],
    faqs: [
      {
        question: "What counts as streetwear on LitBuy Finds?",
        answer:
          "Hype labels, graphic hoodies, cargos, and designer-street crossovers — filtered by brand tags and product keywords in the catalog.",
      },
    ],
    productSectionTitle: "Top streetwear picks",
  },

  "bag-finds": {
    slug: "bag-finds",
    type: "collection",
    title: "Best Bag Finds 2026 | Designer & Street Bags",
    description:
      "Bag finds on LitBuy Finds — Louis Vuitton, Gucci, Goyard, Prada, and street crossbody bags with QC photos and verified agent links.",
    h1: "Best bag finds",
    intro:
      "Bag finds span designer crossbodies, totes, backpacks, and streetwear shoulder bags. QC matters most here — check hardware, stitching, and lining on warehouse photos before shipping.",
    badge: "Bag finds",
    keywords: ["bag finds", "designer bag finds", "litbuy bags", "rep bags"],
    updateFrequency: "weekly",
    filter: { keywords: ["bag", "backpack", "tote", "crossbody", "duffle", "shoulder"] },
    brandLinks: ["louis-vuitton", "gucci", "goyard", "prada"],
    sections: [
      {
        heading: "Popular bag categories",
        paragraphs: [
          "Louis Vuitton and Gucci lead designer bag searches. Goyard totes and Prada nylon bags are frequent haul picks. Budget street bags appear under accessories with lower price points.",
        ],
        links: [
          { href: "/litbuy-bags", label: "LitBuy bags hub" },
          { href: "/top-designer-bags", label: "Designer bags list" },
          { href: "/guides/best-bag-finds", label: "Bag buying guide" },
        ],
      },
    ],
    relatedLinks: [
      { href: "/best-bags", label: "Best bags collection" },
      { href: "/litbuy-spreadsheet", label: "Spreadsheet" },
      ...HUB.slice(0, 4),
    ],
    faqs: [
      {
        question: "Should I QC bags before shipping?",
        answer:
          "Yes. Bags are high-value items — always request warehouse QC and compare hardware engraving to reference photos.",
      },
    ],
    productSectionTitle: "Top bag picks",
  },

  "jacket-finds": {
    slug: "jacket-finds",
    type: "collection",
    title: "Best Jacket Finds 2026 | Moncler, TNF & Puffers",
    description:
      "Jacket finds on LitBuy Finds — Moncler, Canada Goose, Arc'teryx, The North Face, and puffer jackets with QC photos and agent links.",
    h1: "Best jacket finds",
    intro:
      "Jacket finds cover puffers, parkas, softshells, and designer outerwear. Moncler and Canada Goose-style rows dominate winter searches — this page surfaces listings with photos, prices, and QC references.",
    badge: "Jacket finds",
    keywords: ["jacket finds", "puffer finds", "moncler finds", "winter jacket finds"],
    updateFrequency: "weekly",
    filter: {
      categories: ["coats-and-jackets"],
      keywords: ["jacket", "puffer", "parka", "down", "coat"],
    },
    brandLinks: ["moncler", "canada-goose", "the-north-face", "arcteryx"],
    sections: [
      {
        heading: "Outerwear brands to compare",
        paragraphs: [
          "Moncler and Canada Goose lead premium outerwear clicks. The North Face and Arc'teryx-style technical shells are popular mid-budget picks. Always compare batch QC before shipping heavy jackets.",
        ],
        links: [
          { href: "/litbuy-jackets", label: "LitBuy jackets hub" },
          { href: "/best-jackets", label: "Best jackets" },
          { href: "/brands/moncler", label: "Moncler finds" },
        ],
      },
    ],
    relatedLinks: [
      { href: "/hoodie-finds", label: "Hoodie finds" },
      { href: "/clothing-finds", label: "Clothing finds" },
      ...HUB.slice(0, 4),
    ],
    faqs: [
      {
        question: "Are jacket batches consistent?",
        answer:
          "Outerwear batches vary significantly — use reference QC and warehouse photos. Weight and fill power differ between sellers.",
      },
    ],
    productSectionTitle: "Top jacket picks",
  },

  "hoodie-finds": {
    slug: "hoodie-finds",
    type: "collection",
    title: "Best Hoodie Finds 2026 | Streetwear & Designer",
    description:
      "Hoodie finds on LitBuy Finds — Stussy, Essentials, Nike Tech Fleece, and designer hoodies with QC photos and spreadsheet links.",
    h1: "Best hoodie finds",
    intro:
      "Hoodie finds are the backbone of most streetwear hauls. Browse Stussy, Essentials, Nike Tech Fleece, Corteiz, and designer hoodies with verified agent buy buttons — updated weekly from the LitBuy catalog.",
    badge: "Hoodie finds",
    keywords: ["hoodie finds", "streetwear hoodies", "litbuy hoodies", "rep hoodies"],
    updateFrequency: "weekly",
    filter: { keywords: ["hoodie", "sweatshirt", "crewneck"] },
    brandLinks: ["stussy", "essentials", "nike", "corteiz"],
    sections: [
      {
        heading: "Hoodie styles buyers search",
        paragraphs: [
          "Graphic streetwear hoodies, minimalist Essentials layers, and Nike Tech Fleece-style zip-ups lead volume. Compare photos and QC threads on Discord before committing to a batch.",
        ],
        links: [
          { href: "/litbuy-hoodies", label: "LitBuy hoodies hub" },
          { href: "/best-hoodies", label: "Best hoodies" },
          { href: "/streetwear-finds", label: "Streetwear finds" },
        ],
      },
    ],
    relatedLinks: [
      { href: "/clothing-finds", label: "Clothing finds" },
      { href: "/litbuy-spreadsheet", label: "Spreadsheet" },
      ...HUB.slice(0, 4),
    ],
    faqs: [
      {
        question: "How do I pick a hoodie batch?",
        answer:
          "Check reference QC on the product page, compare weight and embroidery in community threads, and request warehouse QC after purchase.",
      },
    ],
    productSectionTitle: "Top hoodie picks",
  },

  "cheap-finds": {
    slug: "cheap-finds",
    type: "collection",
    title: "Cheap Finds Under $30 | Budget LitBuy Picks 2026",
    description:
      "Cheap finds on LitBuy Finds — budget sneakers, tees, accessories, and streetwear under $30 with QC references and verified agent links.",
    h1: "Cheap finds",
    intro:
      "Cheap finds do not have to mean bad photos. This page surfaces sub-$30 listings with clear images and buy-ready links — ideal for filling out a haul without blowing the shipping budget.",
    badge: "Budget finds",
    keywords: ["cheap finds", "budget finds", "litbuy under 30", "affordable rep finds"],
    updateFrequency: "weekly",
    filter: { maxPrice: 30 },
    sections: [
      {
        heading: "Budget buying tips",
        paragraphs: [
          "Combine cheap basics with one or two premium pieces per haul to balance shipping cost. Tees, caps, and accessories often ship light — sneakers and jackets add weight fast.",
        ],
        links: [
          { href: "/best-under-20", label: "Under $20" },
          { href: "/best-under-30", label: "Under $30" },
          { href: "/top-budget-finds", label: "Top budget list" },
        ],
      },
    ],
    relatedLinks: [
      { href: "/deals", label: "Deals hub" },
      { href: LITBUY_SIGNUP_URL, label: "LitBuy coupons" },
      ...HUB.slice(0, 4),
    ],
    faqs: [
      {
        question: "Are cheap finds lower quality?",
        answer:
          "Not always — but batch variance is higher at low price points. Use QC references when available.",
      },
      {
        question: "Can coupons help budget hauls?",
        answer:
          "Shipping coupons often save more than product discounts on small carts — register for LitBuy shipping offers before your first parcel.",
      },
    ],
    productSectionTitle: "Cheap finds under $30",
  },

  "best-rep-finds": {
    slug: "best-rep-finds",
    type: "collection",
    title: "Best Rep Finds 2026 | QC Photos & Agent Links",
    description:
      "Best rep finds on LitBuy Finds — sneakers, streetwear, and designer picks with QC references, spreadsheet links, and verified multi-agent checkout.",
    h1: "Best rep finds",
    intro:
      "Rep finds span sneakers, streetwear, bags, and accessories sourced from Weidian and Taobao through shopping agents. This page highlights editor-ranked picks with photos, QC links where available, and verified buy buttons.",
    badge: "Rep finds",
    keywords: ["rep finds", "best rep finds", "replica finds", "chinese agent finds"],
    updateFrequency: "weekly",
    filter: { freshness: "editorsPicks" },
    sections: [
      {
        heading: "How to use rep finds safely",
        paragraphs: [
          "Always check reference QC on find pages and request warehouse QC before shipping. Compare batches in the LitBuy Discord community and read category guides for sneakers, bags, and jackets.",
        ],
        links: [
          { href: "/litbuy-qc-photos", label: "QC photos guide" },
          { href: "/litbuy-discord", label: "LitBuy Discord" },
          { href: "/guides/beginner-guide-to-litbuy", label: "Beginner guide" },
        ],
      },
    ],
    relatedLinks: [
      { href: "/best-litbuy-finds", label: "Best LitBuy finds" },
      { href: "/best-finds", label: "Best finds hub" },
      ...CATEGORIES.slice(0, 5),
    ],
    faqs: [
      {
        question: "What are rep finds?",
        answer:
          "Products sourced from Chinese marketplaces through agents like LitBuy — often community-curated with QC photos and spreadsheet links.",
      },
      {
        question: "Which agents support these finds?",
        answer:
          "LitBuy, MuleBuy, Kakobuy, HipoBuy, OopBuy, and ACBuy — switch per product on LitBuy Finds.",
      },
    ],
    productSectionTitle: "Editor-ranked rep finds",
  },

  "best-agent-finds": {
    slug: "best-agent-finds",
    type: "comparison",
    title: "Best Agent Finds 2026 | LitBuy, Kakobuy, MuleBuy & More",
    description:
      "Compare best agent finds across LitBuy, MuleBuy, Kakobuy, HipoBuy, OopBuy, and ACBuy — same catalog, your choice of checkout agent.",
    h1: "Best agent finds",
    intro:
      "Agent finds are the same Weidian and Taobao listings opened through different shopping agents. LitBuy Finds indexes one catalog — you choose LitBuy, MuleBuy, Kakobuy, HipoBuy, OopBuy, or ACBuy at checkout.",
    badge: "Agent comparison",
    keywords: ["best agent finds", "shopping agent finds", "chinese agent finds"],
    updateFrequency: "monthly",
    sections: [
      {
        heading: "Agents supported on LitBuy Finds",
        paragraphs: [
          "LitBuy is recommended for shipping coupons and QC workflow. MuleBuy, Kakobuy, HipoBuy, OopBuy, and ACBuy are fully supported alternatives — compare fees and shipping lines for your country.",
        ],
        links: AGENTS,
      },
      {
        heading: "Discovery vs checkout",
        paragraphs: [
          "Use LitBuy Finds to search and shortlist. Open your preferred agent link from each product page. Spreadsheet-style browsing works the same regardless of agent.",
        ],
        links: [
          { href: "/litbuy-spreadsheet", label: "LitBuy spreadsheet" },
          { href: "/best-shopping-agent", label: "Agent comparison guide" },
        ],
      },
    ],
    compareGroups: [
      { label: "Trending finds", filter: { freshness: "popularWeek" } },
      { label: "QC-linked picks", filter: { requireQc: true } },
    ],
    relatedLinks: [
      ...AGENTS,
      { href: "/chinese-agent-finds", label: "Chinese agent finds" },
      { href: "/rep-agent-spreadsheets", label: "Agent spreadsheets" },
    ],
    faqs: [
      {
        question: "Which agent is best for beginners?",
        answer:
          "LitBuy offers a polished app, shipping coupons, and strong QC workflow — most guides on this site are LitBuy-first.",
      },
      {
        question: "Can I switch agents mid-haul?",
        answer:
          "Each product opens through one agent at a time. You can use different agents for different orders.",
      },
    ],
    productSectionTitle: "Sample finds across agents",
  },

  "chinese-agent-finds": {
    slug: "chinese-agent-finds",
    type: "collection",
    title: "Chinese Agent Finds | Weidian, Taobao & QC Photos",
    description:
      "Chinese agent finds from Weidian and Taobao — browse through LitBuy, Kakobuy, MuleBuy, HipoBuy, OopBuy, or ACBuy with QC photos and spreadsheet discovery.",
    h1: "Chinese agent finds",
    intro:
      "Chinese agent finds are products purchased through shopping agents that buy from Weidian, Taobao, and 1688 on your behalf. LitBuy Finds indexes those listings into searchable pages with QC references and multi-agent checkout.",
    badge: "Agent finds",
    keywords: ["chinese agent finds", "weidian finds", "taobao finds", "agent marketplace"],
    updateFrequency: "weekly",
    filter: { freshness: "editorsPicks" },
    sections: [
      {
        heading: "Marketplaces behind agent finds",
        paragraphs: [
          "Weidian is popular for sneakers and streetwear. Taobao covers a wider fashion mix. Agents like LitBuy handle payment, warehouse storage, QC photos, and international shipping.",
        ],
        links: [
          { href: "/litbuy-weidian", label: "Weidian guide" },
          { href: "/litbuy-taobao", label: "Taobao guide" },
          { href: "/best-weidian-finds", label: "Best Weidian finds" },
        ],
      },
      {
        heading: "Choose your agent",
        paragraphs: [
          "LitBuy is the default recommendation on this site. Kakobuy, MuleBuy, HipoBuy, OopBuy, and ACBuy are supported when their fees or shipping lines fit your haul better.",
        ],
        links: AGENTS,
      },
    ],
    relatedLinks: [
      { href: "/best-agent-finds", label: "Best agent finds" },
      { href: "/rep-agent-spreadsheets", label: "Agent spreadsheets" },
      ...SPREADSHEETS.slice(0, 4),
    ],
    faqs: [
      {
        question: "What is a Chinese shopping agent?",
        answer:
          "A service that purchases from Chinese marketplaces, stores items at a warehouse, photographs them for QC, and ships internationally to your address.",
      },
      {
        question: "Do I need an agent for every find?",
        answer:
          "Yes for most Weidian and Taobao listings — agents handle currency conversion, domestic shipping in China, and international freight.",
      },
    ],
    productSectionTitle: "Chinese marketplace finds",
  },

  "rep-agent-spreadsheets": {
    slug: "rep-agent-spreadsheets",
    type: "spreadsheet",
    title: "Rep Agent Spreadsheets | LitBuy, Kakobuy & MuleBuy",
    description:
      "Rep agent spreadsheets compared — LitBuy, Kakobuy, MuleBuy, HipoBuy, OopBuy, and ACBuy spreadsheet-style discovery with QC photos and daily updates.",
    h1: "Rep agent spreadsheets",
    intro:
      "Rep agent spreadsheets list thousands of Weidian and Taobao products with prices and QC notes. LitBuy Finds turns those spreadsheet rows into searchable pages — use this hub to jump between agent-specific spreadsheet views.",
    badge: "Spreadsheets",
    keywords: ["rep agent spreadsheets", "agent spreadsheet", "litbuy spreadsheet", "rep spreadsheet"],
    updateFrequency: "weekly",
    filter: { freshness: "editorsPicks" },
    sections: spreadsheetSections("LitBuy, Kakobuy, MuleBuy, HipoBuy, OopBuy, and ACBuy"),
    relatedLinks: [
      ...SPREADSHEETS,
      { href: "/best-rep-spreadsheets", label: "Best rep spreadsheets" },
      ...AGENTS.slice(0, 4),
    ],
    faqs: [...SPREADSHEET_FAQS],
    productSectionTitle: "Spreadsheet picks",
  },

  "best-rep-spreadsheets": {
    slug: "best-rep-spreadsheets",
    type: "spreadsheet",
    title: "Best Rep Spreadsheets 2026 | Updated Finds & QC",
    description:
      "Best rep spreadsheets for 2026 — LitBuy, Kakobuy, MuleBuy, and community sheets with QC photos, prices, and agent links updated daily.",
    h1: "Best rep spreadsheets",
    intro:
      "The best rep spreadsheets combine fresh finds, QC references, and working agent links. LitBuy Finds is the searchable front-end for the LitBuy spreadsheet universe — with daily syncs and mobile-friendly product pages.",
    badge: "Spreadsheets",
    keywords: ["best rep spreadsheets", "updated finds spreadsheet", "litbuy finds spreadsheet"],
    updateFrequency: "weekly",
    getProducts: TOP_LISTS["best-qc-approved-finds"].getProducts,
    sections: [
      ...spreadsheetSections("LitBuy and supported agents"),
      {
        heading: "Spreadsheet vs LitBuy Finds",
        paragraphs: [
          "Keep your spreadsheet for seller notes and batch comparisons. Use LitBuy Finds when you need search, filters, shareable product URLs, and QC badges without downloading a new file every week.",
        ],
        links: [
          { href: "/collections/litbuy-spreadsheet-alternative", label: "Spreadsheet alternative" },
          { href: "/litbuy-finds", label: "LitBuy finds catalog" },
        ],
      },
    ],
    relatedLinks: [
      { href: "/rep-agent-spreadsheets", label: "Agent spreadsheets hub" },
      ...SPREADSHEETS,
      { href: "/litbuy-discord", label: "LitBuy Discord" },
    ],
    faqs: [
      ...SPREADSHEET_FAQS,
      {
        question: "Where can I find new spreadsheet drops?",
        answer:
          "Join the LitBuy Discord and Telegram communities for daily find alerts — or browse Latest Finds after each catalog sync.",
      },
    ],
    productSectionTitle: "Top spreadsheet finds",
  },
};
