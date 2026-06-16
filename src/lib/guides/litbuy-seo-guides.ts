import { buildGuide } from "./build";
import { CORE_LINKS } from "./shared";
import type { GuidePage } from "./types";

export const LITBUY_SEO_GUIDES: Record<string, GuidePage> = {
  "litbuy-spreadsheet": buildGuide("litbuy-spreadsheet", "beginner", {
    title: "LitBuy Spreadsheet Guide – Browse Finds Without the Chaos",
    metaDescription:
      "How LitBuy spreadsheets work, why curated catalogs are easier to browse, and how to use LitBuy Finds as a searchable alternative to raw agent sheets.",
    badge: "LitBuy guide",
    h1: "LitBuy spreadsheet guide",
    intro:
      "Spreadsheets are how many buyers first discover LitBuy finds — rows of links, prices, and QC notes. LitBuy Finds turns that same data into searchable pages with photos, categories, and verified agent links.",
    cardDescription:
      "Understand LitBuy spreadsheets and browse finds the easier way.",
    sections: [
      {
        heading: "What a LitBuy spreadsheet usually contains",
        paragraphs: [
          "Most sheets list product names, thumbnail images, CNY or USD prices, seller links, and sometimes QC photo references. They are great for power users but hard to search on mobile.",
          "LitBuy Finds imports and normalizes catalog data so you can filter by brand, category, or keyword instead of scrolling thousands of rows.",
        ],
        links: [
          { href: "/guides/litbuy-finds", label: "LitBuy finds guide" },
          { href: "/collections/best-qc-approved-finds", label: "QC-approved finds" },
        ],
      },
      {
        heading: "LitBuy Finds vs a raw spreadsheet",
        paragraphs: [
          "You get product pages with QC badges, related finds, and one-click agent links. The catalog updates daily when the underlying sheet changes.",
          "Use spreadsheets when you want the raw source. Use LitBuy Finds when you want discovery, filters, and shareable collection pages.",
        ],
        links: [
          { href: "/top-litbuy-finds-this-month", label: "Top finds this month" },
          { href: "/guides/litbuy-shopping-agent", label: "LitBuy shopping agent" },
        ],
      },
    ],
    faqs: [
      {
        question: "Is LitBuy Finds the same as a LitBuy spreadsheet?",
        answer:
          "They share the same product universe. LitBuy Finds is a curated discovery site built on catalog data — not a replacement for your LitBuy account or checkout.",
      },
      {
        question: "Can I still use spreadsheet links?",
        answer:
          "Yes. Many finds here map to the same agent listings. Always confirm price and batch on LitBuy before you pay.",
      },
      {
        question: "How often is the catalog updated?",
        answer:
          "The dataset syncs daily. New finds appear in Recently Added and collection pages within the same sync cycle.",
      },
    ],
    relatedLinks: [
      { href: "/guides/litbuy-finds", label: "LitBuy finds" },
      { href: "/collections/best-budget-finds", label: "Budget finds" },
      ...CORE_LINKS,
    ],
  }),

  "litbuy-finds": buildGuide("litbuy-finds", "beginner", {
    title: "LitBuy Finds – Curated Catalog for QC-Approved Products",
    metaDescription:
      "What LitBuy Finds is, how to search 10,000+ curated finds, and how to open verified LitBuy links for sneakers, jackets, bags, and streetwear.",
    badge: "LitBuy guide",
    h1: "LitBuy finds",
    intro:
      "LitBuy Finds is a discovery catalog for fashion and sneaker finds linked to LitBuy. Browse by brand or category, check QC references, and open verified buy links when you are ready to order.",
    cardDescription: "How to use the LitBuy Finds catalog.",
    sections: [
      {
        heading: "What you can do here",
        paragraphs: [
          "Search Nike, Jordan, Moncler, and more. Filter by category, save favorites, and open product pages with QC status and seller source.",
          "Every listing is designed to get you to a verified LitBuy product page — not a random marketplace URL.",
        ],
        links: [
          { href: "/brands", label: "Browse brands" },
          { href: "/categories", label: "Browse categories" },
        ],
      },
      {
        heading: "From find to haul",
        paragraphs: [
          "Pick a product, register on LitBuy if you have not already, open the buy link, request QC at the warehouse, and add items to your haul before shipping.",
        ],
        links: [
          { href: "/guides/litbuy-qc-photos", label: "LitBuy QC photos" },
          { href: "/how-to-buy", label: "How to buy" },
        ],
      },
    ],
    faqs: [
      {
        question: "Is LitBuy Finds free to use?",
        answer: "Yes. Browsing is free. You only pay when you purchase through LitBuy.",
      },
      {
        question: "How many finds are in the catalog?",
        answer:
          "The public catalog highlights 10,000+ curated finds across sneakers, clothing, bags, and accessories with daily updates.",
      },
    ],
    relatedLinks: [
      { href: "/guides/litbuy-spreadsheet", label: "Spreadsheet guide" },
      { href: "/most-popular-finds-now", label: "Popular today" },
      ...CORE_LINKS,
    ],
  }),

  "litbuy-qc-photos": buildGuide("litbuy-qc-photos", "qc", {
    title: "LitBuy QC Photos – How to Check Quality Before You Ship",
    metaDescription:
      "How LitBuy QC photos work, where to find QC references on finds, and what to check before approving warehouse items.",
    badge: "QC guide",
    h1: "LitBuy QC photos",
    intro:
      "QC (quality control) photos are warehouse pictures of your exact item before international shipping. LitBuy Finds links to QC references where available and helps you know what to check.",
    cardDescription: "QC workflow for LitBuy buyers.",
    sections: [
      {
        heading: "Reference QC vs warehouse QC",
        paragraphs: [
          "Find pages may link to reference QC from other buyers or batches. Warehouse QC is photos of your paid item — that is what you approve before shipping.",
        ],
        links: [
          { href: "/guides/how-to-check-qc-photos", label: "How to check QC" },
          { href: "/collections/best-qc-approved-finds", label: "QC finds" },
        ],
      },
    ],
    faqs: [
      {
        question: "Do all finds have QC photos?",
        answer:
          "Not every listing has a reference link, but many popular finds do. Register on LitBuy to request warehouse QC on items you purchase.",
      },
    ],
    relatedLinks: [
      { href: "/guides/litbuy-finds", label: "LitBuy finds" },
      { href: "/best-qc-approved-finds", label: "Best QC finds" },
      ...CORE_LINKS,
    ],
  }),

  "litbuy-shopping-agent": buildGuide("litbuy-shopping-agent", "beginner", {
    title: "LitBuy Shopping Agent – How Ordering Works",
    metaDescription:
      "LitBuy as a shopping agent explained — buying from Weidian and Taobao, warehouse storage, QC, and international shipping.",
    badge: "LitBuy guide",
    h1: "LitBuy shopping agent",
    intro:
      "LitBuy is a shopping agent that purchases from Chinese marketplaces on your behalf, stores items at a warehouse, and ships internationally when you are ready.",
    cardDescription: "Agent basics for new LitBuy users.",
    sections: [
      {
        heading: "Why use LitBuy",
        paragraphs: [
          "Marketplaces often require local payment and addresses. LitBuy handles purchase, optional QC, consolidation, and freight lines to your country.",
        ],
        links: [
          { href: "/guides/what-is-litbuy", label: "What is LitBuy?" },
          { href: "/guides/how-to-order-from-litbuy", label: "How to order" },
        ],
      },
    ],
    faqs: [
      {
        question: "Is LitBuy Finds the same company as LitBuy?",
        answer:
          "LitBuy Finds is a discovery site. Checkout and support happen on LitBuy.com through your agent account.",
      },
    ],
    relatedLinks: [
      { href: "/guides/litbuy-weidian-finds", label: "Weidian finds" },
      { href: "/guides/litbuy-taobao-finds", label: "Taobao finds" },
      ...CORE_LINKS,
    ],
  }),

  "litbuy-weidian-finds": buildGuide("litbuy-weidian-finds", "buying", {
    title: "LitBuy Weidian Finds – How to Buy from Weidian",
    metaDescription:
      "Find and buy Weidian products through LitBuy — search curated finds, verify links, and understand Weidian seller listings.",
    badge: "Marketplace guide",
    h1: "LitBuy Weidian finds",
    intro:
      "Weidian is a major source for streetwear and sneaker finds. LitBuy Finds surfaces Weidian-linked products with photos and agent buy buttons.",
    cardDescription: "Weidian buying through LitBuy.",
    sections: [
      {
        heading: "Browsing Weidian finds",
        paragraphs: [
          "Use brand and category filters or search by keyword. Product pages show the source marketplace when available.",
        ],
        links: [
          { href: "/guides/how-to-buy-from-weidian", label: "Weidian how-to" },
          { href: "/trending", label: "Trending finds" },
        ],
      },
    ],
    faqs: [
      {
        question: "Are all finds from Weidian?",
        answer:
          "The catalog mixes Weidian, Taobao, and other sources. Each product page indicates the listing source.",
      },
    ],
    relatedLinks: [
      { href: "/guides/litbuy-taobao-finds", label: "Taobao finds" },
      { href: "/collections/best-sneakers", label: "Best sneakers" },
      ...CORE_LINKS,
    ],
  }),

  "litbuy-taobao-finds": buildGuide("litbuy-taobao-finds", "buying", {
    title: "LitBuy Taobao Finds – Curated Taobao Products",
    metaDescription:
      "Discover Taobao fashion and sneaker finds on LitBuy Finds with verified agent links and QC references.",
    badge: "Marketplace guide",
    h1: "LitBuy Taobao finds",
    intro:
      "Taobao listings cover a huge range of fashion finds. LitBuy Finds curates searchable Taobao-linked products so you can discover before opening LitBuy.",
    cardDescription: "Taobao finds through LitBuy.",
    sections: [
      {
        heading: "Finding Taobao products",
        paragraphs: [
          "Search by brand or browse categories like shoes and outerwear. Confirm sizing and live price on LitBuy before checkout.",
        ],
        links: [
          { href: "/guides/how-to-buy-from-taobao", label: "Taobao how-to" },
          { href: "/categories/shoes", label: "Shoes category" },
        ],
      },
    ],
    faqs: [
      {
        question: "Taobao vs Weidian — which is better?",
        answer:
          "Both work through LitBuy. Use whichever listing has the item, price, and QC references you trust.",
      },
    ],
    relatedLinks: [
      { href: "/guides/litbuy-weidian-finds", label: "Weidian finds" },
      { href: "/collections/best-jackets", label: "Best jackets" },
      ...CORE_LINKS,
    ],
  }),
};
