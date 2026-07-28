import type { StaticPageSection } from "./static-pages";
import { LITBUY_SIGNUP_URL } from "./constants";
import {
  LITBUY_AUTHORITY_LINKS,
  LITBUY_HUB_FOOTER_LINKS,
} from "./litbuy-authority-hub";

export type AuthorityPage = {
  slug: string;
  path: string;
  title: string;
  metaDescription: string;
  badge: string;
  h1: string;
  /** 40–70 word direct answer under H1 */
  directAnswer: string;
  /** Concise summary box content */
  summary: string;
  sections: StaticPageSection[];
  faqs?: { question: string; answer: string }[];
  relatedLinks?: { href: string; label: string }[];
  parentCrumb?: { label: string; href: string };
  publishedTime: string;
  modifiedTime: string;
};

const PUBLISHED = "2026-07-21T00:00:00.000Z";
const MODIFIED = "2026-07-21T00:00:00.000Z";

const CORE_RELATED = LITBUY_AUTHORITY_LINKS.filter(
  (l) =>
    ![
      "/what-is-litbuy",
      "/what-is-litbuy-finds",
      "/how-to-use-litbuy",
      "/litbuy-review",
      "/is-litbuy-legit",
      "/is-litbuy-safe",
      "/litbuy-qc-photos",
    ].includes(l.href)
);

