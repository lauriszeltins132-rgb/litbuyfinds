import type { StaticPageSection } from "./static-pages";

export type GuidePage = {
  slug: string;
  path: string;
  title: string;
  metaDescription: string;
  badge: string;
  h1: string;
  intro: string;
  cardDescription: string;
  sections: StaticPageSection[];
  faqs?: { question: string; answer: string }[];
  relatedLinks?: { href: string; label: string }[];
};

const CORE_LINKS = [
  { href: "/guides", label: "All guides" },
  { href: "/trending", label: "Trending finds" },
  { href: "/recently-added", label: "Recently added" },
  { href: "/categories", label: "Browse categories" },
  { href: "/brands", label: "Browse brands" },
];

export const GUIDE_PAGES: Record<string, GuidePage> = {
  "what-is-a-shopping-agent": {
    slug: "what-is-a-shopping-agent",
    path: "/guides/what-is-a-shopping-agent",
    title: "What Is a Shopping Agent?",
    metaDescription:
      "A plain-English guide to shopping agents — what they do, why buyers use them, and how they connect you to Weidian, Taobao, and other marketplaces.",
    badge: "Beginner guide",
    h1: "What is a shopping agent?",
    intro:
      "A shopping agent is a service that buys items from Chinese marketplaces on your behalf, stores them in a warehouse, and ships them to your country. You pick the product. They handle payment, QC photos, and international shipping.",
    cardDescription:
      "Learn what agents do and why most overseas buyers use one.",
    sections: [
      {
        heading: "The short version",
        paragraphs: [
          "You cannot usually check out on Weidian or Taobao with a normal US or EU card. An agent acts as the middle layer: they purchase the item locally, receive it at their warehouse, take QC photos if you want them, and ship everything together when you are ready.",
        ],
      },
      {
        heading: "What agents actually do",
        paragraphs: [
          "Agents convert your payment, place the order with the seller, receive the parcel, and hold it until you submit a shipping request. Most agents also offer photo checks so you can approve quality before the item gets packed into a haul.",
          "LitBuy is one of these agents. LitBuy Finds is a discovery site that helps you browse products and open the correct LitBuy listing — we do not sell items ourselves.",
        ],
        links: [
          { href: "/guides/why-use-an-agent", label: "Why use an agent?" },
          { href: "/guides/how-litbuy-works", label: "How LitBuy works" },
        ],
      },
      {
        heading: "Common terms you will see",
        paragraphs: [
          "QC means quality check photos taken at the warehouse. A haul is a batch of items shipped together to save on international freight. W2C (want to cop) is buyer slang for an item someone wants to purchase.",
        ],
        links: [
          { href: "/guides/how-to-check-qc-photos", label: "How to check QC photos" },
          { href: "/guides/shipping-and-hauls", label: "Shipping and hauls" },
        ],
      },
    ],
    faqs: [
      {
        question: "Is a shopping agent the same as a reseller?",
        answer:
          "No. Agents buy the exact item you select and ship it to you. They are not curating inventory to mark up — their revenue is mostly service and shipping fees.",
      },
      {
        question: "Do I need an agent for every purchase?",
        answer:
          "If the seller is on a Chinese marketplace and you are buying from abroad, yes — you need an agent or a similar forwarding service.",
      },
    ],
    relatedLinks: CORE_LINKS,
  },

  "why-use-an-agent": {
    slug: "why-use-an-agent",
    path: "/guides/why-use-an-agent",
    title: "Why Use a Shopping Agent?",
    metaDescription:
      "Why buyers use shopping agents for Weidian and Taobao — payment, QC, warehouse storage, and cheaper consolidated shipping explained simply.",
    badge: "Beginner guide",
    h1: "Why use a shopping agent?",
    intro:
      "Agents exist because cross-border buying from Chinese marketplaces is awkward without local payment, a local address, and someone to inspect packages before they fly overseas.",
    cardDescription:
      "Payment, QC, storage, and shipping — the real reasons buyers use agents.",
    sections: [
      {
        heading: "You get a local buying address",
        paragraphs: [
          "Marketplace sellers ship domestically in China. Your agent provides a warehouse address so the seller can dispatch normally. Without that, most listings are not checkout-ready for international buyers.",
        ],
      },
      {
        heading: "QC before you ship",
        paragraphs: [
          "This is the main reason experienced buyers use agents. Warehouse staff photograph the item so you can catch wrong sizes, bad stitching, or obvious flaws before paying for international shipping.",
        ],
        links: [
          { href: "/guides/how-to-check-qc-photos", label: "How to check QC photos" },
          { href: "/qc", label: "QC finds on LitBuy Finds" },
        ],
      },
      {
        heading: "Bundle items into one haul",
        paragraphs: [
          "Shipping one pair of shoes alone is expensive. Agents let you store multiple purchases and ship them together, which usually lowers cost per item.",
        ],
        links: [{ href: "/guides/shipping-and-hauls", label: "Shipping and hauls guide" }],
      },
      {
        heading: "When an agent is not worth it",
        paragraphs: [
          "For a single very cheap item, fees and shipping can cost more than the product. Many buyers build a small cart first, then ship once the warehouse has a few pieces ready.",
        ],
        links: [{ href: "/deals", label: "Budget finds under $30" }],
      },
    ],
    faqs: [
      {
        question: "Are agents safe?",
        answer:
          "Established agents with clear QC workflows and tracking are widely used. Stick to known platforms, read recent reviews, and always check QC photos before shipping.",
      },
    ],
    relatedLinks: CORE_LINKS,
  },

  "how-litbuy-works": {
    slug: "how-litbuy-works",
    path: "/guides/how-litbuy-works",
    title: "How LitBuy Works",
    metaDescription:
      "How LitBuy works step by step — from finding a product on LitBuy Finds to warehouse QC, cart storage, and shipping your haul.",
    badge: "LitBuy guide",
    h1: "How LitBuy works",
    intro:
      "LitBuy is the buying agent behind most links on this site. Here is the full flow from browsing a find to receiving your package.",
    cardDescription:
      "The full LitBuy flow from browse to delivered haul.",
    sections: [
      {
        heading: "Step 1 — Find a product",
        paragraphs: [
          "Browse LitBuy Finds by category, brand, or collection. When something looks good, open the product page and click through to LitBuy.",
        ],
        links: [
          { href: "/trending", label: "Trending finds" },
          { href: "/recently-added", label: "Recently added" },
        ],
      },
      {
        heading: "Step 2 — Register or log in",
        paragraphs: [
          "New users can register on LitBuy to unlock shipping promotions. Returning users log in and paste or open the product link directly.",
        ],
        links: [{ href: "/guides/beginner-guide-to-litbuy", label: "Beginner guide to LitBuy" }],
      },
      {
        heading: "Step 3 — Buy and wait for warehouse arrival",
        paragraphs: [
          "LitBuy purchases the item from the seller. Domestic shipping in China usually takes a few days. You will get a notification when the item hits the warehouse.",
        ],
      },
      {
        heading: "Step 4 — Review QC photos",
        paragraphs: [
          "Request or review QC photos in your LitBuy dashboard. Approve the item or raise an issue before you add it to a shipment.",
        ],
        links: [{ href: "/guides/how-to-check-qc-photos", label: "QC photo guide" }],
      },
      {
        heading: "Step 5 — Ship your haul",
        paragraphs: [
          "Select the items you want, pick a shipping line for your country, and pay freight. Tracking updates until delivery.",
        ],
        links: [{ href: "/guides/shipping-and-hauls", label: "Shipping and hauls" }],
      },
    ],
    faqs: [
      {
        question: "Is LitBuy Finds the same as LitBuy?",
        answer:
          "No. LitBuy Finds is an independent discovery catalog. LitBuy is the agent where you actually purchase and ship items.",
      },
      {
        question: "Do I pay LitBuy Finds?",
        answer:
          "No. You pay LitBuy and the seller through LitBuy's checkout. We link you to the right listing.",
      },
    ],
    relatedLinks: CORE_LINKS,
  },

  "how-to-order": {
    slug: "how-to-order",
    path: "/guides/how-to-order",
    title: "How to Order from LitBuy",
    metaDescription:
      "Step-by-step guide to ordering from LitBuy — account setup, opening product links, paying, QC, and preparing your first shipment.",
    badge: "How to order",
    h1: "How to order from LitBuy",
    intro:
      "First order nerves are normal. The process is repetitive once you have done it once: find, buy, QC, ship.",
    cardDescription:
      "Your first order from browse to buy — step by step.",
    sections: [
      {
        heading: "Before you buy",
        paragraphs: [
          "Create a LitBuy account, add balance or link your payment method, and double-check sizing notes on the listing. Chinese sizing often runs smaller — read comments when available.",
        ],
        links: [{ href: "/guides/beginner-guide-to-litbuy", label: "Beginner guide" }],
      },
      {
        heading: "Open the product on LitBuy",
        paragraphs: [
          "From any LitBuy Finds product page, click Buy on LitBuy. The listing should open pre-filled. Confirm the color, size, and price match what you saw here.",
        ],
        links: [{ href: "/guides/how-to-find-products", label: "How to find products" }],
      },
      {
        heading: "Pay and track warehouse status",
        paragraphs: [
          "Complete payment on LitBuy. The item status will move from purchased to arrived at warehouse. Domestic transit is usually faster than international.",
        ],
      },
      {
        heading: "Approve QC, then ship",
        paragraphs: [
          "Do not rush international shipping. Review QC photos, then add approved items to a parcel and choose a shipping line.",
        ],
        links: [
          { href: "/guides/how-to-check-qc-photos", label: "Check QC photos" },
          { href: "/guides/shipping-and-hauls", label: "Shipping guide" },
        ],
      },
    ],
    faqs: [
      {
        question: "What if the seller ships the wrong item?",
        answer:
          "Raise a ticket with LitBuy support and include QC photos. This is why you inspect before shipping internationally.",
      },
      {
        question: "Can I cancel an order?",
        answer:
          "Cancellation depends on whether the agent has already purchased from the seller. Check LitBuy's policy in your order panel.",
      },
    ],
    relatedLinks: CORE_LINKS,
  },

  "how-to-check-qc-photos": {
    slug: "how-to-check-qc-photos",
    path: "/guides/how-to-check-qc-photos",
    title: "How to Check QC Photos",
    metaDescription:
      "How to review QC (quality check) photos before shipping — what to look for, common flaws, and when to accept or exchange an item.",
    badge: "QC guide",
    h1: "How to check QC photos",
    intro:
      "QC photos are warehouse pictures of your actual item. They are your last easy chance to catch problems before you pay international shipping.",
    cardDescription:
      "What QC means and what to look for before you ship.",
    sections: [
      {
        heading: "What QC means",
        paragraphs: [
          "QC stands for quality check. After the seller delivers to the agent warehouse, staff photograph the product — often multiple angles — so you can verify you got the right batch and spot obvious defects.",
        ],
      },
      {
        heading: "What to inspect",
        paragraphs: [
          "Check logo placement, stitching, color, sole shape, tags, and overall symmetry. Compare against reference photos from reviews or the listing. Zoom in — small flaws are easier to fix before shipping.",
        ],
        links: [{ href: "/qc", label: "Browse QC-ready finds" }],
      },
      {
        heading: "When to accept vs exchange",
        paragraphs: [
          "Minor glue marks might be acceptable depending on price. Wrong colorway, wrong size, or major shape issues are not. If something looks off, message support before submitting your haul.",
        ],
      },
      {
        heading: "QC links on LitBuy Finds",
        paragraphs: [
          "Some listings include a QC link on the product card. That usually points to community albums or reference shots. Warehouse QC is still the final check on your exact pair.",
        ],
        links: [{ href: "/trending", label: "Popular finds with QC" }],
      },
    ],
    faqs: [
      {
        question: "Are QC photos always available?",
        answer:
          "Not for every item. Request QC in your agent dashboard when supported. Listings marked QC available on LitBuy Finds have reference links in the source data.",
      },
      {
        question: "How long do I have to review QC?",
        answer:
          "Depends on the agent's storage policy. Review as soon as photos appear so your item does not sit past free storage limits.",
      },
    ],
    relatedLinks: CORE_LINKS,
  },

  "shipping-and-hauls": {
    slug: "shipping-and-hauls",
    path: "/guides/shipping-and-hauls",
    title: "Shipping and Hauls Explained",
    metaDescription:
      "How shipping lines, hauls, and warehouse storage work when buying through LitBuy — tips to save money and avoid surprises.",
    badge: "Shipping guide",
    h1: "Shipping and hauls",
    intro:
      "A haul is simply multiple warehouse items packed and shipped together. Most buyers intentionally wait until they have a few pieces ready to lower shipping cost per item.",
    cardDescription:
      "Hauls, shipping lines, and how to save on freight.",
    sections: [
      {
        heading: "Why hauls save money",
        paragraphs: [
          "International freight has a base cost. Shipping three items at once usually costs less per item than three separate parcels because you pay that base fee once.",
        ],
      },
      {
        heading: "Choosing a shipping line",
        paragraphs: [
          "Lines differ by speed, price, and customs risk depending on country. Read recent posts from buyers in your region — what works for Germany may not be ideal for the US.",
        ],
      },
      {
        heading: "Storage limits",
        paragraphs: [
          "Warehouses offer free storage for a limited time. Do not let approved items sit forever. Plan your haul before buying a large batch of seasonal pieces.",
        ],
      },
      {
        heading: "Declared value and insurance",
        paragraphs: [
          "Understand how your agent declares parcels and whether insurance is optional. Cheaper lines can be slower or stricter — balance cost against how much you care about the package.",
        ],
        links: [{ href: "/guides/how-to-order", label: "How to order" }],
      },
    ],
    faqs: [
      {
        question: "How big should my first haul be?",
        answer:
          "Many beginners start with one or two items to test shipping time and quality, then scale up once they trust the workflow.",
      },
      {
        question: "Can I remove packaging to save weight?",
        answer:
          "Many agents offer optional vacuum packing or box removal. This can lower weight but may increase damage risk for fragile items.",
      },
    ],
    relatedLinks: CORE_LINKS,
  },

  "beginner-guide-to-litbuy": {
    slug: "beginner-guide-to-litbuy",
    path: "/guides/beginner-guide-to-litbuy",
    title: "Beginner Guide to LitBuy",
    metaDescription:
      "New to LitBuy? Start here — account setup, first purchase, QC basics, and links to trending finds on LitBuy Finds.",
    badge: "Start here",
    h1: "Beginner guide to LitBuy",
    intro:
      "If you have never used an agent before, this is the shortest path from zero to your first successful haul.",
    cardDescription:
      "New to LitBuy? Start here — the essentials in one place.",
    sections: [
      {
        heading: "1. Browse on LitBuy Finds",
        paragraphs: [
          "Use categories and trending pages to shortlist items. Save links you like and compare prices before committing.",
        ],
        links: [
          { href: "/categories", label: "Categories" },
          { href: "/trending", label: "Trending" },
        ],
      },
      {
        heading: "2. Register on LitBuy",
        paragraphs: [
          "Create your agent account. New users can unlock shipping discounts through referral registration.",
        ],
      },
      {
        heading: "3. Buy one test item first",
        paragraphs: [
          "A single pair of shoes or a hoodie is enough to learn the workflow — purchase, warehouse arrival, QC, shipping.",
        ],
        links: [{ href: "/deals", label: "Budget test picks" }],
      },
      {
        heading: "4. Learn QC before you ship",
        paragraphs: [
          "Read our QC guide and inspect photos carefully. Shipping back to China after international dispatch is painful and expensive.",
        ],
        links: [{ href: "/guides/how-to-check-qc-photos", label: "QC guide" }],
      },
      {
        heading: "5. Build a haul",
        paragraphs: [
          "Once you trust the process, buy multiple items and ship together to optimize freight.",
        ],
        links: [{ href: "/guides/shipping-and-hauls", label: "Shipping guide" }],
      },
    ],
    faqs: [
      {
        question: "How much should I budget for my first order?",
        answer:
          "Item price plus agent fees plus international shipping. A $30 shoe can become $60–$80 all-in depending on line and country.",
      },
    ],
    relatedLinks: CORE_LINKS,
  },

  "litbuy-spreadsheet-guide": {
    slug: "litbuy-spreadsheet-guide",
    path: "/guides/litbuy-spreadsheet-guide",
    title: "LitBuy Spreadsheet Guide",
    metaDescription:
      "How LitBuy Finds spreadsheets work — latest finds sheets, categories, QC links, and how we turn rows into searchable product pages.",
    badge: "Spreadsheet guide",
    h1: "LitBuy spreadsheet guide",
    intro:
      "Most finds start life in a spreadsheet — rows of names, prices, photos, and agent links. LitBuy Finds turns that raw data into something you can actually browse.",
    cardDescription:
      "How spreadsheet rows become searchable finds on this site.",
    sections: [
      {
        heading: "What the spreadsheet contains",
        paragraphs: [
          "Typical columns include product name, price, image URL, affiliate or agent link, category, and sometimes a QC reference. Curators update sheets when new batches drop.",
        ],
      },
      {
        heading: "How we use it",
        paragraphs: [
          "We import catalog data and map each row to a product page with SEO-friendly URLs, brand detection, and category filters. The Latest Finds sheet powers many of our newest listings.",
        ],
        links: [
          { href: "/latest", label: "Latest finds" },
          { href: "/recently-added", label: "Recently added" },
        ],
      },
      {
        heading: "Why use the site instead of the sheet",
        paragraphs: [
          "Sheets are great for curators but hard to search on mobile. LitBuy Finds adds filters, wishlists, trending scores, and stable links you can share.",
        ],
        links: [{ href: "/guides/how-to-find-products", label: "How to find products" }],
      },
    ],
    faqs: [
      {
        question: "Is every spreadsheet item on LitBuy Finds?",
        answer:
          "We index the main catalog and latest drops. Very old or duplicate rows may be filtered out during import.",
      },
    ],
    relatedLinks: CORE_LINKS,
  },

  "how-to-find-products": {
    slug: "how-to-find-products",
    path: "/guides/how-to-find-products",
    title: "How to Find Products on LitBuy Finds",
    metaDescription:
      "Tips for finding products on LitBuy Finds — search, categories, brands, trending, recently added, and collections explained.",
    badge: "Discovery guide",
    h1: "How to find products",
    intro:
      "You do not need to scroll a 3,000-row spreadsheet. Use the discovery tools on this site to narrow down fast.",
    cardDescription:
      "Search, filters, brands, and collections — find products faster.",
    sections: [
      {
        heading: "Start with collections",
        paragraphs: [
          "Trending, Latest, Editor's Picks, and Hidden Gems are curated entry points. Good when you want inspiration without a specific item in mind.",
        ],
        links: [
          { href: "/trending", label: "Trending" },
          { href: "/latest", label: "Latest finds" },
          { href: "/editors-picks", label: "Editor's picks" },
        ],
      },
      {
        heading: "Filter by category or brand",
        paragraphs: [
          "Know you want running shoes or a specific label? Category and brand pages cut the noise immediately.",
        ],
        links: [
          { href: "/categories/shoes", label: "Shoes" },
          { href: "/brands", label: "All brands" },
        ],
      },
      {
        heading: "Recently added",
        paragraphs: [
          "Fresh imports from the latest sheet land on Recently Added. Check there if you want new drops before they spread on social.",
        ],
        links: [{ href: "/recently-added", label: "Recently added" }],
      },
      {
        heading: "Search and wishlist",
        paragraphs: [
          "Use the search bar on the homepage catalog for keywords. Save items to your wishlist while comparing options.",
        ],
        links: [{ href: "/wishlist", label: "Saved items" }],
      },
    ],
    faqs: [
      {
        question: "Why do some items have no photo?",
        answer:
          "The source row may be missing an image URL. We hide broken images and show a placeholder until data is fixed.",
      },
    ],
    relatedLinks: CORE_LINKS,
  },
};

export const GUIDE_SLUGS = Object.keys(GUIDE_PAGES);

export function getGuide(slug: string): GuidePage | undefined {
  return GUIDE_PAGES[slug];
}

export function getAllGuides(): GuidePage[] {
  return GUIDE_SLUGS.map((slug) => GUIDE_PAGES[slug]);
}

export const GUIDES_HUB = {
  path: "/guides",
  title: "LitBuy Finds Guides",
  metaDescription:
    "Beginner-friendly guides for shopping agents, LitBuy, QC photos, shipping hauls, and finding products on LitBuy Finds.",
  h1: "Guides",
  intro:
    "New to agents or LitBuy? These guides explain the basics in plain language — no jargon dumps, no fluff. Start with the beginner guide or jump to the topic you need.",
};
