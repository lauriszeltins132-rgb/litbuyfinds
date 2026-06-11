import { buildGuide } from "./build";
import { CORE_LINKS } from "./shared";
import type { GuidePage } from "./types";

export const BUYING_GUIDES: Record<string, GuidePage> = {
  "how-to-order-from-litbuy": buildGuide("how-to-order-from-litbuy", "buying", {
    title: "How to Order from LitBuy",
    metaDescription:
      "Order from LitBuy step by step — open an agent link, confirm the listing, pay, review warehouse QC, and prepare your shipment.",
    badge: "How to order",
    h1: "How to order from LitBuy",
    intro:
      "Ordering is the same loop every time: land on the right listing, pay, wait for the warehouse, check QC, ship. Here is that loop with the details that trip up first-timers.",
    cardDescription:
      "Place a LitBuy order from a find page through to warehouse QC.",
    sections: [
      {
        heading: "Start from a find page",
        paragraphs: [
          "On LitBuy Finds, open a product listing you have already compared. Use the agent link on that page so LitBuy loads the intended marketplace item. Skipping straight to LitBuy search can land on the wrong variant.",
        ],
        links: [
          { href: "/guides/how-to-use-litbuy-agent-links", label: "Using agent links" },
          { href: "/trending", label: "Trending listings" },
        ],
      },
      {
        heading: "Confirm variant and pay",
        paragraphs: [
          "Match color, size, and price to what you saw on the find page. Chinese sizing runs small on a lot of apparel — read the listing notes. Pay with balance or your saved method and wait for purchased status.",
        ],
        links: [{ href: "/guides/beginner-guide-to-litbuy", label: "Beginner guide" }],
      },
      {
        heading: "Track warehouse arrival",
        paragraphs: [
          "Domestic seller shipping is the first wait. Status updates when the parcel hits LitBuy's warehouse. Do not request international shipping until the item is actually there and photographed.",
        ],
      },
      {
        heading: "QC then ship",
        paragraphs: [
          "Review warehouse photos against QC references you read during browsing. Approve good pairs, flag bad ones before freight. Add approved items to a parcel when you are ready.",
        ],
        links: [
          { href: "/guides/how-to-build-your-first-haul", label: "Build a haul" },
          { href: "/how-to-buy", label: "How to buy hub" },
        ],
      },
    ],
    faqs: [
      {
        question: "The price on LitBuy differs from the find page. Which is right?",
        answer:
          "LitBuy pulls live marketplace data at checkout. Sellers change prices without updating spreadsheets. Trust the LitBuy screen at the moment you pay.",
      },
      {
        question: "Can I order multiple links in one checkout?",
        answer:
          "Each agent link is usually a separate purchase. You combine them later at shipping, not at initial checkout.",
      },
      {
        question: "What if QC fails?",
        answer:
          "Contact LitBuy support with the photos before you ship internationally. Fixes are much harder after the parcel leaves China.",
      },
    ],
    relatedLinks: [...CORE_LINKS],
  }),

  "how-to-buy-from-weidian": buildGuide("how-to-buy-from-weidian", "buying", {
    title: "How to Buy from Weidian",
    metaDescription:
      "Buy from Weidian through LitBuy — what Weidian is, how finds link to it, and what to check on the listing before you pay.",
    badge: "Marketplace guide",
    h1: "How to buy from Weidian",
    intro:
      "Weidian is a mobile-first marketplace where a huge share of fashion finds live. You will not check out with a foreign card directly — you open Weidian listings through LitBuy agent links from a find page.",
    cardDescription:
      "Weidian listings, agent links, and what to verify before you pay.",
    sections: [
      {
        heading: "What Weidian is",
        paragraphs: [
          "Weidian hosts individual seller shops — often one label or batch per store. Listings move quickly and photos are not always polished. That is normal; use QC references and warehouse photos to fill the gaps.",
        ],
        links: [{ href: "/categories", label: "Browse by category" }],
      },
      {
        heading: "Find Weidian items on LitBuy Finds",
        paragraphs: [
          "Many product listings here source from Weidian URLs embedded in the agent link. Filter by category or brand, open the card, and read any notes on the row before you click through.",
        ],
        links: [
          { href: "/recently-added", label: "Recently added" },
          { href: "/brands", label: "Brand pages" },
        ],
      },
      {
        heading: "Open the agent link on LitBuy",
        paragraphs: [
          "LitBuy resolves the Weidian item and shows purchasable options. Confirm SKU, size, and color — Weidian shops love slightly different option names for the same thing.",
        ],
        links: [{ href: "/guides/how-to-use-litbuy-agent-links", label: "Agent link tips" }],
      },
      {
        heading: "After purchase",
        paragraphs: [
          "Weidian domestic shipping is usually fast relative to international legs. When QC lands, compare to reference photos you saved while browsing. Use your own judgment on whether flaws are acceptable for the price.",
        ],
        links: [{ href: "/guides/how-litbuy-works", label: "Full LitBuy flow" }],
      },
    ],
    faqs: [
      {
        question: "Why are so many finds on Weidian?",
        answer:
          "Low friction for small sellers and WeChat-era shop tools. Curators track popular batches there, so spreadsheets — and this site — reflect that.",
      },
      {
        question: "Is every Weidian shop the same quality?",
        answer:
          "No. Shop reputation, batch, and price all vary. QC references help you see what a batch looks like in hand; they do not replace checking your item.",
      },
    ],
    relatedLinks: [...CORE_LINKS],
  }),

  "how-to-buy-from-taobao": buildGuide("how-to-buy-from-taobao", "buying", {
    title: "How to Buy from Taobao",
    metaDescription:
      "How to buy Taobao items through LitBuy — browsing finds, reading listings, agent links, and sizing notes for overseas buyers.",
    badge: "Marketplace guide",
    h1: "How to buy from Taobao",
    intro:
      "Taobao is Alibaba's consumer marketplace — bigger catalog, more formal shops than many Weidian stores. Overseas buyers still route purchases through an agent. LitBuy Finds helps you land on the right Taobao listing first.",
    cardDescription:
      "Taobao finds, agent checkout, and sizing checks for buyers abroad.",
    sections: [
      {
        heading: "Taobao vs other sources",
        paragraphs: [
          "Taobao listings often have more review photos and structured size charts, but language and domestic-only checkout remain barriers. Agent links bridge that gap.",
        ],
        links: [
          { href: "/guides/how-to-buy-from-weidian", label: "Weidian guide" },
          { href: "/guides/how-to-buy-from-1688", label: "1688 guide" },
        ],
      },
      {
        heading: "Locate Taobao finds here",
        paragraphs: [
          "Search or filter on LitBuy Finds. When a listing shows Taobao as the source, the agent link should resolve to that shop item. Compare a few listings if the model has multiple sellers.",
        ],
        links: [
          { href: "/trending", label: "Trending finds" },
          { href: "/categories/shoes", label: "Shoe listings" },
        ],
      },
      {
        heading: "Sizing and options",
        paragraphs: [
          "Translate size labels carefully — EU, UK, and CN numbers do not line up with US charts. Read buyer comments on the Taobao page when LitBuy shows them; they often mention if a shoe runs large or small.",
        ],
      },
      {
        heading: "Pay on LitBuy and follow up with QC",
        paragraphs: [
          "Complete payment on LitBuy, not on Taobao directly. Warehouse QC is where you confirm the seller sent the colorway you picked. QC references from the find page are comparison material, not a substitute.",
        ],
        links: [{ href: "/guides/how-to-order-from-litbuy", label: "Order walkthrough" }],
      },
    ],
    faqs: [
      {
        question: "Are Taobao items higher quality than Weidian?",
        answer:
          "Marketplace alone does not determine quality. Batch, seller, and price matter more than the platform name on the listing.",
      },
      {
        question: "Can I use image search on Taobao myself?",
        answer:
          "You can, but you still need an agent link for checkout. Finds on this site already map many popular items to LitBuy URLs so you skip manual hunting.",
      },
      {
        question: "What if the Taobao listing goes dead?",
        answer:
          "Sellers delist often. Search the same model on brand or category pages here, or check recently added for a refreshed agent link.",
      },
    ],
    relatedLinks: [...CORE_LINKS],
  }),

  "how-to-buy-from-1688": buildGuide("how-to-buy-from-1688", "buying", {
    title: "How to Buy from 1688",
    metaDescription:
      "Buy from 1688 through LitBuy — wholesale-style listings, MOQs, and how to browse 1688 finds on LitBuy Finds before ordering.",
    badge: "Marketplace guide",
    h1: "How to buy from 1688",
    intro:
      "1688 is Alibaba's domestic wholesale marketplace. Units are cheap; minimum order quantities and bulk-focused listings are common. Some finds here still point to 1688 via LitBuy — read the listing before you assume single-piece checkout.",
    cardDescription:
      "1688 wholesale listings, MOQs, and ordering through LitBuy.",
    sections: [
      {
        heading: "How 1688 differs",
        paragraphs: [
          "Listings target shops and resellers. You might see tiered pricing by quantity or a minimum order count. Not every 1688 link is meant for one pair of shoes — check the find notes and LitBuy options.",
        ],
        links: [{ href: "/guides/how-to-buy-from-taobao", label: "Taobao guide" }],
      },
      {
        heading: "Find 1688 rows on LitBuy Finds",
        paragraphs: [
          "Fewer fashion finds come from 1688 than Weidian or Taobao, but accessories, blanks, and bulk basics show up. Browse categories and read card descriptions for MOQ hints.",
        ],
        links: [
          { href: "/categories", label: "Categories" },
          { href: "/recently-added", label: "Recently added" },
        ],
      },
      {
        heading: "Agent link and quantity",
        paragraphs: [
          "Open the agent link and verify LitBuy lists the quantity you actually want. Buying three when you meant one changes shipping weight and cost. If MOQ is too high, pick a different find.",
        ],
        links: [{ href: "/guides/how-to-use-litbuy-agent-links", label: "Agent links" }],
      },
      {
        heading: "QC still applies",
        paragraphs: [
          "Wholesale does not mean skip inspection. Warehouse photos matter even on cheap blanks — wrong color or bad fabric is still a failed order for your purposes.",
        ],
        links: [{ href: "/guides/how-to-build-your-first-haul", label: "Haul basics" }],
      },
    ],
    faqs: [
      {
        question: "Is 1688 only for resellers?",
        answer:
          "Mostly, but some listings allow single units through agents. The find page and LitBuy checkout tell you what is actually purchasable.",
      },
      {
        question: "Why is 1688 cheaper on paper?",
        answer:
          "Factory-direct wholesale pricing and bulk assumptions. Add agent fees, international shipping, and possible MOQ before you compare to a Taobao single-piece listing.",
      },
    ],
    relatedLinks: [...CORE_LINKS],
  }),

  "how-to-build-your-first-haul": buildGuide("how-to-build-your-first-haul", "buying", {
    title: "How to Build Your First Haul",
    metaDescription:
      "Build your first haul on LitBuy — how many items to buy, when to ship, storage limits, and pairing finds from LitBuy Finds.",
    badge: "Haul guide",
    h1: "How to build your first haul",
    intro:
      "A haul is just several warehouse items shipped in one box. Your first one should be small enough to learn freight cost and delivery time without tying up too much money in storage.",
    cardDescription:
      "Plan a first haul — what to buy, when to ship, how to bundle.",
    sections: [
      {
        heading: "Start with a short list",
        paragraphs: [
          "Pick two or three finds from the same general weight class — shoes plus a tee, not shoes plus a heavy coat, unless you accept higher freight. Browse trending and recently added for items with QC references you can study first.",
        ],
        links: [
          { href: "/trending", label: "Trending finds" },
          { href: "/guides/how-to-use-litbuy-finds", label: "Browse the site" },
        ],
      },
      {
        heading: "Stagger purchases if you want",
        paragraphs: [
          "You do not need one mega checkout day. Buy item one, see how fast it hits the warehouse, then add item two while the first waits in storage. Just watch free storage timers on LitBuy.",
        ],
        links: [{ href: "/guides/how-to-order-from-litbuy", label: "How to order" }],
      },
      {
        heading: "Approve QC before you bundle",
        paragraphs: [
          "Only put items in a shipment after warehouse photos look acceptable. Shipping a mistake internationally is expensive; fixing it in the warehouse is not fun either, but it is cheaper.",
        ],
      },
      {
        heading: "Submit one parcel",
        paragraphs: [
          "Select approved lines, choose a shipping method for your country, declare honestly per LitBuy's form, and pay freight. Track until delivery — that experience informs how big your second haul should be.",
        ],
        links: [
          { href: "/guides/how-to-save-money-on-shipping", label: "Shipping savings" },
          { href: "/how-to-buy", label: "How to buy hub" },
        ],
      },
    ],
    faqs: [
      {
        question: "How many items for a first haul?",
        answer:
          "One to three is common. You learn QC, storage, and freight without a dozen parcels waiting on approval.",
      },
      {
        question: "Should I mix marketplaces in one haul?",
        answer:
          "Yes, if they are all in the same LitBuy warehouse. Weidian and Taobao items routinely ship together once approved.",
      },
      {
        question: "What if one item is delayed?",
        answer:
          "Ship what is ready or wait — your call on storage fees versus paying freight twice. Many buyers wait for the slowest piece if dates are close.",
      },
    ],
    relatedLinks: [...CORE_LINKS],
  }),

  "how-to-save-money-on-shipping": buildGuide("how-to-save-money-on-shipping", "buying", {
    title: "How to Save Money on Shipping",
    metaDescription:
      "Practical ways to lower international shipping on LitBuy — haul sizing, packaging choices, line selection, and timing your buys.",
    badge: "Shipping guide",
    h1: "How to save money on shipping",
    intro:
      "Item price gets the attention; freight is what surprises people. Shipping cost drops when you bundle, trim weight, and pick a line that fits your country — not just the cheapest label on the list.",
    cardDescription:
      "Lower freight — bundling, packaging, lines, and timing.",
    sections: [
      {
        heading: "Bundle instead of one-offs",
        paragraphs: [
          "International parcels have a base fee. Three items in one box usually beat three separate shipments. Use LitBuy Finds to shortlist finds over a week or two, then ship once.",
        ],
        links: [{ href: "/guides/how-to-build-your-first-haul", label: "Build a haul" }],
      },
      {
        heading: "Trim dead weight",
        paragraphs: [
          "Shoe boxes add grams fast. Many buyers remove boxes or use vacuum packing for soft goods. Fragile items need protection — do not strip packaging blindly to save a dollar.",
        ],
      },
      {
        heading: "Pick the right line",
        paragraphs: [
          "Cheapest is not always best. Read recent delivery times for your country, customs habits, and size limits. A mid-priced line with tracking you trust beats a lost budget parcel.",
        ],
        links: [
          { href: "/guides/how-to-order-from-litbuy", label: "Order and ship flow" },
          { href: "/recently-added", label: "Stock up on small finds" },
        ],
      },
      {
        heading: "Buy with shipping in mind",
        paragraphs: [
          "Heavy hoodies and boots eat budget on freight. Lighter accessories pad a haul without moving the scale much. Browse categories with weight in mind when you are close to a shipping threshold.",
        ],
        links: [
          { href: "/categories", label: "Categories" },
          { href: "/brands", label: "Brands" },
        ],
      },
    ],
    faqs: [
      {
        question: "Does declared value affect shipping cost?",
        answer:
          "Sometimes indirectly through insurance and customs handling. Follow LitBuy's declaration guidance for your line — guessing wrong can cost more than you save.",
      },
      {
        question: "Is free storage unlimited?",
        answer:
          "No. Long warehouse stays can add fees. Plan a ship date before you buy a cart full of seasonal finds.",
      },
      {
        question: "Should I ship shoes alone first to test?",
        answer:
          "Many beginners do exactly that — higher per-item freight, but less risk while you learn QC and delivery times. Scale bundles once you trust the process.",
      },
    ],
    relatedLinks: [...CORE_LINKS],
  }),

  "how-to-use-litbuy-agent-links": buildGuide("how-to-use-litbuy-agent-links", "buying", {
    title: "How to Use LitBuy Agent Links",
    metaDescription:
      "How LitBuy agent links work on product listings — opening the right item, avoiding wrong variants, and when to re-check the find page.",
    badge: "Agent links",
    h1: "How to use LitBuy agent links",
    intro:
      "Agent links on LitBuy Finds are pre-built URLs that tell LitBuy which marketplace item to load. They save copy-paste errors — if you use them the way they are meant to be used.",
    cardDescription:
      "Open agent links correctly and land on the right LitBuy listing.",
    sections: [
      {
        heading: "Where the link lives",
        paragraphs: [
          "Each product listing on this site includes a button or link to LitBuy. That is the agent link for that row. It should match the price, photo, and title you were browsing — if it does not, go back and try another find.",
        ],
        links: [
          { href: "/guides/how-to-use-litbuy-finds", label: "Using LitBuy Finds" },
          { href: "/trending", label: "Example listings" },
        ],
      },
      {
        heading: "Click from the product page, not old tabs",
        paragraphs: [
          "Spreadsheet URLs go stale. Always open agent links from the live product page on LitBuy Finds rather than a bookmark from last month. Imports refresh on recently added when curators update rows.",
        ],
        links: [{ href: "/recently-added", label: "Recently added" }],
      },
      {
        heading: "Verify on LitBuy before paying",
        paragraphs: [
          "LitBuy shows the live marketplace listing. Confirm color code, size, and thumbnail. QC references on the find page helped you browse before buying — this screen is the last check before money leaves your account.",
        ],
        links: [
          { href: "/guides/how-to-order-from-litbuy", label: "Complete an order" },
          { href: "/brands/nike", label: "Browse Nike finds" },
        ],
      },
      {
        heading: "Sharing links with friends",
        paragraphs: [
          "Share the LitBuy Finds product URL so they see context and QC references. If you only send a raw agent URL, they miss the notes and comparison photos you used to decide.",
        ],
      },
    ],
    faqs: [
      {
        question: "Why did my agent link open the wrong color?",
        answer:
          "Marketplace sellers sometimes reuse one link for multiple colorways, or the sheet row was wrong. Stop, compare thumbnails, and pick the correct variant on LitBuy — or choose a different find.",
      },
      {
        question: "Can I paste a Weidian URL directly into LitBuy?",
        answer:
          "Usually yes on LitBuy's side, but you lose the curated context from LitBuy Finds. Prefer site links when they exist so you keep QC references and category context.",
      },
      {
        question: "Do agent links cost extra?",
        answer:
          "The link itself is free. You pay item price, LitBuy service fees, and shipping like any other order. Some rows use affiliate parameters; that does not change how you should review the listing.",
      },
    ],
    relatedLinks: [...CORE_LINKS],
  }),
};