export const AUTHORITY_PAGES: Record<string, AuthorityPage> = {
  "what-is-litbuy": {
    slug: "what-is-litbuy",
    path: "/what-is-litbuy",
    title: "What Is LitBuy? Shopping Agent Explained",
    metaDescription:
      "LitBuy is a shopping agent that buys from Weidian, Taobao, and 1688 for international customers. Learn how LitBuy works, what it costs, and how it connects to LitBuy Finds.",
    badge: "LitBuy basics",
    h1: "What is LitBuy?",
    directAnswer:
      "LitBuy is a shopping agent platform. You send LitBuy a product link from a Chinese marketplace, pay in your currency, and LitBuy purchases the item, stores it at a warehouse, and ships it to you when you are ready. LitBuy Finds is a separate discovery site that helps you browse finds before opening LitBuy checkout.",
    summary:
      "LitBuy handles purchasing, warehouse storage, optional QC photos, and international shipping. LitBuy Finds helps you discover products first — it does not process orders or hold inventory.",
    sections: [
      {
        heading: "Agent, not a store",
        paragraphs: [
          "LitBuy does not manufacture products or keep its own stock. It places orders on seller listings you choose, receives parcels at a Chinese warehouse, and forwards them internationally when you approve shipping.",
          "Most links on LitBuy Finds open a LitBuy product page so you can confirm size, batch notes, and live price before paying.",
        ],
        links: [
          { href: "/what-is-litbuy-finds", label: "What is LitBuy Finds" },
          { href: "/guides/what-is-a-shopping-agent", label: "Shopping agents explained" },
        ],
      },
      {
        heading: "Typical LitBuy workflow",
        paragraphs: [
          "Browse finds on LitBuy Finds or a community spreadsheet, copy the seller link or open the LitBuy buy button, add items to your LitBuy cart, pay for purchasing and domestic shipping to the warehouse, request warehouse QC photos if needed, then choose an international shipping line and pay freight.",
          "Fees vary by item weight, shipping method, and optional services like detailed QC or insurance. Always confirm the live total on LitBuy before paying.",
        ],
        links: [
          { href: "/how-to-use-litbuy", label: "How to use LitBuy" },
          { href: "/how-to-buy", label: "How to buy overview" },
        ],
      },
      {
        heading: "What LitBuy Finds provides",
        paragraphs: [
          "LitBuy Finds is an independent discovery catalog. We organize spreadsheet and catalog data into searchable categories, brands, QC references, and guides. We are not owned by LitBuy and do not process payments.",
          "Use LitBuy Finds to shortlist products, compare categories, and read buying guides. Use LitBuy when you are ready to purchase and ship.",
        ],
        links: [
          { href: "/litbuy-finds", label: "LitBuy Finds catalog" },
          { href: "/about", label: "About LitBuy Finds" },
        ],
      },
      {
        heading: "Limitations buyers should know",
        paragraphs: [
          "Agent buying involves marketplace sellers, not retail guarantees. Batch quality, sizing, and color can vary. Reference QC on a find page shows examples — warehouse QC of your exact item is the check that matters before shipping.",
          "Delivery times depend on seller dispatch, warehouse processing, and the international line you select. LitBuy Finds does not control shipping speed or seller behavior.",
        ],
        links: [
          { href: "/litbuy-qc-photos", label: "LitBuy QC photos" },
          { href: "/is-litbuy-safe", label: "Is LitBuy safe" },
        ],
      },
    ],
    faqs: [
      {
        question: "Do I need a LitBuy account to browse LitBuy Finds?",
        answer:
          "No. You can search categories, brands, and product pages without logging in. You need a LitBuy account when you are ready to purchase through an agent link.",
      },
      {
        question: "Is LitBuy Finds the same company as LitBuy?",
        answer:
          "No. LitBuy Finds is an independent discovery site. We link to LitBuy agent URLs where available but do not operate checkout or customer support for orders.",
      },
      {
        question: "Who handles refunds or wrong items?",
        answer:
          "Purchase support runs through LitBuy and the seller on their platform. LitBuy Finds provides listing references and guides — not order fulfillment.",
      },
    ],
    relatedLinks: CORE_RELATED,
    publishedTime: PUBLISHED,
    modifiedTime: MODIFIED,
  },

  "what-is-litbuy-finds": {
    slug: "what-is-litbuy-finds",
    path: "/what-is-litbuy-finds",
    title: "What Is LitBuy Finds? Searchable Catalog Explained",
    metaDescription:
      "LitBuy Finds is a searchable catalog of products sourced from the LitBuy spreadsheet. Browse sneakers, jackets, bags, and accessories with images, prices, QC links, categories, and LitBuy AI search.",
    badge: "LitBuy Finds",
    h1: "What Is LitBuy Finds?",
    directAnswer:
      "LitBuy Finds is a searchable catalog of products sourced from the LitBuy spreadsheet and related find lists. It helps shoppers browse clothing, sneakers, bags, accessories, and other finds using product images, prices, categories, QC links, and direct LitBuy purchase links.",
    summary:
      "We turn spreadsheet rows into product pages you can search, filter, and share. LitBuy Finds is for discovery — checkout and shipping happen on LitBuy.",
    sections: [
      {
        heading: "The LitBuy Finds catalog",
        paragraphs: [
          "LitBuy Finds indexes thousands of listings from public spreadsheet imports into searchable product pages. Each entry includes a product name, category, image, price when available, seller source, and a LitBuy buy link.",
          "Browse the full grid on the homepage, filter by category or brand, or open collection pages for sneakers, jackets, bags, and budget tiers.",
        ],
        links: [
          { href: "/", label: "Homepage catalog" },
          { href: "/litbuy-finds", label: "LitBuy Finds landing" },
          { href: "/categories", label: "All categories" },
        ],
      },
      {
        heading: "LitBuy spreadsheet connection",
        paragraphs: [
          "Community LitBuy spreadsheets list Weidian and Taobao URLs with prices and QC notes in rows. LitBuy Finds maps those rows to individual pages so you can search on mobile, share one link, and filter without scrolling a 3,000-line sheet.",
          "The catalog syncs daily — new spreadsheet rows surface in Latest and Recently Added after each import.",
        ],
        links: [
          { href: "/litbuy-spreadsheet", label: "LitBuy spreadsheet guide" },
          { href: "/litbuy-spreadsheet-2026", label: "Spreadsheet 2026" },
          { href: "/guides/litbuy-spreadsheet-guide", label: "Extended spreadsheet guide" },
        ],
      },
      {
        heading: "Product search and LitBuy AI",
        paragraphs: [
          "Use the homepage search bar for brands, categories, and keywords. LitBuy AI goes further — describe what you want in plain language (budget, color, haul) and get real catalog products with validated prices and links.",
          "Category pages include Refine with AI for in-context search. Search-only mode works even when conversational AI is offline.",
        ],
        links: [
          { href: "/ai", label: "LitBuy AI" },
          { href: "/guides/how-to-use-litbuy-finds", label: "How to search finds" },
        ],
      },
      {
        heading: "QC links on find pages",
        paragraphs: [
          "When a spreadsheet row includes a QC reference, we show it on the product page. These are batch or community examples — not photos of your exact order. Request warehouse QC on LitBuy before international shipping.",
        ],
        links: [
          { href: "/litbuy-qc-photos", label: "LitBuy QC photos" },
          { href: "/litbuy-qc", label: "LitBuy QC hub" },
          { href: "/guides/how-to-check-qc-photos", label: "How to check QC" },
        ],
      },
      {
        heading: "Prices and categories",
        paragraphs: [
          "Prices come from catalog import data in USD. High or missing prices show as unavailable or check-latest — always confirm the live LitBuy total at checkout. Categories include shoes, hoodies, jackets, t-shirts, accessories, and electronics.",
          "Deals and under-$30 collections help budget shoppers without mixing currencies or inventing discounts.",
        ],
        links: [
          { href: "/deals", label: "Deals under $30" },
          { href: "/categories/shoes", label: "Shoes category" },
          { href: "/litbuy-finds-under-30", label: "Finds under $30" },
        ],
      },
      {
        heading: "From browsing to buying",
        paragraphs: [
          "LitBuy Finds does not process payments. When you are ready, open the LitBuy link on a product page, confirm size and batch, pay on LitBuy, review warehouse QC, then ship your haul.",
        ],
        links: [
          { href: "/how-to-use-litbuy", label: "How to use LitBuy" },
          { href: "/guides/beginner-guide-to-litbuy", label: "Beginner guide" },
          { href: "/guides", label: "All guides" },
        ],
      },
    ],
    faqs: [
      {
        question: "Is every product verified?",
        answer:
          "We filter broken images and obvious bad data during import, but we do not independently verify every seller or batch. Use QC references, warehouse photos, and your own judgment before shipping.",
      },
      {
        question: "Can I buy directly on LitBuy Finds?",
        answer:
          "No. LitBuy Finds is discovery only. Purchase happens on LitBuy through outbound agent links.",
      },
      {
        question: "How is LitBuy Finds updated?",
        answer:
          "Catalog data syncs from spreadsheet imports. Product counts, prices, and images reflect the latest import — confirm live LitBuy checkout totals before paying.",
      },
    ],
    relatedLinks: [
      { href: "/", label: "Homepage" },
      { href: "/ai", label: "LitBuy AI" },
      { href: "/litbuy-finds", label: "LitBuy Finds catalog" },
      { href: "/litbuy-spreadsheet", label: "LitBuy spreadsheet" },
      { href: "/categories", label: "Categories" },
      { href: "/guides", label: "All guides" },
      { href: "/how-to-use-litbuy", label: "How to use LitBuy" },
      { href: "/litbuy-qc-photos", label: "QC photos" },
    ],
    publishedTime: PUBLISHED,
    modifiedTime: MODIFIED,
  },

  "how-to-use-litbuy": {
    slug: "how-to-use-litbuy",
    path: "/how-to-use-litbuy",
    title: "How to Use LitBuy – Step-by-Step Buying Guide",
    metaDescription:
      "Learn how to use LitBuy step by step: find products on LitBuy Finds, open agent links, pay, request QC photos, and ship your haul internationally.",
    badge: "Buying guide",
    h1: "How to use LitBuy",
    directAnswer:
      "To use LitBuy, create an account, find a product link on LitBuy Finds or a spreadsheet, open the LitBuy listing, add the item to your cart, pay for purchasing, wait for warehouse arrival, review QC photos, then pay for international shipping when you are ready to receive the parcel.",
    summary:
      "Discovery happens on LitBuy Finds or spreadsheets. Purchasing, QC, and shipping happen on LitBuy. Allow time for seller dispatch and freight selection.",
    sections: [
      {
        heading: "Step 1 — Discover a product",
        paragraphs: [
          "Search LitBuy Finds by brand, category, or keyword. Open the product page, check price and QC references, and click the LitBuy buy button. You can also paste a Weidian or Taobao URL directly into LitBuy if you already have a link.",
        ],
        links: [
          { href: "/litbuy-finds", label: "LitBuy Finds" },
          { href: "/ai", label: "Search with LitBuy AI" },
        ],
      },
      {
        heading: "Step 2 — Register and add to cart",
        paragraphs: [
          "Create a free LitBuy account if you do not have one. Confirm size, color, and batch notes on the LitBuy product page. Add items to your cart and pay for purchasing plus domestic shipping to the warehouse.",
          "Keep multiple items in the warehouse until you are ready to ship internationally — this is how hauls save on freight per piece.",
        ],
        links: [
          { href: LITBUY_SIGNUP_URL, label: "LitBuy coupons" },
          { href: "/guides/how-to-order-from-litbuy", label: "Order guide" },
        ],
      },
      {
        heading: "Step 3 — Review warehouse QC",
        paragraphs: [
          "When the seller ships to LitBuy's warehouse, request QC photos of your exact item. Compare stitching, logos, materials, and color. Approve only when you are satisfied — exchanges are easier before international shipping.",
        ],
        links: [
          { href: "/litbuy-qc-photos", label: "QC photos guide" },
          { href: "/guides/how-to-check-qc-photos", label: "How to check QC" },
        ],
      },
      {
        heading: "Step 4 — Ship your haul",
        paragraphs: [
          "Select an international shipping line based on your country, budget, and how fast you need delivery. Pay freight and tracking fees on LitBuy. Customs and import rules are your responsibility as the recipient.",
        ],
        links: [
          { href: "/guides/how-shipping-works-with-agents", label: "Shipping guide" },
          { href: "/litbuy-shipping-coupon", label: "Shipping coupons" },
        ],
      },
      {
        heading: "Practical tips",
        paragraphs: [
          "Start with a lower-cost test piece if you are new. Compare reference QC on LitBuy Finds with warehouse photos on LitBuy. Use coupons when available — confirm they apply to your checkout total.",
          "Prices on find pages can lag behind seller updates. Always confirm the live LitBuy price before paying.",
        ],
        links: [
          { href: LITBUY_SIGNUP_URL, label: "LitBuy coupons" },
          { href: "/deals", label: "Deals under $30" },
          { href: "/new-user-guide", label: "New user guide" },
        ],
      },
    ],
    faqs: [
      {
        question: "Can I use LitBuy without LitBuy Finds?",
        answer:
          "Yes. LitBuy accepts marketplace URLs directly. LitBuy Finds is optional — it makes discovery faster with photos, filters, and QC badges.",
      },
      {
        question: "How long does shipping take?",
        answer:
          "Domestic seller shipping to the warehouse often takes several days. International lines vary by method and destination. LitBuy shows estimates at checkout — they are not guarantees.",
      },
      {
        question: "What if QC looks wrong?",
        answer:
          "Contact LitBuy support before approving shipment. Policies depend on the seller and timing — do not approve items you plan to dispute later.",
      },
    ],
    relatedLinks: CORE_RELATED,
    publishedTime: PUBLISHED,
    modifiedTime: MODIFIED,
  },

  "litbuy-spreadsheet-2026": {
    slug: "litbuy-spreadsheet-2026",
    path: "/litbuy-spreadsheet-2026",
    title: "LitBuy Spreadsheet 2026 – Current Guide & Catalog Access",
    metaDescription:
      "The 2026 guide to LitBuy spreadsheets — what changed, how to browse finds without spreadsheet fatigue, and where to search the live LitBuy Finds catalog.",
    badge: "2026 guide",
    h1: "LitBuy spreadsheet 2026",
    directAnswer:
      "The LitBuy spreadsheet in 2026 still lists thousands of Weidian and Taobao finds with prices and QC notes, but most buyers pair it with LitBuy Finds for searchable pages, filters, and shareable product URLs. This guide explains how to use both without duplicating work.",
    summary:
      "Keep your spreadsheet for raw reference. Use LitBuy Finds and LitBuy AI for daily discovery, mobile browsing, and link sharing in 2026.",
    sections: [
      {
        heading: "What spreadsheets still do best",
        paragraphs: [
          "Power users keep spreadsheets for seller notes, batch comparisons, and offline reference. Community sheets update frequently and may include columns LitBuy Finds does not display.",
          "If you already have a trusted 2026 sheet, bookmark it — but use LitBuy Finds when you need to search by brand or share a single product link.",
        ],
        links: [
          { href: "/litbuy-spreadsheet", label: "Main spreadsheet guide" },
          { href: "/collections/litbuy-spreadsheet-alternative", label: "Spreadsheet alternative" },
        ],
      },
      {
        heading: "What LitBuy Finds adds in 2026",
        paragraphs: [
          "Product pages with images, categories, QC badges, LitBuy AI search, collection pages, and guides. The catalog syncs daily so new rows surface in Latest without downloading a new file.",
          "LitBuy AI understands budgets, colors, and haul requests — returning only real catalog products with validated prices and links.",
        ],
        links: [
          { href: "/litbuy-finds", label: "LitBuy Finds" },
          { href: "/ai", label: "LitBuy AI" },
        ],
      },
      {
        heading: "Recommended 2026 workflow",
        paragraphs: [
          "Shortlist on LitBuy Finds or LitBuy AI, save wishlist items, open LitBuy buy links to confirm live price, request warehouse QC, then ship when your haul is ready. Refer back to your spreadsheet only when you need a specific seller note or batch column.",
        ],
        links: [
          { href: "/how-to-use-litbuy", label: "How to use LitBuy" },
          { href: "/trending-litbuy-finds", label: "Trending finds" },
        ],
      },
    ],
    faqs: [
      {
        question: "Is there one official LitBuy spreadsheet for 2026?",
        answer:
          "Community spreadsheets vary by curator. LitBuy Finds indexes catalog data from public find sources — not a single official sheet file hosted here.",
      },
      {
        question: "Will spreadsheet prices match LitBuy checkout?",
        answer:
          "Not always. Seller prices change. Always confirm the live LitBuy total before paying.",
      },
    ],
    relatedLinks: [
      { href: "/litbuy-spreadsheet", label: "Spreadsheet guide" },
      { href: "/litbuy-finds", label: "LitBuy Finds" },
      ...LITBUY_HUB_FOOTER_LINKS,
    ],
    publishedTime: PUBLISHED,
    modifiedTime: MODIFIED,
  },

  "litbuy-review": {
    slug: "litbuy-review",
    path: "/litbuy-review",
    title: "LitBuy Review 2026 – Strengths, Limits & Who It Suits",
    metaDescription:
      "An honest LitBuy review for 2026: warehouse QC, haul shipping, fees, and who should use LitBuy vs other agents. Based on how LitBuy Finds links and catalogs work.",
    badge: "Review",
    h1: "LitBuy review",
    directAnswer:
      "LitBuy is a popular shopping agent for Weidian, Taobao, and 1688 with warehouse storage, QC photos, and international shipping lines. It suits buyers who want one cart for Chinese marketplaces and are comfortable reviewing QC before shipping. It is not a retail store with guaranteed authenticity.",
    summary:
      "Strengths: unified checkout, QC workflow, haul consolidation. Limits: marketplace variance, shipping cost, no retail guarantees. LitBuy Finds helps you discover — LitBuy handles orders.",
    sections: [
      {
        heading: "What LitBuy does well",
        paragraphs: [
          "LitBuy consolidates purchases from multiple Chinese sellers into one warehouse account. You can build a haul over weeks, request QC photos per item, and choose shipping lines when ready.",
          "The interface is familiar to repeat buyers, and LitBuy Finds links open directly to product pages for faster checkout from discovery.",
        ],
        links: [
          { href: "/how-to-use-litbuy", label: "How to use LitBuy" },
          { href: LITBUY_SIGNUP_URL, label: "Coupons" },
        ],
      },
      {
        heading: "Where expectations should stay realistic",
        paragraphs: [
          "Products come from third-party sellers, not LitBuy inventory. Batch quality, sizing, and materials can vary. Reference QC on find pages helps compare batches — warehouse QC of your item is still required.",
          "International shipping can cost more than the product for heavy jackets or large hauls. Customs duties may apply depending on your country.",
        ],
        links: [
          { href: "/litbuy-qc-photos", label: "QC photos" },
          { href: "/guides/how-shipping-works-with-agents", label: "Shipping guide" },
        ],
      },
      {
        heading: "Who LitBuy is for",
        paragraphs: [
          "Good fit: experienced or patient first-time buyers who read QC, compare batches, and plan hauls. Less ideal: shoppers expecting Amazon-like returns, instant delivery, or authenticated luxury guarantees.",
          "LitBuy Finds is useful regardless of agent — most listings here use LitBuy links, but the discovery tools work even if you only browse before deciding.",
        ],
        links: [
          { href: "/is-litbuy-legit", label: "Is LitBuy legit" },
          { href: "/litbuy-vs-other-agents", label: "Compare agents" },
        ],
      },
      {
        heading: "How we evaluate LitBuy on this site",
        paragraphs: [
          "LitBuy Finds is independent. We link to LitBuy because it matches most catalog URLs, not because we guarantee outcomes. Affiliate commissions may apply when you register or buy through outbound links.",
          "For corrections or outdated links, contact us via the Contact page.",
        ],
        links: [
          { href: "/about", label: "About us" },
          { href: "/contact", label: "Contact" },
        ],
      },
    ],
    faqs: [
      {
        question: "Is this an official LitBuy review?",
        answer:
          "No. This is an editorial overview from LitBuy Finds based on public agent workflows and catalog linking. LitBuy does not endorse this site.",
      },
      {
        question: "Should I use LitBuy or another agent?",
        answer:
          "Compare fees, shipping lines, and UI for your country. See our agent comparison guide and coupon pages for alternatives.",
      },
    ],
    relatedLinks: CORE_RELATED,
    publishedTime: PUBLISHED,
    modifiedTime: MODIFIED,
  },

  "is-litbuy-legit": {
    slug: "is-litbuy-legit",
    path: "/is-litbuy-legit",
    title: "Is LitBuy Legit? What Buyers Should Know",
    metaDescription:
      "Is LitBuy legit? A direct answer about LitBuy as a shopping agent, what it actually does, red flags to watch for, and how LitBuy Finds fits in.",
    badge: "Trust",
    h1: "Is LitBuy legit?",
    directAnswer:
      "LitBuy is a known shopping agent service used by international buyers to purchase from Chinese marketplaces. It is not a retail brand store — it facilitates orders, warehouse storage, and shipping. Legitimacy in practice means using QC, reading seller notes, and following LitBuy's stated policies — not assuming every listing is authentic luxury.",
    summary:
      "LitBuy operates as an agent platform with a public site and checkout flow. Treat marketplace finds as variable-quality goods and verify warehouse QC before shipping.",
    sections: [
      {
        heading: "What \"legit\" means for an agent",
        paragraphs: [
          "Shopping agents are intermediaries. LitBuy's role is to purchase from sellers you select, store items, and ship internationally. That is a legitimate business model used across the agent industry.",
          "Legitimacy does not mean every product is genuine branded goods. Many finds are inspired or replica-tier listings — buyer discretion applies.",
        ],
        links: [
          { href: "/what-is-litbuy", label: "What is LitBuy" },
          { href: "/guides/what-is-a-shopping-agent", label: "What agents do" },
        ],
      },
      {
        heading: "Verifiable practices",
        paragraphs: [
          "LitBuy provides warehouse QC photos for orders you pay for, tracking after international dispatch, and support channels on their platform. LitBuy Finds links to LitBuy product URLs so you can confirm where checkout happens.",
          "Use official LitBuy domains for registration and payment. Avoid third parties claiming to be LitBuy support in random DMs.",
        ],
        links: [
          { href: "/telegram-litbuy", label: "Official Telegram hub" },
          { href: "/discord-litbuy", label: "Discord community" },
        ],
      },
      {
        heading: "Red flags to avoid",
        paragraphs: [
          "Never pay strangers who promise LitBuy discounts outside the official checkout. Be skeptical of guaranteed 1:1 authenticity claims on find pages. If a price looks impossibly low for claimed materials, read QC and reviews carefully.",
          "LitBuy Finds filters some bad data but does not audit every seller.",
        ],
        links: [
          { href: "/is-litbuy-safe", label: "Is LitBuy safe" },
          { href: "/litbuy-qc-photos", label: "QC photos" },
        ],
      },
    ],
    faqs: [
      {
        question: "Is LitBuy Finds affiliated with LitBuy?",
        answer:
          "No. We are an independent catalog. We link to LitBuy agent URLs where available.",
      },
      {
        question: "Are LitBuy products authentic?",
        answer:
          "Marketplace listings vary. LitBuy Finds does not authenticate goods. Use QC and seller information to set expectations.",
      },
    ],
    relatedLinks: CORE_RELATED,
    publishedTime: PUBLISHED,
    modifiedTime: MODIFIED,
  },

  "is-litbuy-safe": {
    slug: "is-litbuy-safe",
    path: "/is-litbuy-safe",
    title: "Is LitBuy Safe? Practical Buyer Safety Guide",
    metaDescription:
      "Is LitBuy safe to use? Practical safety tips for agent buying — QC, payments, shipping, scams to avoid, and what LitBuy Finds does not guarantee.",
    badge: "Safety",
    h1: "Is LitBuy safe?",
    directAnswer:
      "Using LitBuy can be safe when you follow standard agent-buying practices: pay only through LitBuy checkout, request warehouse QC before shipping, avoid off-platform payment requests, and understand that marketplace goods vary in quality. No agent can guarantee perfect orders every time.",
    summary:
      "Safety comes from process — QC review, official payment channels, realistic expectations — not from assuming every find is low-risk.",
    sections: [
      {
        heading: "Payment safety",
        paragraphs: [
          "Complete purchases inside LitBuy's official checkout. Do not send money to individuals claiming to be LitBuy support on Telegram or Discord unless they link you back to the official site.",
          "Coupon links on LitBuy Finds point to documented offers — still verify terms on LitBuy before paying.",
        ],
        links: [
          { href: LITBUY_SIGNUP_URL, label: "LitBuy coupons" },
          { href: "/contact", label: "Report a bad link" },
        ],
      },
      {
        heading: "Product safety and QC",
        paragraphs: [
          "Request warehouse photos for every item you plan to ship. Compare logos, stitching, and materials. Decline or exchange before international shipping when QC fails your standards.",
          "Reference QC on LitBuy Finds is helpful but not a substitute for photos of your exact item.",
        ],
        links: [
          { href: "/litbuy-qc-photos", label: "QC photos guide" },
          { href: "/collections/best-qc-approved-finds", label: "QC-linked finds" },
        ],
      },
      {
        heading: "Shipping and customs",
        paragraphs: [
          "Choose shipping lines appropriate for your country and risk tolerance. Declared values and customs fees are your responsibility as the recipient. LitBuy Finds does not provide customs advice.",
        ],
        links: [
          { href: "/litbuy-shipping-coupon", label: "Shipping coupons" },
          { href: "/guides/how-shipping-works-with-agents", label: "How shipping works" },
        ],
      },
      {
        heading: "What we do not guarantee",
        paragraphs: [
          "LitBuy Finds does not guarantee seller behavior, shipping speed, authenticity, or fit. We organize public find data to help you browse — outcomes depend on sellers, batches, and your QC review.",
        ],
        links: [
          { href: "/is-litbuy-legit", label: "Is LitBuy legit" },
          { href: "/about", label: "About LitBuy Finds" },
        ],
      },
    ],
    faqs: [
      {
        question: "Is it safe to click LitBuy links on this site?",
        answer:
          "We use LitBuy affiliate URLs from catalog imports. If a link looks wrong, use Contact to report it. Always confirm the domain is LitBuy before entering payment details.",
      },
      {
        question: "Should beginners use LitBuy?",
        answer:
          "Many beginners start with a small test order and a lower-cost item. Read our new user guide and QC pages first.",
      },
    ],
    relatedLinks: CORE_RELATED,
    publishedTime: PUBLISHED,
    modifiedTime: MODIFIED,
  },

  "litbuy-qc-photos": {
    slug: "litbuy-qc-photos",
    path: "/litbuy-qc-photos",
    title: "LitBuy QC Photos – Reference & Warehouse QC Explained",
    metaDescription:
      "LitBuy QC photos explained: reference QC on find pages, warehouse QC on LitBuy, what to check before shipping, and where to browse QC-linked products.",
    badge: "LitBuy QC",
    h1: "LitBuy QC photos",
    directAnswer:
      "LitBuy QC photos come in two forms: reference QC linked from find pages (batch examples from other buyers) and warehouse QC taken of your exact item after it arrives at LitBuy. Warehouse QC is the check that matters before you approve international shipping.",
    summary:
      "Use reference QC to compare batches before buying. Request warehouse QC on LitBuy for every item you plan to ship.",
    sections: [
      {
        heading: "Reference QC on LitBuy Finds",
        paragraphs: [
          "When a spreadsheet row includes a QC link, we show it on the product page. These photos help you compare stitching, shape, and materials for a batch — they are not photos of the item you will receive.",
          "Browse QC-linked products in dedicated collections and on the LitBuy QC hub page.",
        ],
        links: [
          { href: "/litbuy-qc", label: "LitBuy QC hub" },
          { href: "/collections/best-qc-approved-finds", label: "QC collection" },
        ],
      },
      {
        heading: "Warehouse QC on LitBuy",
        paragraphs: [
          "After you pay, the seller ships to LitBuy's warehouse. Request detailed photos before approving shipment. Check logos, soles, zippers, lining, and color under normal lighting.",
          "If something looks wrong, contact LitBuy support before the parcel leaves China.",
        ],
        links: [
          { href: "/guides/how-to-check-qc-photos", label: "How to check QC" },
          { href: "/how-to-use-litbuy", label: "How to use LitBuy" },
        ],
      },
      {
        heading: "Categories where QC matters most",
        paragraphs: [
          "Sneakers, designer bags, and puffer jackets benefit most from QC because small details affect wear and resale. Budget basics are lower risk but still worth a quick warehouse check.",
        ],
        links: [
          { href: "/litbuy-sneakers", label: "Sneakers" },
          { href: "/best-litbuy-bags-2026", label: "Bags" },
          { href: "/litbuy-jackets", label: "Jackets" },
        ],
      },
    ],
    faqs: [
      {
        question: "Does every product have QC photos?",
        answer:
          "No. Reference QC depends on source data. Warehouse QC is requested per order on LitBuy after purchase.",
      },
      {
        question: "Can I skip QC?",
        answer:
          "You can, but it increases risk for higher-value items. Most experienced buyers request QC before shipping.",
      },
    ],
    relatedLinks: CORE_RELATED,
    publishedTime: PUBLISHED,
    modifiedTime: MODIFIED,
  },

  "litbuy-shipping-coupon": {
    slug: "litbuy-shipping-coupon",
    path: "/litbuy-shipping-coupon",
    title: "LitBuy Shipping Coupon – Savings on International Freight",
    metaDescription:
      "Find LitBuy shipping coupon offers and tips to reduce international freight on hauls. Verify terms on LitBuy checkout before paying.",
    badge: "Coupons",
    h1: "LitBuy shipping coupon",
    directAnswer:
      "LitBuy shipping coupons and registration offers can reduce international freight or checkout fees when terms apply. Offers change over time — always verify the live discount on LitBuy before paying. LitBuy Finds links to current coupon pages but does not run checkout.",
    summary:
      "Shipping is often the largest haul cost. Combine coupons with consolidated shipping and realistic declared values — confirm eligibility on LitBuy.",
    sections: [
      {
        heading: "Where to find shipping offers",
        paragraphs: [
          "Check the main LitBuy coupons page for registration and seasonal promos. New-user guides sometimes include shipping credit — confirm on LitBuy's site, not third-party reposts.",
        ],
        links: [
          { href: LITBUY_SIGNUP_URL, label: "LitBuy coupons" },
          { href: LITBUY_SIGNUP_URL, label: "LitBuy coupons" },
          { href: "/how-to-buy", label: "How to buy" },
        ],
      },
      {
        heading: "Reduce shipping without a coupon",
        paragraphs: [
          "Consolidate items into one haul, remove shoe boxes when safe, choose economy lines if timing allows, and avoid shipping single heavy items alone.",
        ],
        links: [
          { href: "/guides/how-shipping-works-with-agents", label: "Shipping guide" },
          { href: "/deals", label: "Budget finds" },
        ],
      },
      {
        heading: "Verify before you pay",
        paragraphs: [
          "Coupon text on find sites can lag behind LitBuy updates. The checkout screen is the source of truth for whether a shipping discount applies to your cart and destination.",
        ],
        links: [
          { href: LITBUY_SIGNUP_URL, label: "LitBuy coupons" },
          { href: "/is-litbuy-safe", label: "Safety tips" },
        ],
      },
    ],
    faqs: [
      {
        question: "Do shipping coupons work in every country?",
        answer:
          "Terms vary by promotion and destination. Confirm on LitBuy checkout for your address.",
      },
      {
        question: "Is there a permanent free shipping code?",
        answer:
          "We do not list permanent free international shipping — promotions are time-limited. Avoid scams promising unlimited free freight.",
      },
    ],
    relatedLinks: [
      { href: LITBUY_SIGNUP_URL, label: "All LitBuy coupons" },
      ...CORE_RELATED.slice(0, 8),
    ],
    publishedTime: PUBLISHED,
    modifiedTime: MODIFIED,
  },
};

export const AUTHORITY_PAGE_SLUGS = Object.keys(AUTHORITY_PAGES);

export function getAuthorityPage(slug: string): AuthorityPage | undefined {
  return AUTHORITY_PAGES[slug];
}
