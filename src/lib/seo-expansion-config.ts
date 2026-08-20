import type { StaticPageSection } from "./static-pages";
import { PUBLIC_CATALOG_COUNT } from "./catalog-count-public";
import { getFindsAuthorityStats } from "./finds-authority";
import { TOP_LISTS } from "./top-lists";
import type { SeoLandingPageEntry } from "./seo-landing-config";
import {
  AGENT_FINDS_LINKS,
  CATEGORY_FINDS_LINKS,
  SEO_HUB_LINKS,
  SPREADSHEET_CLUSTER_LINKS,
} from "./seo-internal-links";

const HUB = [...SEO_HUB_LINKS];
const SPREADSHEETS = [...SPREADSHEET_CLUSTER_LINKS];
const AGENTS = [...AGENT_FINDS_LINKS];
const CATEGORIES = [...CATEGORY_FINDS_LINKS];
const FINDS_STATS = getFindsAuthorityStats();

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
  "best-sneaker-finds": {
    slug: "best-sneaker-finds",
    type: "collection",
    title: "Best Sneaker Finds 2026 | Nike, Jordan & QC Photos",
    description:
      "Best sneaker finds on LitBuy Finds — editor-ranked Nike, Jordan, Adidas, and designer runners with QC photos, spreadsheet links, and verified agent buy buttons.",
    h1: "Best sneaker finds",
    intro:
      "This page ranks the strongest sneaker listings in the LitBuy Finds catalog — not every spreadsheet row, but picks with clear photos, exact prices, and QC references where buyers need them most. Use it when you want a curated shortlist before opening agent checkout.",
    badge: "Best sneakers",
    keywords: [
      "best sneaker finds",
      "best rep sneakers 2026",
      "litbuy best sneakers",
    ],
    updateFrequency: "weekly",
    getProducts: TOP_LISTS["top-rep-sneakers"].getProducts,
    brandLinks: ["nike", "jordan", "adidas", "new-balance"],
    categoryLinks: ["shoes"],
    sections: [
      {
        heading: "How we rank best sneaker finds",
        paragraphs: [
          "Sneakers are sorted for listing quality — processed product images, exact USD prices, QC link availability, and engagement signals from the catalog. Nike Dunks, Jordan retros, and Adidas campus styles dominate clicks, but budget runners under $50 also appear when photos hold up.",
          "This is different from the full sneaker category page, which shows a broader filter of every shoe listing. Use both: browse the category for depth, use this page for a ranked starting point.",
        ],
        links: [
          { href: "/sneaker-finds", label: "All sneaker finds" },
          { href: "/nike-finds", label: "Nike finds" },
          { href: "/jordan-finds", label: "Jordan finds" },
          { href: "/top-rep-sneakers", label: "Top rep sneakers list" },
        ],
      },
      {
        heading: "QC and agent links",
        paragraphs: [
          "Every pick links to LitBuy, Kakobuy, MuleBuy, or your preferred agent. Reference QC on a product page shows batch examples — warehouse QC on LitBuy is the final check before you ship.",
        ],
        links: [
          { href: "/what-are-qc-photos", label: "What are QC photos" },
          { href: "/litbuy-qc-photos", label: "LitBuy QC guide" },
          { href: "/how-to-use-litbuy", label: "How to use LitBuy" },
        ],
      },
    ],
    relatedLinks: [
      { href: "/finds", label: "Finds hub" },
      { href: "/sneaker-finds", label: "Sneaker category" },
      { href: "/shoe-spreadsheet", label: "Shoe spreadsheet" },
      { href: "/guides/best-rep-sneakers", label: "Sneaker buying guide" },
      ...HUB.slice(0, 3),
    ],
    faqs: [
      {
        question: "Is this the same as sneaker-finds?",
        answer:
          "No. Sneaker-finds shows the full shoes category. Best sneaker finds is an editor-ranked shortlist of the highest-quality listings in that lane.",
      },
      {
        question: "How often does this page update?",
        answer:
          "The product grid refreshes weekly as the catalog syncs and engagement signals shift. Check Latest Finds for brand-new imports.",
      },
      {
        question: "Do I need QC for sneakers?",
        answer:
          "Highly recommended. Soles, stitching, and logo placement vary by batch. Use reference QC on the find page, then request warehouse QC on LitBuy before shipping.",
      },
    ],
    productSectionTitle: "Editor-ranked sneaker picks",
  },

  "best-clothing-finds": {
    slug: "best-clothing-finds",
    type: "collection",
    title: "Best Clothing Finds 2026 | Streetwear & Fashion Reps",
    description:
      "Best clothing finds on LitBuy Finds — hoodies, jackets, tees, and fashion layers ranked for photos, QC, and verified agent links.",
    h1: "Best clothing finds",
    intro:
      "Clothing spans hoodies, puffers, graphic tees, cargos, and designer layers. This page surfaces the best-presented listings across those categories — ideal when you are building a haul and want reliable photos and prices without scrolling thousands of spreadsheet rows.",
    badge: "Best clothing",
    keywords: [
      "best clothing finds",
      "best rep clothing 2026",
      "litbuy fashion finds",
    ],
    updateFrequency: "weekly",
    filter: {
      categories: ["hoodies-and-pants", "coats-and-jackets", "tshirts-and-shorts"],
    },
    sections: [
      {
        heading: "What counts as best clothing",
        paragraphs: [
          "We prioritize listings with exact prices, clean product images, and QC references for outerwear and branded pieces. Streetwear staples — Stussy, Essentials, Chrome Hearts-style graphics — sit alongside Moncler and Stone Island jackets when batch photos are strong.",
        ],
        links: [
          { href: "/clothing-finds", label: "All clothing finds" },
          { href: "/hoodie-finds", label: "Hoodie finds" },
          { href: "/jacket-finds", label: "Jacket finds" },
          { href: "/streetwear-finds", label: "Streetwear finds" },
        ],
      },
      {
        heading: "Buying clothing through agents",
        paragraphs: [
          "Always check seller size charts on Weidian or Taobao before ordering. Clothing batches vary in fit and material — QC photos help you catch wrong colors or bad embroidery before international freight.",
        ],
        links: [
          { href: "/how-to-buy-reps", label: "How to buy reps" },
          { href: "/guides/qc-checklist-for-clothing", label: "Clothing QC checklist" },
          { href: "/guides", label: "All guides" },
        ],
      },
    ],
    relatedLinks: [
      { href: "/finds", label: "Finds hub" },
      { href: "/clothing-finds", label: "Clothing category" },
      { href: "/cheap-finds", label: "Budget finds" },
      { href: "/guides/best-streetwear-finds", label: "Streetwear guide" },
      ...CATEGORIES.filter((l) => l.href !== "/clothing-finds").slice(0, 3),
    ],
    faqs: [
      {
        question: "How is this different from clothing-finds?",
        answer:
          "Clothing-finds is the full category browse. Best clothing finds ranks the top-presented listings across hoodies, jackets, and tees.",
      },
      {
        question: "Which clothing brands are most popular?",
        answer:
          "Moncler, Stone Island, Stussy, Ralph Lauren, and Essentials lead search volume. Use brand find pages when you know the label you want.",
      },
      {
        question: "Can I mix clothing and sneakers in one haul?",
        answer:
          "Yes. Agents consolidate warehouse items — adding lighter tees or accessories often improves shipping cost per piece.",
      },
    ],
    productSectionTitle: "Top clothing picks",
  },

  "best-designer-finds": {
    slug: "best-designer-finds",
    type: "collection",
    title: "Best Designer Finds 2026 | Moncler, Prada & Luxury Reps",
    description:
      "Best designer finds on LitBuy Finds — Moncler, Prada, Gucci, Louis Vuitton, Chrome Hearts, and luxury reps with QC photos and agent links.",
    h1: "Best designer finds",
    intro:
      "Designer finds carry higher price points and batch risk — QC matters more here. This page highlights luxury and designer-leaning listings with strong presentation: puffers, bags, jewelry, and logo-heavy streetwear from verified marketplace sellers.",
    badge: "Designer finds",
    keywords: [
      "best designer finds",
      "designer rep finds 2026",
      "luxury litbuy finds",
    ],
    updateFrequency: "weekly",
    filter: {
      keywords: [
        "moncler",
        "prada",
        "gucci",
        "louis vuitton",
        "chrome hearts",
        "balenciaga",
        "dior",
        "stone island",
      ],
    },
    brandLinks: [
      "moncler",
      "prada",
      "gucci",
      "louis-vuitton",
      "chrome-hearts",
      "stone-island",
    ],
    sections: [
      {
        heading: "Designer categories on LitBuy Finds",
        paragraphs: [
          "Outerwear from Moncler and Stone Island, bags from Prada and Louis Vuitton, and Chrome Hearts jewelry each have dedicated brand find pages. This hub ranks cross-brand designer picks when you want a single starting point.",
        ],
        links: [
          { href: "/moncler-finds", label: "Moncler finds" },
          { href: "/prada-finds", label: "Prada finds" },
          { href: "/chrome-hearts-finds", label: "Chrome Hearts finds" },
          { href: "/stone-island-finds", label: "Stone Island finds" },
        ],
      },
      {
        heading: "QC for designer items",
        paragraphs: [
          "Hardware, badges, and logo embroidery are the usual failure points. Compare reference QC on LitBuy Finds with warehouse photos on LitBuy before approving shipment — designer batches are not interchangeable.",
        ],
        links: [
          { href: "/what-are-qc-photos", label: "What are QC photos" },
          { href: "/litbuy-qc", label: "QC authority page" },
          { href: "/guides/qc-checklist-for-bags", label: "Bag QC checklist" },
        ],
      },
    ],
    relatedLinks: [
      { href: "/rep-finds", label: "Rep finds hub" },
      { href: "/finds", label: "Finds hub" },
      { href: "/best-rep-finds", label: "Best rep finds" },
      { href: "/top-designer-bags", label: "Designer bags list" },
      { href: "/guides/best-moncler-finds", label: "Moncler guide" },
      { href: "/guides/best-prada-finds", label: "Prada guide" },
    ],
    faqs: [
      {
        question: "Are designer finds the same as designer rep finds?",
        answer:
          "Yes — this page covers designer / luxury rep finds. Use /rep-finds for the broader rep finds hub and /best-rep-finds for editor-ranked highlights across all lanes.",
      },
      {
        question: "Are designer finds worth the price?",
        answer:
          "It depends on batch and use case. Outerwear and bags benefit most from QC — compare multiple listings and reference photos before ordering.",
      },
      {
        question: "Where do designer listings come from?",
        answer:
          "Most originate from Weidian and Taobao sellers indexed in community spreadsheets. LitBuy Finds normalizes them into searchable pages with agent links.",
      },
      {
        question: "Which designer brand has the most QC?",
        answer:
          "Moncler jackets and popular bag batches tend to have the most community QC threads — check each product page for reference links.",
      },
    ],
    productSectionTitle: "Top designer picks",
  },

  "sneaker-finds": {
    slug: "sneaker-finds",
    type: "collection",
    title: "Sneaker Finds 2026 | Nike, Jordan, Adidas & QC Photos",
    description:
      "Sneaker finds on LitBuy Finds — Nike, Jordan, Adidas, New Balance, and designer runners with QC photos, sneaker spreadsheet links, and verified agent buy buttons.",
    h1: "Sneaker finds",
    intro:
      "Sneaker finds are the most searched lane on LitBuy Finds. Browse Nike Dunks, Jordan retros, Adidas Campus styles, and New Balance runners — each with photos, prices, QC references where available, and one-click agent links. For editor-ranked picks, see Best Sneaker Finds.",
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
          { href: "/best-sneaker-finds", label: "Best sneaker finds" },
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
      {
        heading: "Sneaker find database navigation",
        paragraphs: [
          `This page is a live sneaker product database — not a generic landing page. New Nike, Jordan, and Adidas rows land in Latest Finds first, then stay searchable here and in the shoe category hub. Connect to the LitBuy spreadsheet guide when you need spreadsheet context for the same listings.`,
        ],
        links: [
          { href: "/latest-finds", label: "Latest finds hub" },
          { href: "/litbuy-spreadsheet", label: "LitBuy spreadsheet" },
          { href: "/categories/shoes", label: "Shoe category hub" },
          { href: "/finds", label: "Full finds hub" },
        ],
      },
    ],
    relatedLinks: [
      { href: "/best-sneaker-finds", label: "Best sneaker finds" },
      { href: "/latest-finds", label: "Latest finds" },
      { href: "/litbuy-discord", label: "LitBuy Discord" },
      { href: "/shoe-spreadsheet", label: "Sneaker spreadsheet" },
      { href: "/litbuy-spreadsheet", label: "LitBuy spreadsheet" },
      { href: "/litbuy-coupons", label: "LitBuy coupons" },
      ...HUB.filter((l) => !["/litbuy-finds"].includes(l.href)).slice(0, 3),
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
      {
        question: "Is there a sneaker spreadsheet?",
        answer:
          "Yes. Browse the shoe spreadsheet page or LitBuy spreadsheet hub for Nike and Jordan rows — LitBuy Finds turns those links into searchable product pages.",
      },
    ],
    productSectionTitle: "Top sneaker picks",
  },

  "clothing-finds": {
    slug: "clothing-finds",
    type: "collection",
    title: "Clothing Finds 2026 | Hoodies, Jackets & Streetwear",
    description:
      "Clothing finds on LitBuy Finds — hoodies, jackets, t-shirts, streetwear layers, and fashion reps with QC photos and multi-agent links.",
    h1: "Clothing finds",
    intro:
      "Clothing finds cover hoodies, jackets, tees, cargos, and everyday fashion layers from Weidian and Taobao. Browse by category faster than scrolling a 5,000-row spreadsheet on mobile — or jump to Best Clothing Finds for editor-ranked picks.",
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
          { href: "/best-clothing-finds", label: "Best clothing finds" },
        ],
      },
      {
        heading: "Clothing categories to browse",
        paragraphs: [
          "Hoodies and graphic tees lead everyday clicks. Puffer jackets and outerwear from Moncler, Stone Island, and Arc'teryx-style labels need extra QC. Streetwear staples from Stussy, Essentials, and Corteiz appear across hoodie and streetwear find pages.",
        ],
        links: [
          { href: "/hoodie-finds", label: "Hoodie finds" },
          { href: "/jacket-finds", label: "Jacket finds" },
          { href: "/streetwear-finds", label: "Streetwear finds" },
          { href: "/best-clothing-finds", label: "Best clothing finds" },
        ],
      },
      {
        heading: "Clothing find database navigation",
        paragraphs: [
          "Use this page as the clothing rep database hub — hoodies, jackets, tees, and streetwear layers with verified agent links. New spreadsheet rows appear in Latest Finds daily; the LitBuy spreadsheet guide explains how those rows map to searchable product pages.",
        ],
        links: [
          { href: "/latest-finds", label: "Latest finds hub" },
          { href: "/litbuy-spreadsheet", label: "LitBuy spreadsheet" },
          { href: "/categories", label: "All categories" },
          { href: "/finds", label: "Finds hub" },
        ],
      },
    ],
    relatedLinks: [
      { href: "/best-clothing-finds", label: "Best clothing finds" },
      { href: "/latest-finds", label: "Latest finds" },
      { href: "/litbuy-spreadsheet", label: "LitBuy spreadsheet" },
      { href: "/hoodie-finds", label: "Hoodie finds" },
      { href: "/jacket-finds", label: "Jacket finds" },
      { href: "/streetwear-finds", label: "Streetwear finds" },
      { href: "/finds", label: "Finds hub" },
      { href: "/litbuy-qc", label: "QC database" },
      ...CATEGORIES.filter((l) => l.href !== "/clothing-finds").slice(0, 3),
    ],
    faqs: [
      {
        question: "Is clothing on LitBuy Finds the same as spreadsheet rows?",
        answer:
          "Same product universe — LitBuy Finds adds search, filters, QC badges, and shareable product URLs instead of endless spreadsheet rows.",
      },
      {
        question: "How do I use a LitBuy clothing spreadsheet with this page?",
        answer:
          "Community clothing spreadsheets list hoodies, jackets, and tees as rows. LitBuy Finds indexes those rows into searchable pages — start here for the clothing database, then open the LitBuy spreadsheet guide for how columns map to product pages.",
      },
      {
        question: "How do I find my size?",
        answer:
          "Open the LitBuy listing from the product page and check the seller size chart on Weidian or Taobao before ordering. Compare measurements to a garment you already own.",
      },
      {
        question: "Which clothing types are most popular?",
        answer:
          "Hoodies, puffer jackets, and graphic tees lead search volume. Use hoodie-finds and jacket-finds for focused browsing.",
      },
      {
        question: "Should I request QC for clothing?",
        answer:
          "Yes for jackets and higher-value hoodies. Check embroidery, fill, zippers, and print placement in warehouse QC before international shipping.",
      },
    ],
    productSectionTitle: "Top clothing picks",
  },

  "streetwear-finds": {
    slug: "streetwear-finds",
    type: "collection",
    title: "Streetwear Finds 2026 | Stussy, Corteiz & Hype Layers",
    description:
      "Streetwear finds on LitBuy Finds — Stussy, Corteiz, Supreme, Essentials, and hype labels with QC photos, spreadsheet links, and verified agent buy buttons.",
    h1: "Streetwear finds",
    intro:
      "Streetwear finds cover UK and US hype labels — Stussy, Corteiz, Supreme, Fear of God Essentials, and Chrome Hearts-style pieces. Browse listings with photos, QC references where available, and one-click agent links — or jump to Best Clothing Finds for editor-ranked fashion picks.",
    badge: "Streetwear finds",
    keywords: ["streetwear finds", "hype finds", "stussy finds", "corteiz finds", "fashion finds"],
    updateFrequency: "weekly",
    filter: {
      keywords: ["stussy", "corteiz", "supreme", "essentials", "chrome", "streetwear", "fear of god"],
    },
    brandLinks: ["stussy", "corteiz", "supreme", "essentials"],
    sections: [
      {
        heading: "What you can find",
        paragraphs: [
          "Graphic hoodies, cargos, varsity jackets, and logo-heavy layers from Stussy, Corteiz, Supreme, and Essentials. Each listing links to verified Weidian or Taobao checkout through LitBuy, Kakobuy, MuleBuy, or other supported agents.",
        ],
        links: [
          { href: "/hoodie-finds", label: "Hoodie finds" },
          { href: "/clothing-finds", label: "Clothing finds" },
          { href: "/latest-finds", label: "Latest finds" },
        ],
      },
      {
        heading: "Popular streetwear brands",
        paragraphs: [
          "Stussy and Corteiz lead UK streetwear searches. Supreme and Essentials remain staple haul picks. Chrome Hearts-style jewelry and hoodies appear in accessories and streetwear filters — use brand pages when you know the label you want.",
        ],
        links: [
          { href: "/brands/stussy", label: "Stussy" },
          { href: "/brands/corteiz", label: "Corteiz" },
          { href: "/top-streetwear-finds", label: "Top streetwear list" },
          { href: "/streetwear-spreadsheet", label: "Streetwear spreadsheet" },
        ],
      },
      {
        heading: "Spreadsheets and QC for streetwear",
        paragraphs: [
          "Community streetwear spreadsheets move fast — new batches and price drops appear daily. LitBuy Finds turns those rows into searchable pages with QC badges. Pair reference QC on find pages with warehouse QC on LitBuy before shipping heavy outerwear.",
        ],
        links: [
          { href: "/litbuy-spreadsheet", label: "LitBuy spreadsheet" },
          { href: "/litbuy-qc-photos", label: "QC photos guide" },
          { href: "/litbuy-discord", label: "LitBuy Discord" },
        ],
      },
    ],
    relatedLinks: [
      { href: "/clothing-finds", label: "Clothing finds" },
      { href: "/hoodie-finds", label: "Hoodie finds" },
      { href: "/latest-finds", label: "Latest finds" },
      { href: "/litbuy-spreadsheet", label: "LitBuy spreadsheet" },
      { href: "/litbuy-coupons", label: "LitBuy coupons" },
      { href: "/litbuy-discord", label: "LitBuy Discord" },
      ...HUB.filter((l) => !["/litbuy-finds"].includes(l.href)).slice(0, 3),
    ],
    faqs: [
      {
        question: "What counts as streetwear on LitBuy Finds?",
        answer:
          "Hype labels, graphic hoodies, cargos, and designer-street crossovers — filtered by brand tags and product keywords in the catalog.",
      },
      {
        question: "Where do streetwear finds come from?",
        answer:
          "Most listings originate from Weidian and Taobao sellers indexed in community LitBuy spreadsheets. LitBuy Finds normalizes them into searchable product pages with agent links.",
      },
      {
        question: "Is there a streetwear spreadsheet?",
        answer:
          "Yes. Browse the streetwear spreadsheet page or LitBuy spreadsheet hub — LitBuy Finds turns those rows into mobile-friendly find pages with QC references.",
      },
      {
        question: "How do I compare streetwear batches?",
        answer:
          "Check reference QC on the product page, read Discord threads for batch opinions, and request warehouse QC after purchase before international shipping.",
      },
    ],
    productSectionTitle: "Top streetwear picks",
  },

  "bag-finds": {
    slug: "bag-finds",
    type: "collection",
    title: "Bag Finds 2026 | Designer Bags, Totes & Crossbodies",
    description:
      "Bag finds on LitBuy Finds — Louis Vuitton, Gucci, Goyard, Prada, and street crossbody bags with QC photos, spreadsheet-synced listings, and verified agent links.",
    h1: "Bag finds",
    intro:
      "Bag finds span designer crossbodies, totes, backpacks, and streetwear shoulder bags from the LitBuy spreadsheet catalog. QC matters most here — check hardware, stitching, and lining on warehouse photos before shipping.",
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
          { href: "/categories/accessories", label: "Accessories category" },
          { href: "/guides/best-bag-finds", label: "Bag buying guide" },
        ],
      },
      {
        heading: "QC checklist for bag finds",
        paragraphs: [
          "Compare hardware engraving, monogram alignment, stitching, zipper pulls, and lining photos in warehouse QC. Bags are high-value — never ship without reviewing your own QC set.",
        ],
        links: [
          { href: "/litbuy-qc", label: "QC database" },
          { href: "/what-are-qc-photos", label: "What are QC photos" },
          { href: "/guides/how-to-check-qc-photos", label: "How to check QC" },
        ],
      },
      {
        heading: "Spreadsheet connection for bag finds",
        paragraphs: [
          "Community LitBuy spreadsheets list bag rows with seller URLs and approximate prices. LitBuy Finds turns those rows into searchable bag product pages with QC badges and agent buy buttons.",
        ],
        links: [
          { href: "/litbuy-spreadsheet", label: "LitBuy spreadsheet" },
          { href: "/latest-finds", label: "Latest finds" },
          { href: "/finds", label: "Finds hub" },
        ],
      },
    ],
    relatedLinks: [
      { href: "/best-bags", label: "Best bags collection" },
      { href: "/litbuy-spreadsheet", label: "LitBuy spreadsheet" },
      { href: "/latest-finds", label: "Latest finds" },
      { href: "/clothing-finds", label: "Clothing finds" },
      { href: "/litbuy-qc", label: "QC database" },
      { href: "/finds", label: "Finds hub" },
      { href: "/categories/accessories", label: "Accessories" },
    ],
    faqs: [
      {
        question: "Should I QC bags before shipping?",
        answer:
          "Yes. Bags are high-value items — always request warehouse QC and compare hardware engraving to reference photos.",
      },
      {
        question: "Where do bag finds come from?",
        answer:
          "Most bag listings originate from Weidian and Taobao sellers indexed via LitBuy spreadsheet imports — each page links to verified agent checkout.",
      },
      {
        question: "What are the most popular bag brands?",
        answer:
          "Louis Vuitton, Gucci, Goyard, and Prada lead designer bag searches. Budget street bags appear under accessories.",
      },
    ],
    productSectionTitle: "Top bag picks",
  },

  "jacket-finds": {
    slug: "jacket-finds",
    type: "collection",
    title: "Jacket Finds 2026 | Moncler, TNF, Puffers & Outerwear",
    description:
      "Jacket finds on LitBuy Finds — Moncler, Canada Goose, Arc'teryx, The North Face, and puffer jackets with QC photos, spreadsheet-synced listings, and agent links.",
    h1: "Jacket finds",
    intro:
      "Jacket finds cover puffers, parkas, softshells, and designer outerwear from the LitBuy spreadsheet catalog. Moncler and Canada Goose-style rows dominate winter searches — this page surfaces listings with photos, prices, and QC references.",
    badge: "Jacket finds",
    keywords: ["jacket finds", "puffer finds", "moncler finds", "winter jacket finds", "rep jackets"],
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
          { href: "/brands/canada-goose", label: "Canada Goose finds" },
        ],
      },
      {
        heading: "Jacket QC checklist",
        paragraphs: [
          "Check badge stitching, zipper branding, fill distribution, cuff and hem finish, and overall weight against reference QC. Outerwear batches vary — never approve shipping from listing photos alone.",
        ],
        links: [
          { href: "/litbuy-qc", label: "QC database" },
          { href: "/what-are-qc-photos", label: "What are QC photos" },
          { href: "/guides/how-to-check-qc-photos", label: "How to check QC" },
        ],
      },
      {
        heading: "Jacket find database navigation",
        paragraphs: [
          "This jacket finds page is a searchable outerwear database — puffers, parkas, and designer coats with QC references and agent links. New spreadsheet imports surface in Latest Finds; use the LitBuy spreadsheet guide to understand how rows become product pages.",
        ],
        links: [
          { href: "/latest-finds", label: "Latest finds hub" },
          { href: "/litbuy-spreadsheet", label: "LitBuy spreadsheet" },
          { href: "/clothing-finds", label: "Clothing finds" },
          { href: "/categories/coats-and-jackets", label: "Jacket category hub" },
        ],
      },
      {
        heading: "Shipping tips for jackets",
        paragraphs: [
          "Puffers are bulky — factor volumetric weight into shipping. Bundle jackets with lighter items in one parcel when possible, and use rehearsal packing on your agent before paying freight.",
        ],
        links: [
          { href: "/how-to-save-on-shipping", label: "Save on shipping" },
          { href: "/guides/how-shipping-works-with-agents", label: "Shipping guide" },
        ],
      },
    ],
    relatedLinks: [
      { href: "/hoodie-finds", label: "Hoodie finds" },
      { href: "/clothing-finds", label: "Clothing finds" },
      { href: "/streetwear-finds", label: "Streetwear finds" },
      { href: "/latest-finds", label: "Latest finds" },
      { href: "/litbuy-spreadsheet", label: "LitBuy spreadsheet" },
      { href: "/litbuy-qc", label: "QC database" },
      { href: "/finds", label: "Finds hub" },
      { href: "/best-jackets", label: "Best jackets" },
    ],
    faqs: [
      {
        question: "Are jacket batches consistent?",
        answer:
          "Outerwear batches vary significantly — use reference QC and warehouse photos. Weight and fill power differ between sellers.",
      },
      {
        question: "How do jacket finds relate to the LitBuy spreadsheet?",
        answer:
          "Jacket rows in community LitBuy spreadsheets become searchable product pages here — with photos, QC badges, and agent buy buttons instead of raw sheet cells.",
      },
      {
        question: "What should I check in jacket QC?",
        answer:
          "Badge stitching, zipper branding, fill distribution, cuff finish, and overall silhouette. Compare to reference QC on the product page when available.",
      },
      {
        question: "Which jacket brands are most popular?",
        answer:
          "Moncler and Canada Goose lead premium searches. The North Face and Arc'teryx-style shells are popular mid-budget outerwear picks.",
      },
    ],
    productSectionTitle: "Top jacket picks",
  },

  "hoodie-finds": {
    slug: "hoodie-finds",
    type: "collection",
    title: "Hoodie Finds 2026 | Stussy, Essentials & Streetwear",
    description:
      "Hoodie finds on LitBuy Finds — Stussy, Essentials, Nike Tech Fleece, Corteiz, and designer hoodies with QC photos, spreadsheet links, and agent buy buttons.",
    h1: "Hoodie finds",
    intro:
      "Hoodie finds are the backbone of most streetwear hauls. Browse Stussy, Essentials, Nike Tech Fleece, Corteiz, and designer hoodies with verified agent buy buttons — updated weekly from the LitBuy catalog and community spreadsheets.",
    badge: "Hoodie finds",
    keywords: ["hoodie finds", "streetwear hoodies", "litbuy hoodies", "rep hoodies", "clothing finds"],
    updateFrequency: "weekly",
    filter: { keywords: ["hoodie", "sweatshirt", "crewneck"] },
    brandLinks: ["stussy", "essentials", "nike", "corteiz"],
    sections: [
      {
        heading: "Popular hoodie styles",
        paragraphs: [
          "Graphic streetwear hoodies, minimalist Essentials layers, and Nike Tech Fleece-style zip-ups lead search volume. Compare photos and QC threads on Discord before committing to a batch — hoodies vary in weight, embroidery, and fit between sellers.",
        ],
        links: [
          { href: "/litbuy-hoodies", label: "LitBuy hoodies hub" },
          { href: "/best-hoodies", label: "Best hoodies" },
          { href: "/streetwear-finds", label: "Streetwear finds" },
        ],
      },
      {
        heading: "Brands buyers search most",
        paragraphs: [
          "Stussy and Essentials dominate everyday hoodie hauls. Nike Tech Fleece-style zip-ups and Corteiz graphic hoodies are frequent spreadsheet rows. Use brand pages when you want the full inventory for one label.",
        ],
        links: [
          { href: "/brands/stussy", label: "Stussy" },
          { href: "/brands/nike", label: "Nike" },
          { href: "/clothing-finds", label: "Clothing finds" },
        ],
      },
      {
        heading: "Spreadsheets and latest drops",
        paragraphs: [
          "New hoodie batches appear in community spreadsheets daily. LitBuy Finds syncs those rows into searchable pages — check Latest Finds for fresh imports after each catalog sync.",
        ],
        links: [
          { href: "/litbuy-spreadsheet", label: "LitBuy spreadsheet" },
          { href: "/latest-finds", label: "Latest finds" },
          { href: "/guides/litbuy-spreadsheet-guide", label: "Spreadsheet guide" },
        ],
      },
    ],
    relatedLinks: [
      { href: "/clothing-finds", label: "Clothing finds" },
      { href: "/streetwear-finds", label: "Streetwear finds" },
      { href: "/jacket-finds", label: "Jacket finds" },
      { href: "/latest-finds", label: "Latest finds" },
      { href: "/litbuy-spreadsheet", label: "LitBuy spreadsheet" },
      { href: "/litbuy-qc", label: "QC database" },
      { href: "/finds", label: "Finds hub" },
      { href: "/categories/hoodies", label: "Hoodies category" },
    ],
    faqs: [
      {
        question: "How do I pick a hoodie batch?",
        answer:
          "Check reference QC on the product page, compare weight and embroidery in community threads, and request warehouse QC after purchase.",
      },
      {
        question: "Which hoodie brands are most popular?",
        answer:
          "Stussy, Essentials, Nike Tech Fleece-style zip-ups, and Corteiz graphic hoodies lead search volume on LitBuy Finds.",
      },
      {
        question: "Are hoodie finds the same as spreadsheet rows?",
        answer:
          "Same product universe — LitBuy Finds adds search, filters, QC badges, and shareable product URLs without scrolling thousands of spreadsheet rows.",
      },
      {
        question: "Do hoodies need QC before shipping?",
        answer:
          "Recommended for graphic embroidery and logo placement. Request warehouse QC on LitBuy and compare stitching to reference photos before paying international freight.",
      },
      {
        question: "How do I find hoodie sizing?",
        answer:
          "Open the agent listing from the product page and compare the seller size chart to a hoodie you already own. Fit varies by batch and brand.",
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
      { href: "/rep-finds", label: "Rep finds hub" },
      { href: "/deals", label: "Deals hub" },
      { href: "/litbuy-coupons", label: "LitBuy coupons" },
      ...HUB.slice(0, 4),
    ],
    faqs: [
      {
        question: "Are cheap finds the same as cheap rep finds?",
        answer:
          "Yes — this page covers budget / cheap rep finds under $30. For the full rep finds map, start at /rep-finds.",
      },
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
      "Best rep finds are editor-ranked highlights from the broader rep finds database — sneakers, streetwear, bags, and accessories with photos, QC links where available, and verified buy buttons. For the full rep finds hub, start at /rep-finds.",
    badge: "Best rep finds",
    keywords: ["best rep finds", "rep finds", "replica finds", "chinese agent finds"],
    updateFrequency: "weekly",
    filter: { freshness: "editorsPicks" },
    sections: [
      {
        heading: "Part of the rep finds hub",
        paragraphs: [
          "This page ranks standout picks. The main /rep-finds authority covers cheap rep finds, designer rep finds, category lanes, and how rep finds connect to the LitBuy Spreadsheet and QC database.",
        ],
        links: [
          { href: "/rep-finds", label: "Rep finds hub" },
          { href: "/cheap-finds", label: "Cheap finds" },
          { href: "/best-designer-finds", label: "Designer finds" },
        ],
      },
      {
        heading: "How to use rep finds safely",
        paragraphs: [
          "Always check reference QC on find pages and request warehouse QC before shipping. Compare batches against product-page QC references and read category guides for sneakers, bags, and jackets.",
        ],
        links: [
          { href: "/litbuy-qc", label: "QC finds database" },
          { href: "/litbuy-qc-photos", label: "QC photos guide" },
          { href: "/guides/beginner-guide-to-litbuy", label: "Beginner guide" },
          { href: "/litbuy-spreadsheet", label: "LitBuy Spreadsheet" },
        ],
      },
      {
        heading: "Rep find categories",
        paragraphs: [
          "Sneakers, streetwear, designer outerwear, and bags each have dedicated find pages. Start at the rep finds hub for overview, then drill into sneaker finds or clothing finds for full category browsing.",
        ],
        links: [
          { href: "/sneaker-finds", label: "Sneaker finds" },
          { href: "/clothing-finds", label: "Clothing finds" },
          { href: "/best-designer-finds", label: "Designer finds" },
          { href: "/latest-finds", label: "Latest finds" },
        ],
      },
      {
        heading: "Rep find database hub",
        paragraphs: [
          `Best rep finds highlights editor-ranked products from the ${FINDS_STATS.totalFindsLabel}-item LitBuy Finds database. Every listing links to a full product page with brand and category connections — use Latest Finds for new spreadsheet imports and the LitBuy Spreadsheet guide for bulk reference.`,
        ],
        links: [
          { href: "/rep-finds", label: "Rep finds hub" },
          { href: "/latest-finds", label: "Latest finds hub" },
          { href: "/litbuy-spreadsheet", label: "LitBuy Spreadsheet" },
          { href: "/litbuy-qc", label: "QC finds database" },
          { href: "/finds", label: "Finds hub" },
        ],
      },
    ],
    relatedLinks: [
      { href: "/rep-finds", label: "Rep finds hub" },
      { href: "/finds", label: "Finds hub" },
      { href: "/latest-finds", label: "Latest finds" },
      { href: "/litbuy-spreadsheet", label: "LitBuy Spreadsheet" },
      { href: "/best-litbuy-finds", label: "Best LitBuy finds" },
      { href: "/litbuy-qc", label: "QC finds database" },
      { href: "/sneaker-finds", label: "Sneaker finds" },
      { href: "/clothing-finds", label: "Clothing finds" },
      ...CATEGORIES.slice(0, 3),
    ],
    faqs: [
      {
        question: "What are best rep finds?",
        answer:
          "Editor-ranked rep finds from the LitBuy Finds database — weighted for photos, QC, and engagement. The broader /rep-finds hub covers all rep find lanes.",
      },
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
      {
        question: "How often are rep finds updated?",
        answer:
          "The catalog syncs daily. Editor-ranked picks refresh weekly — check Latest Finds for brand-new imports.",
      },
    ],
    productSectionTitle: "Editor-ranked rep finds",
  },

  "rep-finds": {
    slug: "rep-finds",
    type: "collection",
    title: "Rep Finds | Searchable Database, QC Photos & Agent Links",
    description:
      "Rep finds on LitBuy Finds — a searchable discovery database of sneakers, streetwear, designer, and cheap rep finds with QC photos, spreadsheet sync, and verified agent links.",
    h1: "Rep finds",
    intro:
      `Rep finds are Weidian and Taobao products discovered through shopping agents — indexed here as a searchable database of ${FINDS_STATS.totalFindsLabel}+ listings (${FINDS_STATS.qcFindsLabel} with QC photos). Browse categories and brands, open Best rep finds for ranked picks, and connect to the LitBuy Spreadsheet for catalog context.`,
    badge: "Rep finds database",
    keywords: [
      "rep finds",
      "best rep finds",
      "cheap rep finds",
      "designer rep finds",
      "replica finds",
      "rep spreadsheet",
      "reps spreadsheet",
    ],
    updateFrequency: "weekly",
    filter: { freshness: "editorsPicks" },
    productLimit: 24,
    sections: [
      {
        heading: "A rep finds discovery database",
        paragraphs: [
          "LitBuy Finds organizes rep finds into product pages with photos, prices, QC badges, brand hubs, and multi-agent checkout. This hub is the authority entry for “rep finds” searches — not a blog post.",
          "Use Latest Finds for new spreadsheet imports, Best rep finds for editor-ranked shortlists, and category find pages when you already know the lane.",
        ],
        links: [
          { href: "/best-rep-finds", label: "Best rep finds" },
          { href: "/latest-finds", label: "Latest finds" },
          { href: "/litbuy-spreadsheet", label: "LitBuy Spreadsheet" },
          { href: "/finds", label: "Finds hub" },
        ],
      },
      {
        heading: "Best, cheap, and designer rep finds",
        paragraphs: [
          "Best rep finds highlights engagement-weighted picks. Cheap finds and budget rails cover lower price bands. Designer find pages focus on luxury labels — each supports this hub without duplicating the full catalog.",
        ],
        links: [
          { href: "/best-rep-finds", label: "Best rep finds" },
          { href: "/cheap-finds", label: "Cheap finds" },
          { href: "/best-designer-finds", label: "Designer finds" },
          { href: "/best-under-30", label: "Under $30" },
        ],
      },
      {
        heading: "Browse rep finds by category",
        paragraphs: [
          "Sneakers, clothing, streetwear, hoodies, jackets, and bags each have dedicated find databases. Jump into a category when you want filters and volume; return here for the overall rep finds map.",
        ],
        links: [
          { href: "/sneaker-finds", label: "Sneaker finds" },
          { href: "/clothing-finds", label: "Clothing finds" },
          { href: "/streetwear-finds", label: "Streetwear finds" },
          { href: "/jacket-finds", label: "Jacket finds" },
          { href: "/bag-finds", label: "Bag finds" },
        ],
      },
      {
        heading: "QC finds and spreadsheet connection",
        paragraphs: [
          "Many rep finds include QC references from community or warehouse albums. Open the QC finds database for QC-linked products, then use the LitBuy Spreadsheet guide to understand how rows become searchable pages.",
        ],
        links: [
          { href: "/litbuy-qc", label: "QC finds database" },
          { href: "/what-are-qc-photos", label: "What are QC photos" },
          { href: "/litbuy-spreadsheet", label: "LitBuy Spreadsheet" },
          { href: "/best-rep-spreadsheets", label: "Rep spreadsheets" },
        ],
      },
    ],
    relatedLinks: [
      { href: "/best-rep-finds", label: "Best rep finds" },
      { href: "/latest-finds", label: "Latest finds" },
      { href: "/litbuy-spreadsheet", label: "LitBuy Spreadsheet" },
      { href: "/litbuy-finds", label: "LitBuy finds" },
      { href: "/litbuy-qc", label: "QC finds database" },
      { href: "/finds", label: "Finds hub" },
      { href: "/cheap-finds", label: "Cheap finds" },
      { href: "/best-designer-finds", label: "Designer finds" },
      { href: "/sneaker-finds", label: "Sneaker finds" },
      { href: "/clothing-finds", label: "Clothing finds" },
      ...CATEGORIES.slice(0, 3),
    ],
    faqs: [
      {
        question: "What are rep finds?",
        answer:
          "Rep finds are products sourced from Chinese marketplaces through shopping agents — indexed on LitBuy Finds with photos, prices, QC references where available, and verified buy links.",
      },
      {
        question: "Where should I start — rep finds or best rep finds?",
        answer:
          "Start here for the full rep finds map. Use /best-rep-finds when you want editor-ranked highlights only.",
      },
      {
        question: "How do rep finds connect to the LitBuy Spreadsheet?",
        answer:
          "Many listings originate from LitBuy spreadsheet / lit buy spreadsheet imports. The LitBuy Spreadsheet page explains the catalog; product pages are the shareable endpoints.",
      },
      {
        question: "Where do I find cheap or designer rep finds?",
        answer:
          "Open Cheap finds and Best designer finds — both support this hub with unique intent instead of duplicating the full database.",
      },
    ],
    productSectionTitle: "Featured rep finds",
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
      { href: "/finds", label: "Finds hub" },
      { href: "/litbuy-spreadsheet", label: "LitBuy spreadsheet" },
      { href: "/litbuy-coupons", label: "LitBuy coupons" },
      { href: "/litbuy-discord", label: "LitBuy Discord" },
      { href: "/guides", label: "Guides" },
      ...AGENTS,
      { href: "/chinese-agent-finds", label: "Chinese agent finds" },
      { href: "/rep-agent-spreadsheets", label: "Agent spreadsheets" },
      { href: "/best-rep-spreadsheets", label: "Best rep spreadsheets" },
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
    title: "Rep Agent Spreadsheets | USFans, GTBuy, OopBuy & More",
    description:
      "Rep agent spreadsheets for USFans, GTBuy, OopBuy, BoonBuy, HipoBuy, Kakobuy, LitBuy, and more — searchable finds with QC photos and agent checkout.",
    h1: "Rep agent spreadsheets",
    intro:
      "Rep agent spreadsheets list thousands of Weidian and Taobao products with prices and QC notes. LitBuy Finds turns those spreadsheet rows into searchable pages — use this hub to jump between agent-specific spreadsheet views.",
    badge: "Spreadsheets",
    keywords: [
      "rep agent spreadsheets",
      "agent spreadsheet",
      "usfans spreadsheet",
      "gtbuy spreadsheet",
      "oopbuy spreadsheet",
      "boonbuy spreadsheet",
      "hipobuy spreadsheet",
      "kakobuy spreadsheet",
      "litbuy spreadsheet",
      "rep spreadsheet",
    ],
    updateFrequency: "weekly",
    filter: { freshness: "editorsPicks" },
    sections: [
      ...spreadsheetSections(
        "USFans, GTBuy, OopBuy, BoonBuy, HipoBuy, Kakobuy, LitBuy, MuleBuy, and ACBuy"
      ),
      {
        heading: "Agent spreadsheet guides",
        paragraphs: [
          "Each agent spreadsheet page targets shoppers who searched for that agent’s sheet — same catalog, agent-specific checkout context, QC notes, and community links.",
        ],
        links: [
          { href: "/usfans-spreadsheet", label: "USFans spreadsheet" },
          { href: "/gtbuy-spreadsheet", label: "GTBuy spreadsheet" },
          { href: "/oopbuy-spreadsheet", label: "OopBuy spreadsheet" },
          { href: "/boonbuy-spreadsheet", label: "BoonBuy spreadsheet" },
          { href: "/hipobuy-spreadsheet", label: "HipoBuy spreadsheet" },
          { href: "/kakobuy-spreadsheet", label: "Kakobuy spreadsheet" },
          { href: "/litbuy-spreadsheet", label: "LitBuy spreadsheet" },
        ],
      },
    ],
    relatedLinks: [
      ...SPREADSHEETS,
      { href: "/best-rep-spreadsheets", label: "Best rep spreadsheets" },
      { href: "/sneaker-finds", label: "Sneaker finds" },
      { href: "/clothing-finds", label: "Clothing finds" },
      { href: "/latest-finds", label: "Latest finds" },
      { href: "/litbuy-discord", label: "LitBuy Discord" },
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
      { href: "/finds", label: "Finds hub" },
      { href: "/litbuy-spreadsheet", label: "LitBuy spreadsheet" },
      { href: "/latest-finds", label: "Latest finds" },
      { href: "/sneaker-finds", label: "Sneaker finds" },
      { href: "/clothing-finds", label: "Clothing finds" },
      { href: "/litbuy-coupons", label: "LitBuy coupons" },
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

  "latest-finds": {
    slug: "latest-finds",
    type: "freshness",
    freshnessDisplay: "latestFinds",
    title: "Latest LitBuy Finds | 2026 Spreadsheet Products & QC Photos",
    description:
      "Latest LitBuy finds updated weekly — new rep sneakers, clothing, streetwear, and QC-linked products from the LitBuy spreadsheet catalog with verified agent buy buttons.",
    h1: "Latest LitBuy finds",
    intro:
      `Latest LitBuy finds are the newest rows in the LitBuy Finds product database — ${FINDS_STATS.totalFindsLabel}+ LitBuy finds (${FINDS_STATS.qcFindsLabel} with QC photos) updated from the LitBuy Spreadsheet. Browse new LitBuy rep finds with photos, prices, QC references, and trusted agent links after each sync.`,
    badge: "Discovery hub",
    keywords: [
      "litbuy finds",
      "litbuy find",
      "lit buy finds",
      "latest litbuy finds",
      "litbuy spreadsheet finds",
      "litbuy rep finds",
      "litbuy qc finds",
      "litbuy products",
      "rep finds",
      "qc finds",
      "latest rep finds",
    ],
    updateFrequency: "daily",
    filter: { freshness: "latestFinds" },
    productLimit: 24,
    sections: [
      {
        heading: "What this discovery hub includes",
        paragraphs: [
          `The LitBuy Finds database currently indexes ${FINDS_STATS.totalFindsLabel} products with ${FINDS_STATS.qcFindsLabel} QC-linked listings across ${FINDS_STATS.brandCount} brands. Latest finds are the newest rows after each spreadsheet sync — sneakers, hoodies, jackets, streetwear, bags, and accessories with shareable product URLs.`,
          "Each product page connects back to brand hubs, category databases, and the LitBuy spreadsheet resource so you can move from a single find to a full haul shortlist without losing context.",
        ],
        links: [
          { href: "/finds", label: "Finds hub" },
          { href: "/litbuy-spreadsheet", label: "LitBuy Spreadsheet" },
          { href: "/litbuy-qc", label: "QC finds database" },
          { href: "/rep-finds", label: "Rep finds" },
          { href: "/categories", label: "Category database" },
        ],
      },
      {
        heading: "Browse by category from latest finds",
        paragraphs: [
          "New drops span sneakers, clothing, streetwear, and outerwear. Use category find pages when you want the full database for one lane — not just today's additions.",
        ],
        links: [
          { href: "/sneaker-finds", label: "Sneaker finds" },
          { href: "/clothing-finds", label: "Clothing finds" },
          { href: "/streetwear-finds", label: "Streetwear finds" },
          { href: "/hoodie-finds", label: "Hoodie finds" },
          { href: "/jacket-finds", label: "Jacket finds" },
          { href: "/best-rep-finds", label: "Best rep finds" },
        ],
      },
      {
        heading: "Spreadsheet connection",
        paragraphs: [
          "Community LitBuy spreadsheets remain the source universe for many buyers. LitBuy Finds imports those rows daily, filters broken images, and publishes proper landing pages with QC badges, prices, and multi-agent checkout — start here for new products, then use the spreadsheet guide for bulk reference.",
        ],
        links: [
          { href: "/litbuy-spreadsheet", label: "LitBuy spreadsheet guide" },
          { href: "/recently-added", label: "Recently added" },
          { href: "/trending-today", label: "Trending today" },
        ],
      },
      {
        heading: "QC database and rep find verification",
        paragraphs: [
          `Each latest find links to a full product page with QC badges when reference photos exist. The LitBuy QC database indexes ${FINDS_STATS.qcFindsLabel} listings — use it to compare batches, verify materials, and shortlist rep finds before opening your agent checkout.`,
          "Latest Finds is the front door for new spreadsheet imports. The QC database and category pages are where you dig deeper once something catches your eye.",
        ],
        links: [
          { href: "/litbuy-qc", label: "QC product database" },
          { href: "/what-are-qc-photos", label: "What are QC photos" },
          { href: "/collections/best-qc-approved-finds", label: "QC-approved collection" },
          { href: "/guides/how-to-check-qc-photos", label: "How to check QC photos" },
        ],
      },
    ],
    relatedLinks: [
      { href: "/finds", label: "Finds hub" },
      { href: "/litbuy-finds", label: "LitBuy finds catalog" },
      { href: "/litbuy-spreadsheet", label: "LitBuy Spreadsheet" },
      { href: "/rep-finds", label: "Rep finds" },
      { href: "/best-litbuy-finds", label: "Best LitBuy finds" },
      { href: "/sneaker-finds", label: "Sneaker finds" },
      { href: "/clothing-finds", label: "Clothing finds" },
      { href: "/streetwear-finds", label: "Streetwear finds" },
      { href: "/best-rep-finds", label: "Best rep finds" },
      { href: "/litbuy-qc", label: "QC finds database" },
      { href: "/brands", label: "Brand finds" },
      { href: "/categories", label: "Categories" },
      { href: "/telegram-usfans", label: "USFans Telegram" },
      { href: "/telegram-oopbuy", label: "OopBuy Telegram" },
      { href: "/telegram-gtbuy", label: "GTBuy Telegram" },
      { href: "/telegram-boonbuy", label: "BoonBuy Telegram" },
      { href: "/telegram-hipobuy", label: "HipoBuy Telegram" },
      { href: "/telegram-kakobuy", label: "Kakobuy Telegram" },
      ...HUB.slice(0, 2),
    ],
    faqs: [
      {
        question: "What are latest LitBuy finds?",
        answer:
          "Latest finds are the newest products added to the LitBuy Finds catalog after each daily spreadsheet sync — LitBuy rep finds, clothing, streetwear, and accessories with photos, prices, and agent links. People also search litbuy find or lit buy finds for this database.",
      },
      {
        question: "How is Latest Finds different from LitBuy Finds or the Spreadsheet?",
        answer:
          "Latest Finds shows newest imports only. /litbuy-finds is the branded catalog landing. /litbuy-spreadsheet is the spreadsheet authority guide. /rep-finds maps all rep find lanes.",
      },
      {
        question: "How often are LitBuy finds updated?",
        answer: `The catalog syncs daily. This page and the ${FINDS_STATS.totalFindsLabel}-product database refresh after each import — check the homepage sync timestamp for the exact time.`,
      },
      {
        question: "Are these the same as LitBuy spreadsheet rows?",
        answer:
          "They come from the same LitBuy Spreadsheet / LitBuy finds spreadsheet / lit buy spreadsheet universe. LitBuy Finds filters broken listings, adds QC badges, and creates shareable product pages with verified buy buttons.",
      },
      {
        question: "Where do I browse LitBuy QC finds?",
        answer: `Open any product with a QC badge or visit the QC finds database — ${FINDS_STATS.qcFindsLabel} listings currently include QC reference links.`,
      },
      {
        question: "Where is the main LitBuy Spreadsheet guide?",
        answer:
          "Open the LitBuy Spreadsheet page for categories, QC spreadsheet context, and agent compatibility — then return here for the newest imports.",
      },
      {
        question: "How do I search older finds?",
        answer:
          "Use the Finds hub, LitBuy finds catalog, category pages like sneaker finds or clothing finds, and brand hubs. Latest finds only shows the newest additions — the full database is always searchable.",
      },
    ],
    productSectionTitle: "Newest LitBuy finds",
  },

  "nike-finds": {
    slug: "nike-finds",
    type: "collection",
    title: "Nike Finds | Best Nike Rep Products with QC Photos",
    description:
      "Find the best Nike rep products with QC photos, prices, and agent links — Dunks, Air Force, Tech Fleece, and more on LitBuy Finds.",
    h1: "Nike finds",
    intro:
      "Find the best Nike rep products with QC photos, prices, and agent links. Browse Dunks, Air Force 1, Travis Scott collabs, and Tech Fleece from verified Weidian and Taobao listings.",
    badge: "Nike finds",
    keywords: ["nike finds", "nike rep finds", "nike litbuy"],
    updateFrequency: "weekly",
    getProducts: TOP_LISTS["top-nike-finds"].getProducts,
    brandLinks: ["nike"],
    categoryLinks: ["shoes"],
    relatedLinks: [
      { href: "/best-sneaker-finds", label: "Best sneaker finds" },
      { href: "/best-nike-finds", label: "Best Nike finds" },
      { href: "/nike-spreadsheet", label: "Nike spreadsheet" },
      { href: "/sneaker-finds", label: "Sneaker finds" },
      { href: "/finds", label: "Finds hub" },
      { href: "/guides/best-nike-finds", label: "Nike buying guide" },
    ],
    sections: [
      {
        heading: "Popular Nike silhouettes",
        paragraphs: [
          "Dunks and Air Force 1 lead daily clicks. Travis Scott collabs and Tech Fleece sets are strong seasonal picks. Use the Nike brand hub for the full inventory when you know the exact model.",
        ],
        links: [
          { href: "/brands/nike", label: "Nike brand hub" },
          { href: "/jordan-finds", label: "Jordan finds" },
          { href: "/how-to-buy-reps", label: "How to buy reps" },
        ],
      },
      {
        heading: "Nike spreadsheet and QC",
        paragraphs: [
          "Nike rows in LitBuy spreadsheets become searchable Nike find pages here. Check QC badges for toe box, swoosh placement, and midsole shape before warehouse approval.",
        ],
        links: [
          { href: "/nike-spreadsheet", label: "Nike spreadsheet" },
          { href: "/litbuy-spreadsheet", label: "LitBuy spreadsheet" },
          { href: "/litbuy-qc", label: "QC database" },
          { href: "/latest-finds", label: "Latest finds" },
        ],
      },
      {
        heading: "Browse Nike by category",
        paragraphs: [
          "Most Nike finds land in sneakers, with Tech Fleece and ACG pieces in clothing and outerwear. Use sneaker finds for footwear-focused browsing and clothing finds for layers.",
        ],
        links: [
          { href: "/sneaker-finds", label: "Sneaker finds" },
          { href: "/clothing-finds", label: "Clothing finds" },
          { href: "/categories/shoes", label: "Shoes category" },
        ],
      },
    ],
    faqs: [
      {
        question: "How do I find Nike batches with QC?",
        answer:
          "Filter Nike finds with QC badges on product pages, or browse the QC-approved collection for reference photos.",
      },
      {
        question: "Are Nike finds the same as spreadsheet rows?",
        answer:
          "Yes — LitBuy Finds indexes Nike spreadsheet rows into searchable product pages with photos, prices, and agent buy buttons.",
      },
      {
        question: "What are the most popular Nike silhouettes?",
        answer:
          "Dunks, Air Force 1, Travis Scott collabs, and Tech Fleece lead searches. Open the Nike brand hub for the full catalog.",
      },
    ],
    productSectionTitle: "Top Nike picks",
  },

  "jordan-finds": {
    slug: "jordan-finds",
    type: "collection",
    title: "Jordan Finds | Best Jordan Rep Sneakers & QC Photos",
    description:
      "Find the best Jordan rep sneakers with QC photos, prices, and agent links — retros, collabs, and grails on LitBuy Finds.",
    h1: "Jordan finds",
    intro:
      "Find the best Jordan rep products with QC photos, prices, and agent links. Browse Jordan 1, Jordan 4, and retro collabs from verified marketplace listings.",
    badge: "Jordan finds",
    keywords: ["jordan finds", "jordan rep finds", "air jordan finds"],
    updateFrequency: "weekly",
    getProducts: TOP_LISTS["best-jordan-finds-2026"].getProducts,
    brandLinks: ["jordan", "nike"],
    categoryLinks: ["shoes"],
    relatedLinks: [
      { href: "/best-sneaker-finds", label: "Best sneaker finds" },
      { href: "/best-jordan-finds", label: "Best Jordan finds" },
      { href: "/nike-finds", label: "Nike finds" },
      { href: "/sneaker-finds", label: "Sneaker finds" },
      { href: "/finds", label: "Finds hub" },
      { href: "/guides/best-jordan-finds", label: "Jordan buying guide" },
    ],
    sections: [
      {
        heading: "Jordan silhouettes to browse",
        paragraphs: [
          "Jordan 1 and Jordan 4 retros dominate search volume. Collab colorways often have the most QC threads — compare reference photos before warehouse approval.",
        ],
        links: [
          { href: "/brands/jordan", label: "Jordan brand hub" },
          { href: "/what-are-qc-photos", label: "What are QC photos" },
        ],
      },
      {
        heading: "Jordan spreadsheet and QC tips",
        paragraphs: [
          "Jordan rows from LitBuy spreadsheets map to this finds page. Check wings logo, hourglass shape on Jordan 1 highs, and sole shape in warehouse QC before shipping.",
        ],
        links: [
          { href: "/jordan-spreadsheet", label: "Jordan spreadsheet" },
          { href: "/litbuy-spreadsheet", label: "LitBuy spreadsheet" },
          { href: "/litbuy-qc", label: "QC database" },
          { href: "/sneaker-finds", label: "Sneaker finds" },
        ],
      },
    ],
    faqs: [
      {
        question: "Are Jordan and Nike finds separate?",
        answer:
          "Jordan is a Nike sub-brand in the catalog — browse both brand pages when hunting specific silhouettes.",
      },
      {
        question: "How do Jordan finds relate to spreadsheets?",
        answer:
          "Community LitBuy spreadsheet rows for Jordan become searchable product pages here with QC badges and verified agent links.",
      },
      {
        question: "What should I check in Jordan QC?",
        answer:
          "Wings logo embossing, hourglass silhouette on Jordan 1 highs, toe box shape, and sole shape. Compare to reference QC on the product page.",
      },
    ],
    productSectionTitle: "Top Jordan picks",
  },

  "stussy-finds": {
    slug: "stussy-finds",
    type: "collection",
    title: "Stussy Finds | Streetwear Reps with QC Photos",
    description:
      "Find the best Stussy rep products with QC photos, prices, and agent links — hoodies, tees, and streetwear on LitBuy Finds.",
    h1: "Stussy finds",
    intro:
      "Find the best Stussy rep products with QC photos, prices, and agent links. UK streetwear staples with verified buy buttons and daily catalog updates.",
    badge: "Stussy finds",
    keywords: ["stussy finds", "stussy rep", "stussy litbuy"],
    updateFrequency: "weekly",
    filter: { keywords: ["stussy"] },
    brandLinks: ["stussy"],
    relatedLinks: [
      { href: "/best-clothing-finds", label: "Best clothing finds" },
      { href: "/best-stussy-finds", label: "Best Stussy finds" },
      { href: "/streetwear-finds", label: "Streetwear finds" },
      { href: "/hoodie-finds", label: "Hoodie finds" },
      { href: "/finds", label: "Finds hub" },
      { href: "/guides/best-streetwear-finds", label: "Streetwear guide" },
    ],
    sections: [
      {
        heading: "Stussy buying tips",
        paragraphs: [
          "Hoodies and graphic tees are the most ordered Stussy categories. Check embroidery and tag photos on warehouse QC — streetwear batches vary on logo size and placement.",
        ],
        links: [
          { href: "/brands/stussy", label: "Stussy brand hub" },
          { href: "/how-to-buy-reps", label: "How to buy reps" },
        ],
      },
    ],
    faqs: [
      {
        question: "What Stussy items are most popular?",
        answer:
          "Hoodies and graphic tees lead search volume — check QC references before shipping.",
      },
    ],
    productSectionTitle: "Top Stussy picks",
  },

  "moncler-finds": {
    slug: "moncler-finds",
    type: "collection",
    title: "Moncler Finds | Puffer Jackets & QC Photos",
    description:
      "Find the best Moncler rep jackets with QC photos, prices, and agent links — puffers, vests, and outerwear on LitBuy Finds.",
    h1: "Moncler finds",
    intro:
      "Find the best Moncler rep products with QC photos, prices, and agent links. Puffer jackets and vests with reference QC where available — always request warehouse QC before shipping.",
    badge: "Moncler finds",
    keywords: ["moncler finds", "moncler rep", "moncler jacket finds"],
    updateFrequency: "weekly",
    filter: { keywords: ["moncler"] },
    brandLinks: ["moncler"],
    categoryLinks: ["coats-and-jackets"],
    relatedLinks: [
      { href: "/best-designer-finds", label: "Best designer finds" },
      { href: "/collections/best-moncler-finds", label: "Moncler collection" },
      { href: "/jacket-finds", label: "Jacket finds" },
      { href: "/finds", label: "Finds hub" },
      { href: "/guides/best-moncler-finds", label: "Moncler guide" },
    ],
    sections: [
      {
        heading: "Moncler QC checklist",
        paragraphs: [
          "Puffer shape, badge alignment, and zipper hardware are the usual QC focus points. Compare reference QC on the product page with warehouse photos before approving international freight.",
        ],
        links: [
          { href: "/what-are-qc-photos", label: "What are QC photos" },
          { href: "/guides/qc-checklist-for-clothing", label: "Clothing QC checklist" },
        ],
      },
    ],
    faqs: [
      {
        question: "Should I QC Moncler jackets?",
        answer:
          "Yes. Outerwear batches vary — use reference QC and warehouse photos before approving shipment.",
      },
    ],
    productSectionTitle: "Top Moncler picks",
  },

  "chrome-hearts-finds": {
    slug: "chrome-hearts-finds",
    type: "collection",
    title: "Chrome Hearts Finds | Jewelry & Streetwear Reps",
    description:
      "Find Chrome Hearts rep products with QC photos, prices, and agent links — jewelry, hoodies, and accessories on LitBuy Finds.",
    h1: "Chrome Hearts finds",
    intro:
      "Find the best Chrome Hearts rep products with QC photos, prices, and agent links. Jewelry, hoodies, and cross-style accessories from verified listings.",
    badge: "Chrome Hearts finds",
    keywords: ["chrome hearts finds", "chrome hearts rep"],
    updateFrequency: "weekly",
    filter: { keywords: ["chrome hearts", "chrome"] },
    brandLinks: ["chrome-hearts"],
    relatedLinks: [
      { href: "/best-designer-finds", label: "Best designer finds" },
      { href: "/streetwear-finds", label: "Streetwear finds" },
      { href: "/categories/accessories", label: "Accessories" },
      { href: "/finds", label: "Finds hub" },
      { href: "/guides/best-chrome-hearts-finds", label: "Chrome Hearts guide" },
    ],
    sections: [
      {
        heading: "Chrome Hearts categories",
        paragraphs: [
          "Jewelry, hoodies, and cross-motif accessories each have different batch quality. Rings and pendants benefit most from macro QC shots — request close-ups on LitBuy if details matter.",
        ],
        links: [
          { href: "/brands/chrome-hearts", label: "Chrome Hearts brand hub" },
          { href: "/litbuy-qc-photos", label: "LitBuy QC photos" },
        ],
      },
    ],
    faqs: [
      {
        question: "What Chrome Hearts items have QC?",
        answer:
          "Rings, pendants, and hoodies with community QC threads appear most often — check each product page.",
      },
    ],
    productSectionTitle: "Top Chrome Hearts picks",
  },

  "prada-finds": {
    slug: "prada-finds",
    type: "collection",
    title: "Prada Finds | Bags, Clothing & QC Photos",
    description:
      "Find the best Prada rep products with QC photos, prices, and agent links — bags, tees, and accessories on LitBuy Finds.",
    h1: "Prada finds",
    intro:
      "Find the best Prada rep products with QC photos, prices, and agent links. Bags, nylon accessories, and clothing from verified Weidian and Taobao sellers.",
    badge: "Prada finds",
    keywords: ["prada finds", "prada rep", "prada bag finds"],
    updateFrequency: "weekly",
    filter: { keywords: ["prada"] },
    brandLinks: ["prada"],
    relatedLinks: [
      { href: "/bag-finds", label: "Bag finds" },
      { href: "/best-rep-finds", label: "Designer finds" },
      { href: "/finds", label: "Finds hub" },
    ],
    faqs: [
      {
        question: "Are Prada bags worth QC?",
        answer:
          "Yes — verify hardware, lining, and logo placement on warehouse QC before shipping.",
      },
    ],
    productSectionTitle: "Top Prada picks",
  },

  "stone-island-finds": {
    slug: "stone-island-finds",
    type: "collection",
    title: "Stone Island Finds | Jackets & QC Photos",
    description:
      "Find Stone Island rep products with QC photos, prices, and agent links — badges, jackets, and knitwear on LitBuy Finds.",
    h1: "Stone Island finds",
    intro:
      "Find the best Stone Island rep products with QC photos, prices, and agent links. Compass-badge jackets and knitwear from verified marketplace listings.",
    badge: "Stone Island finds",
    keywords: ["stone island finds", "stone island rep"],
    updateFrequency: "weekly",
    filter: { keywords: ["stone island"] },
    brandLinks: ["stone-island"],
    categoryLinks: ["coats-and-jackets"],
    relatedLinks: [
      { href: "/best-designer-finds", label: "Best designer finds" },
      { href: "/jacket-finds", label: "Jacket finds" },
      { href: "/brands/stone-island", label: "Stone Island brand hub" },
      { href: "/finds", label: "Finds hub" },
    ],
    sections: [
      {
        heading: "Stone Island badge QC",
        paragraphs: [
          "Compass badge placement and arm patch stitching separate good batches from bad ones. Use reference QC on LitBuy Finds, then verify your exact jacket on warehouse photos.",
        ],
        links: [
          { href: "/what-are-qc-photos", label: "What are QC photos" },
          { href: "/moncler-finds", label: "Moncler finds" },
        ],
      },
    ],
    faqs: [
      {
        question: "What should I check on Stone Island QC?",
        answer:
          "Badge placement, arm patch quality, and zipper hardware — compare reference QC on the product page.",
      },
    ],
    productSectionTitle: "Top Stone Island picks",
  },

  "canada-goose-finds": {
    slug: "canada-goose-finds",
    type: "collection",
    title: "Canada Goose Finds | Parkas & QC Photos",
    description:
      "Find Canada Goose rep parkas with QC photos, prices, and agent links — winter outerwear on LitBuy Finds.",
    h1: "Canada Goose finds",
    intro:
      "Find the best Canada Goose rep products with QC photos, prices, and agent links. Parkas and winter jackets — always compare batch QC before international shipping.",
    badge: "Canada Goose finds",
    keywords: ["canada goose finds", "canada goose rep", "goose jacket finds"],
    updateFrequency: "weekly",
    filter: { keywords: ["canada goose", "goose"] },
    relatedLinks: [
      { href: "/jacket-finds", label: "Jacket finds" },
      { href: "/moncler-finds", label: "Moncler finds" },
      { href: "/finds", label: "Finds hub" },
    ],
    faqs: [
      {
        question: "Are Canada Goose reps heavy to ship?",
        answer:
          "Yes — parkas add weight. Consider rehearsal packing and consolidate with lighter items.",
      },
    ],
    productSectionTitle: "Top Canada Goose picks",
  },
};
