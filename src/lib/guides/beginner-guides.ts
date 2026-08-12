import { buildGuide } from "./build";
import { CORE_LINKS } from "./shared";
import type { GuidePage } from "./types";

export const BEGINNER_GUIDES: Record<string, GuidePage> = {
  "what-is-litbuy": buildGuide("what-is-litbuy", "beginner", {
    title: "What Is LitBuy?",
    metaDescription:
      "LitBuy explained in plain terms — the shopping agent behind most agent links on LitBuy Finds, and how it fits into browsing and buying from Chinese marketplaces.",
    badge: "Beginner guide",
    h1: "What is LitBuy?",
    intro:
      "LitBuy is a shopping agent service. You pick a product listing, LitBuy buys it from the seller in China, holds it at a warehouse, and ships it to you when you are ready. LitBuy Finds is separate — we help you browse finds and open the right agent link.",
    cardDescription:
      "What LitBuy does, and how it connects to the finds on this site.",
    sections: [
      {
        heading: "Agent, not a store",
        paragraphs: [
          "LitBuy does not manufacture or stock inventory. It places orders on marketplaces like Weidian and Taobao using your payment, then handles warehouse storage and international shipping.",
          "When you click an agent link on LitBuy Finds, you land on the matching product listing inside LitBuy. Use your own judgment on price, batch, and seller before you buy.",
        ],
        links: [
          { href: "/guides/what-is-a-shopping-agent", label: "What is a shopping agent?" },
          { href: "/how-to-buy", label: "How to buy overview" },
        ],
      },
      {
        heading: "How LitBuy Finds fits in",
        paragraphs: [
          "LitBuy Finds is a discovery layer. We turn spreadsheet rows and catalog data into searchable product listings with categories, brands, and QC references where available.",
          "You browse here first. When something looks worth a closer look, you follow the agent link and finish checkout on LitBuy.",
        ],
        links: [
          { href: "/guides/how-to-use-litbuy-finds", label: "How to use LitBuy Finds" },
          { href: "/trending", label: "Trending finds" },
        ],
      },
      {
        heading: "What you should expect",
        paragraphs: [
          "Fees cover purchasing, optional QC photos, storage, and freight. Delivery times depend on domestic seller shipping plus the international line you choose.",
          "QC references on a find page can help you compare batches, but warehouse photos of your exact item are still the check that matters before you ship.",
        ],
        links: [
          { href: "/guides/how-litbuy-works", label: "How LitBuy works" },
          { href: "/recently-added", label: "Recently added listings" },
        ],
      },
    ],
    faqs: [
      {
        question: "Do I need a LitBuy account to browse LitBuy Finds?",
        answer:
          "No. You can browse categories, brands, and finds without logging in. You only need a LitBuy account when you are ready to purchase through an agent link.",
      },
      {
        question: "Is LitBuy the only agent linked from this site?",
        answer:
          "Most product listings here use LitBuy agent links. The listing page shows where the link goes so you can confirm before you click.",
      },
      {
        question: "Who handles refunds or wrong items?",
        answer:
          "Purchase support runs through LitBuy and the seller on their platform. LitBuy Finds does not process orders — we point you to listings and reference info to browse before buying.",
      },
    ],
    relatedLinks: [...CORE_LINKS],
  }),

  "what-is-a-shopping-agent": buildGuide("what-is-a-shopping-agent", "beginner", {
    title: "What Is a Shopping Agent?",
    metaDescription:
      "Shopping agents explained simply — why overseas buyers use them for Weidian, Taobao, and 1688, and what happens between click and delivery.",
    badge: "Beginner guide",
    h1: "What is a shopping agent?",
    intro:
      "A shopping agent is a company that buys from Chinese marketplaces for customers abroad. You send them a product link and size. They pay locally, receive the parcel, and ship it to your address.",
    cardDescription:
      "The middle step between a marketplace listing and your front door.",
    sections: [
      {
        heading: "Why marketplaces need a middle layer",
        paragraphs: [
          "Weidian, Taobao, and 1688 are built for domestic buyers — local payment, local addresses, and fast in-country shipping. If you live outside China, checkout usually does not work without help.",
          "An agent gives sellers a warehouse address in China and converts your payment so the order can go through.",
        ],
        links: [
          { href: "/guides/why-use-a-shopping-agent", label: "Why use a shopping agent?" },
          { href: "/categories", label: "Browse categories" },
        ],
      },
      {
        heading: "Typical workflow",
        paragraphs: [
          "You submit a link, pay the item price plus a service fee, and wait for domestic delivery to the warehouse. Staff can photograph the product for QC. When you are happy — or when you have more items ready — you pay freight and the parcel leaves for your country.",
        ],
        links: [
          { href: "/guides/how-litbuy-works", label: "How LitBuy works" },
          { href: "/guides/how-to-order-from-litbuy", label: "How to order from LitBuy" },
        ],
      },
      {
        heading: "Agents vs forwarding-only services",
        paragraphs: [
          "Some services only reship parcels you already bought. Full agents also place the order, track seller shipment, and offer QC in the dashboard. For most finds on this site, you want the full agent flow.",
        ],
      },
      {
        heading: "Where LitBuy Finds helps",
        paragraphs: [
          "Instead of hunting raw links in a spreadsheet, you can filter finds by brand or category, read QC references when they exist, and open a pre-mapped agent link. Still compare the listing yourself before paying.",
        ],
        links: [
          { href: "/brands", label: "Browse brands" },
          { href: "/guides/litbuy-spreadsheet-guide", label: "Spreadsheet guide" },
        ],
      },
    ],
    faqs: [
      {
        question: "Is an agent the same as a reseller?",
        answer:
          "Usually no. Agents buy the specific listing you choose and charge service and shipping fees. They are not picking random stock to mark up unless you use a curated shop inside the agent app.",
      },
      {
        question: "Can I buy without an agent?",
        answer:
          "Some sellers offer direct international shipping, but it is uncommon on the marketplaces behind most finds here. For those listings, an agent or similar forwarder is the practical route.",
      },
    ],
    relatedLinks: [...CORE_LINKS],
  }),

  "why-use-a-shopping-agent": buildGuide("why-use-a-shopping-agent", "beginner", {
    title: "Why Use a Shopping Agent?",
    metaDescription:
      "Practical reasons buyers use shopping agents — payment, warehouse QC, storage, and bundled shipping when ordering from Chinese marketplaces.",
    badge: "Beginner guide",
    h1: "Why use a shopping agent?",
    intro:
      "You could try to wire money to a random seller and hope for the best. Most people use an agent because it solves payment, receiving, inspection, and overseas shipping in one place.",
    cardDescription:
      "Payment, QC, storage, and shipping — the practical reasons agents exist.",
    sections: [
      {
        heading: "Checkout that actually works",
        paragraphs: [
          "Agents accept cards, PayPal, or balance top-ups in currencies buyers already use. The agent pays the seller in yuan and absorbs the messy part of cross-border checkout.",
        ],
        links: [{ href: "/guides/what-is-litbuy", label: "What is LitBuy?" }],
      },
      {
        heading: "A place to receive and inspect",
        paragraphs: [
          "Sellers ship to the agent warehouse in China. That is where QC photos happen — pictures of your actual item before you commit to international freight.",
          "QC references on LitBuy Finds can show what other buyers received, but your warehouse photos are the final call. Browse references, then verify your pair.",
        ],
        links: [
          { href: "/trending", label: "Finds with QC references" },
          { href: "/categories/shoes", label: "Shoe listings" },
        ],
      },
      {
        heading: "Hold items until a haul makes sense",
        paragraphs: [
          "Shipping one small item alone is often expensive. Agents let you store approved pieces and combine them into one parcel so freight cost per item drops.",
        ],
        links: [
          { href: "/guides/how-to-build-your-first-haul", label: "Build your first haul" },
          { href: "/guides/how-to-save-money-on-shipping", label: "Save on shipping" },
        ],
      },
      {
        heading: "When to skip or wait",
        paragraphs: [
          "A $12 accessory plus fees and solo shipping rarely makes sense. Many buyers shortlist finds on LitBuy Finds, buy a few pieces over a couple of weeks, then ship once.",
        ],
        links: [{ href: "/recently-added", label: "Recently added finds" }],
      },
    ],
    faqs: [
      {
        question: "Are agents only for replica items?",
        answer:
          "No. Agents buy whatever listing you submit — vintage tees, homeware, electronics accessories, and plenty of unbranded goods. The finds here skew fashion, but the agent model is general.",
      },
      {
        question: "What is the main downside?",
        answer:
          "Total cost is item price plus service fee plus shipping, and timelines include seller ship time plus the line you pick. Budget for all three before you order.",
      },
      {
        question: "Do I have to use LitBuy?",
        answer:
          "LitBuy is what most links on this site open. You can still compare agent fees elsewhere, but you will need a fresh link for a different platform.",
      },
    ],
    relatedLinks: [...CORE_LINKS],
  }),

  "how-litbuy-works": buildGuide("how-litbuy-works", "beginner", {
    title: "How LitBuy Works",
    metaDescription:
      "Step-by-step: how LitBuy handles a purchase from agent link to warehouse QC, storage, and international delivery.",
    badge: "LitBuy guide",
    h1: "How LitBuy works",
    intro:
      "Once you understand the sequence, LitBuy is repetitive: open a listing, pay, wait for warehouse arrival, check QC, then ship. This page walks through that loop.",
    cardDescription:
      "From agent link click to package at your door.",
    sections: [
      {
        heading: "Find a listing on LitBuy Finds",
        paragraphs: [
          "Start on category, brand, or trending pages. Open a product page, read price and notes, and skim QC references if the row has them. When you want to buy, use the agent link to open LitBuy.",
        ],
        links: [
          { href: "/trending", label: "Trending finds" },
          { href: "/brands/nike", label: "Nike finds" },
        ],
      },
      {
        heading: "Confirm and pay on LitBuy",
        paragraphs: [
          "Check color, size, and variant on the LitBuy product screen. Prices can shift slightly from the find page — marketplace sellers update listings often. Pay with your LitBuy balance or linked method.",
        ],
        links: [{ href: "/guides/how-to-order-from-litbuy", label: "How to order from LitBuy" }],
      },
      {
        heading: "Warehouse arrival and QC",
        paragraphs: [
          "LitBuy buys from the seller and logs domestic tracking. When the item arrives, you can request or view QC photos in the dashboard. Approve it, exchange if something is wrong, or leave it stored.",
        ],
      },
      {
        heading: "Submit a shipment",
        paragraphs: [
          "Select approved items, pick a shipping line for your country, declare the parcel as instructed, and pay freight. Tracking updates until delivery.",
        ],
        links: [
          { href: "/guides/how-to-save-money-on-shipping", label: "Shipping cost tips" },
          { href: "/guides/how-to-build-your-first-haul", label: "First haul guide" },
        ],
      },
    ],
    faqs: [
      {
        question: "How long does warehouse arrival take?",
        answer:
          "Domestic seller shipping in China is often a few days to about two weeks depending on the seller and stock type. International shipping is separate and depends on the line you choose.",
      },
      {
        question: "Can I buy multiple items before shipping once?",
        answer:
          "Yes. That is the normal haul workflow. Items sit in storage until you bundle them into one outbound parcel.",
      },
    ],
    relatedLinks: [...CORE_LINKS],
  }),

  "beginner-guide-to-litbuy": buildGuide("beginner-guide-to-litbuy", "beginner", {
    title: "Beginner Guide to LitBuy",
    metaDescription:
      "New to LitBuy and agent buying? A short path from browsing finds to your first warehouse QC and shipment.",
    badge: "Start here",
    h1: "Beginner guide to LitBuy",
    intro:
      "Treat your first purchase as practice. One item, full attention on QC, then scale up once the timing and fees make sense to you.",
    cardDescription:
      "A short path from zero to your first successful order.",
    sections: [
      {
        heading: "Browse before you commit",
        paragraphs: [
          "Scroll trending or filter by category on LitBuy Finds. Save a few listings, compare prices, and read any QC references attached to the row. You are looking for a sane first test — not the hardest item on the site.",
        ],
        links: [
          { href: "/categories", label: "All categories" },
          { href: "/guides/how-to-use-litbuy-finds", label: "Using this site" },
        ],
      },
      {
        heading: "Set up LitBuy once",
        paragraphs: [
          "Register, add balance or a payment method, and skim their help pages for your country. You will reuse the same account for every future haul.",
        ],
        links: [{ href: "/guides/what-is-litbuy", label: "What is LitBuy?" }],
      },
      {
        heading: "Buy small, inspect carefully",
        paragraphs: [
          "Open the agent link from a find page, double-check size charts, and pay. When QC photos appear, zoom in. Wrong color or bad stitching is cheaper to fix before international shipping.",
        ],
        links: [{ href: "/guides/how-to-order-from-litbuy", label: "Order walkthrough" }],
      },
      {
        heading: "Ship when ready — not instantly",
        paragraphs: [
          "Free storage has limits. Beginners often ship after one or two approved items so they learn freight cost and delivery time without a huge cart sitting in the warehouse.",
        ],
        links: [
          { href: "/guides/how-to-build-your-first-haul", label: "First haul tips" },
          { href: "/how-to-buy", label: "How to buy hub" },
        ],
      },
    ],
    faqs: [
      {
        question: "What should I buy first?",
        answer:
          "Something with clear sizing and plenty of QC references in the community — often a popular sneaker or hoodie batch people talk about. Avoid obscure one-off listings for order number one.",
      },
      {
        question: "How much extra should I budget beyond item price?",
        answer:
          "Plan for agent service fee, domestic ship to warehouse, international freight, and possible customs depending on country. A rough total is often well above the tag price on the find page.",
      },
      {
        question: "Where do I go if a listing looks broken?",
        answer:
          "Try another find or search the same model on brand pages. Spreadsheet imports occasionally have stale links — browse alternatives before you force a bad URL.",
      },
    ],
    relatedLinks: [...CORE_LINKS],
  }),

  "litbuy-spreadsheet-guide": buildGuide("litbuy-spreadsheet-guide", "beginner", {
    title: "LitBuy Spreadsheet Guide 2026 | Organized Product Discovery",
    metaDescription:
      "LitBuy spreadsheet guide — an organized product discovery resource with QC references, category browsing, and searchable rep finds instead of raw spreadsheet rows.",
    badge: "Spreadsheet guide",
    h1: "LitBuy spreadsheet guide",
    intro:
      "The LitBuy spreadsheet is a community-maintained list of rep finds — and LitBuy Finds is the organized product discovery resource built on top of it. Rows become searchable pages with QC photos, category filters, brand hubs, and trusted agent links you can share without sending fragile sheet URLs.",
    cardDescription:
      "How sheet rows become browsable product listings here.",
    sections: [
      {
        heading: "What a typical row contains",
        paragraphs: [
          "Curators track name, CNY or USD price, image URL, marketplace source, category tags, and a LitBuy agent link. Some rows add a QC reference URL pointing to albums or review threads.",
          "Rows update when sellers change price or when a batch is replaced. The sheet is the source; the website is a cleaned view.",
        ],
      },
      {
        heading: "From row to product page",
        paragraphs: [
          "We map each row to a URL on LitBuy Finds with brand detection, category placement, and card text for browsing. Agent links on the product page should match the sheet intent — always confirm on LitBuy before paying.",
        ],
        links: [
          { href: "/recently-added", label: "Recently added imports" },
          { href: "/guides/how-to-use-litbuy-finds", label: "Site browsing tips" },
        ],
      },
      {
        heading: "Why use the site over the sheet",
        paragraphs: [
          "Sheets are wide and awkward on a phone. Here you get filters, brand pages, trending sorts, and stable links to share. QC references stay visible on the listing when the import includes them.",
        ],
        links: [
          { href: "/litbuy-spreadsheet", label: "LitBuy spreadsheet hub" },
          { href: "/latest-finds", label: "Latest spreadsheet additions" },
          { href: "/best-litbuy-finds-2026", label: "Best finds 2026" },
          { href: "/best-budget-finds", label: "Budget finds" },
          { href: "/trending", label: "Trending finds" },
          { href: "/brands", label: "Brand index" },
        ],
      },
      {
        heading: "When data drifts",
        paragraphs: [
          "If a seller deletes a listing or changes variants, the find page can lag until the next sync. If checkout looks wrong, search for the same item elsewhere on the site or pick a fresher row from recently added.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is every sheet row guaranteed to be live?",
        answer:
          "No. Marketplaces change fast. Treat the find page as a starting point — verify price and variant on LitBuy after you click the agent link.",
      },
      {
        question: "Who maintains the spreadsheets?",
        answer:
          "Community curators and catalog maintainers. LitBuy Finds indexes the feeds we are given; we do not control seller inventory on Weidian or Taobao.",
      },
    ],
    relatedLinks: [...CORE_LINKS],
  }),

  "how-to-use-litbuy-finds": buildGuide("how-to-use-litbuy-finds", "beginner", {
    title: "How to Use LitBuy Finds",
    metaDescription:
      "How to browse LitBuy Finds — categories, brands, trending, QC references on listings, and opening agent links when you are ready to buy.",
    badge: "Discovery guide",
    h1: "How to use LitBuy Finds",
    intro:
      "LitBuy Finds is for browsing product listings before you buy. Use it to narrow thousands of finds down to a short list, then hand off to LitBuy through agent links.",
    cardDescription:
      "Browse finds, read listings, and open agent links with confidence.",
    sections: [
      {
        heading: "Pick an entry point",
        paragraphs: [
          "Trending and recently added are good when you want what people are clicking now. Category and brand pages help when you already know the lane — shoes, jackets, a specific label.",
        ],
        links: [
          { href: "/trending", label: "Trending" },
          { href: "/recently-added", label: "Recently added" },
          { href: "/categories/shoes", label: "Shoe category" },
        ],
      },
      {
        heading: "Read the product listing",
        paragraphs: [
          "Each page shows price, source marketplace when we have it, and an agent link to LitBuy. Some listings include QC references — photos or threads from other buyers. They are guides, not a promise about your pair.",
        ],
        links: [{ href: "/guides/litbuy-spreadsheet-guide", label: "Where listings come from" }],
      },
      {
        heading: "Compare before you click buy",
        paragraphs: [
          "Open a few similar finds across brands or categories. Check whether QC references exist, whether the price moved, and whether sizing notes in comments match what you need.",
        ],
        links: [
          { href: "/brands/nike", label: "Example: Nike finds" },
          { href: "/categories", label: "All categories" },
        ],
      },
      {
        heading: "Hand off to LitBuy",
        paragraphs: [
          "When a listing looks right, use the agent link on the product page. LitBuy opens with that product context. Confirm variant and pay there — not on LitBuy Finds.",
        ],
        links: [
          { href: "/how-to-buy", label: "How to buy hub" },
          { href: "/guides/how-to-use-litbuy-agent-links", label: "Agent link guide" },
        ],
      },
    ],
    faqs: [
      {
        question: "Can I check out on LitBuy Finds?",
        answer:
          "No. We only host discovery and links. Checkout, QC in the warehouse, and shipping all happen on LitBuy after you follow an agent link.",
      },
      {
        question: "What if search returns too many results?",
        answer:
          "Tighten with a brand page or category filter first, then search inside that slice. Names in spreadsheets are not always consistent spelling.",
      },
      {
        question: "Are QC references required to buy?",
        answer:
          "No. They help you browse before buying, especially on popular batches. Items without references can still be fine — you rely more on warehouse QC after purchase.",
      },
    ],
    relatedLinks: [...CORE_LINKS],
  }),
};
