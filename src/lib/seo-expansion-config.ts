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
      { href: "/finds", label: "Finds hub" },
      { href: "/best-rep-finds", label: "Best rep finds" },
      { href: "/top-designer-bags", label: "Designer bags list" },
      { href: "/guides/best-moncler-finds", label: "Moncler guide" },
      { href: "/guides/best-prada-finds", label: "Prada guide" },
    ],
    faqs: [
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
    ],
    relatedLinks: [
      { href: "/best-clothing-finds", label: "Best clothing finds" },
      { href: "/latest-finds", label: "Latest finds" },
      { href: "/litbuy-discord", label: "LitBuy Discord" },
      { href: "/litbuy-spreadsheet", label: "LitBuy spreadsheet" },
      { href: "/litbuy-coupons", label: "LitBuy coupons" },
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
      {
        question: "Which clothing types are most popular?",
        answer:
          "Hoodies, puffer jackets, and graphic tees lead search volume. Use hoodie-finds and jacket-finds for focused browsing.",
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
          "New hoodie batches appear in community spreadsheets daily. LitBuy Finds syncs those rows into searchable pages — check Latest Finds for fresh imports or join Discord for same-day alerts between syncs.",
        ],
        links: [
          { href: "/litbuy-spreadsheet", label: "LitBuy spreadsheet" },
          { href: "/latest-finds", label: "Latest finds" },
          { href: "/litbuy-discord", label: "LitBuy Discord" },
        ],
      },
    ],
    relatedLinks: [
      { href: "/clothing-finds", label: "Clothing finds" },
      { href: "/streetwear-finds", label: "Streetwear finds" },
      { href: "/latest-finds", label: "Latest finds" },
      { href: "/litbuy-spreadsheet", label: "LitBuy spreadsheet" },
      { href: "/litbuy-coupons", label: "LitBuy coupons" },
      { href: "/litbuy-discord", label: "LitBuy Discord" },
      ...HUB.filter((l) => !["/litbuy-finds"].includes(l.href)).slice(0, 3),
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
      { href: "/litbuy-coupons", label: "LitBuy coupons" },
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
      {
        heading: "Rep find categories",
        paragraphs: [
          "Sneakers, streetwear, designer outerwear, and bags each have dedicated find pages. Start here for editor-ranked picks, then drill into sneaker finds or clothing finds for full category browsing.",
        ],
        links: [
          { href: "/sneaker-finds", label: "Sneaker finds" },
          { href: "/clothing-finds", label: "Clothing finds" },
          { href: "/best-designer-finds", label: "Designer finds" },
          { href: "/latest-finds", label: "Latest finds" },
        ],
      },
    ],
    relatedLinks: [
      { href: "/finds", label: "Finds hub" },
      { href: "/latest-finds", label: "Latest finds" },
      { href: "/litbuy-spreadsheet", label: "LitBuy spreadsheet" },
      { href: "/litbuy-coupons", label: "LitBuy coupons" },
      { href: "/litbuy-discord", label: "LitBuy Discord" },
      { href: "/best-litbuy-finds", label: "Best LitBuy finds" },
      ...CATEGORIES.slice(0, 4),
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
      {
        question: "How often are rep finds updated?",
        answer:
          "The catalog syncs daily. Editor-ranked picks refresh weekly — check Latest Finds for brand-new imports.",
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
    title: "Latest Rep Finds 2026 | New QC Photos & Agent Links",
    description:
      "Latest rep finds added to LitBuy Finds — new sneakers, clothing, and accessories with QC photos, prices, and verified agent links updated daily.",
    h1: "Latest rep finds",
    intro:
      "Fresh catalog additions land here first after each daily sync. Browse the newest rep finds with photos, prices, and buy-ready agent links — new products added regularly from community spreadsheets.",
    badge: "Fresh finds",
    keywords: ["latest rep finds", "latest rep finds 2026", "new litbuy finds"],
    updateFrequency: "daily",
    filter: { freshness: "latestFinds" },
    productLimit: 48,
    sections: [
      {
        heading: "Freshness signals",
        paragraphs: [
          "The catalog syncs daily. This page highlights products added in the most recent import — check the timestamp on the Finds hub for the exact sync time.",
          "Pair latest finds with QC references when available, and join Discord for same-day drop alerts between syncs.",
        ],
        links: [
          { href: "/finds", label: "Finds hub" },
          { href: "/recently-added", label: "Recently added" },
          { href: "/litbuy-discord", label: "LitBuy Discord" },
        ],
      },
    ],
    relatedLinks: [
      { href: "/finds", label: "Finds hub" },
      { href: "/trending-today", label: "Daily finds" },
      { href: "/sneaker-finds", label: "Sneaker finds" },
      { href: "/litbuy-discord", label: "LitBuy Discord" },
      { href: "/litbuy-spreadsheet", label: "LitBuy spreadsheet" },
      { href: "/litbuy-qc", label: "QC photos" },
      ...HUB.slice(0, 3),
    ],
    faqs: [
      {
        question: "How often are latest finds updated?",
        answer:
          "The catalog syncs daily. New products appear on this page after each import completes — sorted newest first.",
      },
      {
        question: "Are these the same as spreadsheet rows?",
        answer:
          "They come from the same product universe — LitBuy Finds filters broken images and surfaces shareable product pages.",
      },
      {
        question: "Where do I find daily find alerts?",
        answer:
          "Join the LitBuy Discord for same-day alerts between syncs, or check Trending Today for engagement-weighted picks.",
      },
    ],
    productSectionTitle: "New finds today",
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
    ],
    faqs: [
      {
        question: "How do I find Nike batches with QC?",
        answer:
          "Filter Nike finds with QC badges on product pages, or browse the QC-approved collection for reference photos.",
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
    ],
    faqs: [
      {
        question: "Are Jordan and Nike finds separate?",
        answer:
          "Jordan is a Nike sub-brand in the catalog — browse both brand pages when hunting specific silhouettes.",
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
