import type { StaticPageSection } from "./static-pages";
import type { AuthorityPage } from "./litbuy-authority-pages";
import { getDatasetSyncedIso } from "./catalog-meta";
import { getFindsAuthorityStats } from "./finds-authority";
import { getAgentById } from "./agents";
import {
  CATEGORY_FINDS_LINKS,
  FINDS_DATABASE_LINKS,
  GUIDE_AUTHORITY_LINKS,
  SPREADSHEET_CLUSTER_LINKS,
} from "./seo-internal-links";
import type { AgentResourceDefinition } from "./agent-resource-agents";
import type { DiscoveryPageActionLink } from "@/components/discovery/DiscoveryPageShell";
import type { ContentFreshnessVariant } from "./freshness-dates";

const PUBLISHED = "2026-08-07T00:00:00.000Z";
const MODIFIED = getDatasetSyncedIso();

function agentFindsPath(agent: AgentResourceDefinition): string {
  return `/${agent.slug}-finds`;
}

function agentSpreadsheetPath(agent: AgentResourceDefinition): string {
  return `/${agent.slug}-spreadsheet`;
}

function agentReviewPath(agent: AgentResourceDefinition): string {
  return `/${agent.slug}-review`;
}

function agentTelegramPath(agent: AgentResourceDefinition): string {
  return `/telegram-${agent.slug}`;
}

function agentDiscordPath(agent: AgentResourceDefinition): string {
  return `/discord-${agent.slug}`;
}

function resourceLinks(agent: AgentResourceDefinition) {
  return [
    { href: agentFindsPath(agent), label: `${agent.name} finds` },
    { href: agentSpreadsheetPath(agent), label: `${agent.name} spreadsheet` },
    { href: agentTelegramPath(agent), label: `${agent.name} Telegram` },
    { href: agentDiscordPath(agent), label: `${agent.name} Discord` },
    { href: agentReviewPath(agent), label: `${agent.name} review` },
    { href: "/latest-finds", label: "Latest finds" },
    { href: "/litbuy-spreadsheet", label: "LitBuy spreadsheet" },
    { href: "/guides", label: "Shopping guides" },
  ];
}

export function buildAgentTelegramIntro(agent: AgentResourceDefinition): string {
  const name = agent.name;
  return `${name} Telegram is a practical resource for ${name} finds, ${name} reps updates, QC photo discussion, and ${name} spreadsheet shares — without refreshing a raw Google Sheet all day. LitBuy Finds readers use the RN Finds Telegram community for live ${name} drops, then open the same products here with ${name} selected at checkout. ${agent.telegramFocus} Tap below to join ${name} Telegram.`;
}

export function buildAgentDiscordIntro(agent: AgentResourceDefinition): string {
  return `Looking for ${agent.name} Discord servers or community channels for finds, QC references, spreadsheet updates, and haul advice? LitBuy Finds helps you discover products first, then join community discussion around ${agent.name} workflows without hunting through scattered links.`;
}

export function buildAgentTelegramSections(
  agent: AgentResourceDefinition
): StaticPageSection[] {
  const name = agent.name;
  return [
    {
      heading: `What is ${name} Telegram?`,
      paragraphs: [
        `${name} Telegram is the community feed where buyers share ${name} spreadsheet rows, QC warehouse photos, sneaker and streetwear finds, and agent product links. If you searched “${name} Telegram”, “${name} reps”, “${name} finds”, or “${name} spreadsheet”, this page is the resource guide for that workflow.`,
        `${agent.telegramFocus}`,
        `Unlike a static Google Sheet, ${name} Telegram pushes new rows and QC discussion in real time so you can react before popular batches sell out — then open the same listing on LitBuy Finds with ${name} selected at checkout.`,
      ],
      links: [
        { href: agentFindsPath(agent), label: `Browse ${name} finds` },
        { href: agentSpreadsheetPath(agent), label: `${name} spreadsheet` },
        { href: "/litbuy-spreadsheet", label: "LitBuy Spreadsheet" },
        { href: "/telegram", label: "Telegram finds hub" },
      ],
    },
    {
      heading: `What users share in ${name} Telegram`,
      paragraphs: [
        `Expect ${name} finds Telegram posts, ${name} reps links, seller restocks, sizing notes, and short commentary on why a batch is worth opening. Members also share ${name} spreadsheet updates when rows change price or QC coverage.`,
        `Discount or shipping announcements appear when the community notices them — always confirm live terms on ${name} checkout before paying.`,
      ],
      links: [
        { href: "/latest-finds", label: "Latest LitBuy Finds" },
        { href: "/best-rep-finds", label: "Best rep finds" },
        { href: agentFindsPath(agent), label: `${name} finds catalog` },
      ],
    },
    {
      heading: `Latest ${name} rep finds & product updates`,
      paragraphs: [
        `A typical ${name} finds day mixes new product rows with restocks and haul notes. That is how most buyers discover heat faster than scrolling raw spreadsheets alone.`,
        `When a row looks promising, search it on LitBuy Finds, compare related picks in categories and brands, then set ${name} as your preferred agent so Buy links open the same marketplace listing through ${name}.`,
      ],
      links: [
        { href: agentFindsPath(agent), label: `${name} finds catalog` },
        { href: agentSpreadsheetPath(agent), label: `${name} spreadsheet guide` },
        { href: "/latest-finds", label: "Latest finds hub" },
        ...CATEGORY_FINDS_LINKS.slice(0, 4),
      ],
    },
    {
      heading: `${name} QC photo discussions`,
      paragraphs: [
        `QC threads are a core reason people join ${name} Telegram communities. Members share warehouse albums, batch comparisons, and sizing notes tied to ${name} checkout workflows.`,
        `Treat community QC as reference — not a guarantee. Open the product on LitBuy Finds, review listing photos, choose ${name}, then request warehouse QC on your exact item before international shipping.`,
      ],
      links: [
        { href: "/litbuy-qc", label: "QC database" },
        { href: "/collections/best-qc-approved-finds", label: "QC Finds" },
        { href: "/guides/how-to-check-qc-photos", label: "How to read QC photos" },
        { href: "/qc-finds-telegram", label: "QC finds on Telegram" },
      ],
    },
    {
      heading: `${name} spreadsheet & product spreadsheet updates`,
      paragraphs: [
        `Many ${name} spreadsheet Telegram posts are really product spreadsheet updates — new CNY prices, seller swaps, or QC links attached to a row. LitBuy Finds turns that same universe into searchable pages with photos, filters, and shareable URLs.`,
        `Use the ${name} spreadsheet guide on this site when you want a cleaned catalog view, and keep ${name} Telegram for same-day chatter.`,
      ],
      links: [
        { href: agentSpreadsheetPath(agent), label: `${name} spreadsheet` },
        { href: "/litbuy-spreadsheet", label: "LitBuy Spreadsheet" },
        { href: "/spreadsheet-telegram", label: "Spreadsheet Telegram guide" },
      ],
    },
    {
      heading: `Why users join ${name} Telegram`,
      paragraphs: [
        `${name} Telegram is useful when you want community QC context, haul discussion, and same-day spreadsheet drops that a static file cannot surface quickly.`,
        `Shoppers comparing agents also use ${name} finds threads to see which listings people are actually opening — then verify the same item on LitBuy Finds before checkout.`,
      ],
      links: [
        { href: agentReviewPath(agent), label: `${name} review` },
        { href: "/finds", label: "Finds database hub" },
        { href: "/how-to-buy", label: "How to buy" },
      ],
    },
    {
      heading: `${name} Telegram vs LitBuy Finds website`,
      paragraphs: [
        `LitBuy Finds is the searchable product database on this website — categories, brands, price filters, QC badges, and stable product URLs with ${name} buy support. ${name} Telegram is the live community layer where members post fresh rows before they are indexed here.`,
        `Use ${name} Telegram to discover quickly, then save products on LitBuy Finds when you want a permanent litbuy find page to revisit before checkout.`,
      ],
      links: [
        { href: "/", label: "LitBuy Finds homepage" },
        { href: "/litbuy-finds", label: "LitBuy finds catalog" },
        { href: "/finds", label: "Finds database hub" },
        ...FINDS_DATABASE_LINKS.slice(0, 3),
      ],
    },
    {
      heading: `How to join ${name} Telegram`,
      paragraphs: [
        `Tap the join button above to open the RN Finds channel in Telegram — the same community feed LitBuy Finds readers use for multi-agent drops including ${name}. Joining is free.`,
        `After you join, enable notifications if you want alerts for new spreadsheet rows or QC threads, then come back to LitBuy Finds to open verified ${name} buy links and compare related picks.`,
      ],
      links: [
        { href: agentDiscordPath(agent), label: `${name} Discord guide` },
        { href: "/telegram", label: "All Telegram agent guides" },
        { href: "/how-to-buy", label: "How to buy" },
      ],
    },
  ];
}

export function buildAgentDiscordSections(
  agent: AgentResourceDefinition
): StaticPageSection[] {
  const name = agent.name;
  return [
    {
      heading: `Why buyers search for ${name} Discord`,
      paragraphs: [
        `${name} Discord searches often combine haul planning, QC questions, and spreadsheet drops in one place. Buyers want faster answers than scrolling old Google Sheets — especially for sneakers, streetwear, and budget fashion picks.`,
        `LitBuy Finds complements that workflow with searchable product pages. Use Discord for community signals, then open listings on this site for photos, filters, and verified buy links.`,
      ],
      links: [
        { href: agentTelegramPath(agent), label: `${name} Telegram guide` },
        { href: agentSpreadsheetPath(agent), label: `${name} spreadsheet` },
        { href: "/litbuy-discord", label: "LitBuy Discord hub" },
      ],
    },
    {
      heading: `${name} finds, deals, and shopping guidance`,
      paragraphs: [
        `Community channels are useful for spotting trending batches, shipping line chatter, and coupon reminders. Always confirm live prices and seller notes on the marketplace listing before checkout on ${name}.`,
        `LitBuy Finds does not sell products directly — it indexes community and spreadsheet-style listings into proper pages you can search, filter, and share.`,
      ],
      links: [
        { href: agentFindsPath(agent), label: `${name} finds catalog` },
        { href: agentReviewPath(agent), label: `${name} review` },
        ...GUIDE_AUTHORITY_LINKS.slice(0, 4),
      ],
    },
    {
      heading: "Browse before you join a server",
      paragraphs: [
        `Start with category hubs — sneakers, hoodies, jackets, streetwear — then narrow by brand. When you find a listing worth buying, set ${name} as your agent and open the encoded marketplace URL from the product page.`,
      ],
      links: [
        { href: "/categories", label: "Category database" },
        { href: "/brands", label: "Brand directory" },
        { href: "/trending", label: "Trending finds" },
      ],
    },
  ];
}

export function buildAgentTelegramFaqs(
  agent: AgentResourceDefinition
): { question: string; answer: string }[] {
  const name = agent.name;
  return [
    {
      question: `What is ${name} Telegram?`,
      answer: `${name} Telegram is the community feed LitBuy Finds readers use for daily ${name} finds, ${name} reps updates, QC photos, and ${name} spreadsheet shares — with links you can open on ${name} at checkout.`,
    },
    {
      question: `What do people share in ${name} Telegram?`,
      answer: `Expect ${name} finds posts, ${name} reps links, QC albums, restock notes, spreadsheet/product updates, and occasional discount or shipping announcements. Verify live prices on ${name} before paying.`,
    },
    {
      question: `How do I join ${name} Telegram?`,
      answer: `Tap the Join ${name} Telegram button on this page. It opens the RN Finds Telegram channel used for multi-agent finds including ${name}. Joining is free and takes a few seconds.`,
    },
    {
      question: `Is this an official ${name} Telegram channel?`,
      answer: `This page is an independent resource guide from LitBuy Finds. We link to the community Telegram channel used for ${name} finds discovery — we are not ${name} and do not claim an official agent partnership.`,
    },
    {
      question: `Where can I browse ${name} finds on LitBuy Finds?`,
      answer: `Open the ${name} finds catalog and ${name} spreadsheet guide on this site, or start from Latest Finds for new spreadsheet imports you can checkout with ${name}.`,
    },
    {
      question: `Can I buy with ${name} from LitBuy Finds?`,
      answer: `Yes. Open any product, choose ${name} as your preferred agent, and use the Buy button. LitBuy is recommended on this site, but ${name} is fully supported.`,
    },
    {
      question: `Is ${name} Telegram the same as LitBuy Finds?`,
      answer: `No. ${name} Telegram is the live community feed. LitBuy Finds is the searchable product database on this website with photos, filters, QC references, and ${name} buy links — including litbuy finds and lit buy finds style discovery pages.`,
    },
    {
      question: `Where should I start for ${name} spreadsheet finds?`,
      answer: `Use the ${name} spreadsheet guide on this site for a cleaner front-end to the catalog — then browse Latest Finds and category pages, or follow ${name} spreadsheet shares in the community feed.`,
    },
  ];
}

export function buildAgentDiscordFaqs(
  agent: AgentResourceDefinition
): { question: string; answer: string }[] {
  const name = agent.name;
  return [
    {
      question: `Is this an official ${name} Discord server?`,
      answer: `No. LitBuy Finds is an independent discovery site. Community links are provided as resources — verify you are joining trusted channels before sharing personal information.`,
    },
    {
      question: `Does ${name} Discord replace LitBuy Finds?`,
      answer: `No. Discord is best for real-time discussion. LitBuy Finds is better for searching thousands of indexed listings with photos, QC references, and agent buy links.`,
    },
    {
      question: `Can I use ${name} on every product page?`,
      answer: `Yes. Set ${name} in the site header or choose it when you press Buy on any listing with a verified marketplace link.`,
    },
    {
      question: `Where can I read an honest ${name} overview?`,
      answer: `See our ${name} review page for strengths, limits, and who the agent suits — plus links to finds, spreadsheet, and Telegram resources.`,
    },
  ];
}

export function buildAgentSpreadsheetConfig(agent: AgentResourceDefinition) {
  const name = agent.name;
  const slug = agent.slug;
  const isBoonBuy = slug === "boonbuy";
  const stats = isBoonBuy ? getFindsAuthorityStats() : null;
  const boonbuySignup = isBoonBuy ? getAgentById("boonbuy").signupUrl : null;

  const base = {
    slug: `${slug}-spreadsheet`,
    type: "spreadsheet" as const,
    agentId: agent.id,
    title: isBoonBuy
      ? "BoonBuy Spreadsheet 2026 | Finds, QC Photos & Product Links"
      : `${name} Spreadsheet | Finds, QC Photos & Searchable Catalog`,
    description: isBoonBuy
      ? `Browse the BoonBuy spreadsheet on LitBuy Finds — ${stats!.totalFindsLabel}+ searchable finds (${stats!.qcFindsLabel} with QC photos), real categories, latest sync (${stats!.lastSyncLabel}), and BoonBuy checkout with invite JOINUP.`
      : `${name} spreadsheet guide — searchable ${name} finds with QC photos, category browsing, and ${name} checkout. A cleaner alternative to raw ${name} spreadsheet rows.`,
    h1: isBoonBuy ? "BoonBuy Spreadsheet – Product Finds & QC Photos" : `${name} spreadsheet`,
    intro: isBoonBuy
      ? `The BoonBuy Spreadsheet is the searchable catalog of product finds you can open with BoonBuy checkout — ${stats!.totalFindsLabel} indexed listings (${stats!.qcFindsLabel} with QC photos), covering shoes, hoodies, jackets, tees, accessories, and electronics. Updated ${stats!.lastSyncLabel}. Set BoonBuy in the header, browse filters here, then confirm live price on BoonBuy before paying.`
      : `The ${name} spreadsheet resource on LitBuy Finds turns community ${name} spreadsheet / ${name} finds spreadsheet rows into a searchable product catalog — photos, QC badges, categories, brands, and ${name} buy links on every listing. ${agent.spreadsheetFocus}`,
    badge: isBoonBuy ? "BoonBuy spreadsheet hub" : `${name} spreadsheet`,
    keywords: [
      `${slug} spreadsheet`,
      `${name.toLowerCase()} spreadsheet`,
      `${slug} finds spreadsheet`,
      `${slug} spreadsheet finds`,
      `${slug} product spreadsheet`,
      `${slug} finds`,
      `${slug} qc`,
      `${slug} qc finds`,
      `${name.toLowerCase()} finds sheet`,
      ...(isBoonBuy
        ? ["boonbuy spreadsheet 2026", "best boonbuy spreadsheet", "boonbuy finds spreadsheet"]
        : []),
    ],
    updateFrequency: (isBoonBuy ? "daily" : "weekly") as "daily" | "weekly",
    freshnessVariant: (isBoonBuy ? "catalog-sync" : undefined) as
      | ContentFreshnessVariant
      | undefined,
    filter: { trending: true },
    productLimit: isBoonBuy ? 48 : 24,
    categoryLinks: isBoonBuy
      ? [
          "shoes",
          "hoodies-and-pants",
          "coats-and-jackets",
          "tshirts-and-shorts",
          "accessories",
          "electronics",
        ]
      : undefined,
    brandLinks: isBoonBuy
      ? ["nike", "jordan", "adidas", "moncler", "stussy", "canada-goose"]
      : undefined,
    actionLinks: (isBoonBuy && boonbuySignup
      ? [
          {
            href: boonbuySignup,
            label: "Register on BoonBuy",
            external: true,
            primary: true,
          },
          { href: "/boonbuy-finds", label: "Browse BoonBuy Finds" },
          { href: "/latest-finds", label: "Latest Finds" },
          { href: "/boonbuy-coupons", label: "BoonBuy Coupons" },
        ]
      : undefined) as DiscoveryPageActionLink[] | undefined,
    sections: [
      {
        heading: isBoonBuy ? "What is the BoonBuy spreadsheet?" : `What is the ${name} spreadsheet?`,
        paragraphs: isBoonBuy
          ? [
              `The BoonBuy spreadsheet is the community list of Weidian and Taobao product finds shoppers open with BoonBuy — prices, images, and optional QC notes. LitBuy Finds indexes that universe into ${stats!.totalFindsLabel} searchable pages so you can browse on mobile without scrolling endless sheet cells.`,
              "Use this page as the main BoonBuy spreadsheet hub: search the catalog, open categories, review QC badges where available, then select BoonBuy at checkout. Register with invite JOINUP when you need a new BoonBuy account.",
            ]
          : [
              `A ${name} spreadsheet is the community list of Weidian and Taobao product rows shoppers use with ${name} checkout — prices, seller links, and sometimes QC notes. LitBuy Finds indexes that same product universe into stable pages so you can search on mobile without scrolling thousands of cells.`,
              agent.spreadsheetFocus,
              `This page is the ${name} spreadsheet authority on LitBuy Finds for ${agent.angleLabel}. It is not a downloadable Google Sheet — it is a searchable discovery database with ${name} selected at buy time.`,
            ],
        links: [
          { href: agentFindsPath(agent), label: `${name} finds catalog` },
          ...(isBoonBuy
            ? [
                { href: "/boonbuy-coupons", label: "BoonBuy coupons" },
                { href: "/boonbuy-spreadsheet-2026", label: "BoonBuy spreadsheet 2026" },
                { href: "/best-boonbuy-spreadsheet", label: "Best BoonBuy spreadsheet" },
              ]
            : [
                { href: "/litbuy-spreadsheet", label: "LitBuy Spreadsheet hub" },
                { href: "/rep-agent-spreadsheets", label: "All agent spreadsheets" },
              ]),
        ],
      },
      {
        heading: isBoonBuy ? "How to use it with BoonBuy" : `How to use the ${name} spreadsheet on LitBuy Finds`,
        paragraphs: isBoonBuy
          ? [
              "1) Register on BoonBuy with invite JOINUP if you need an account. 2) Set BoonBuy as your preferred agent in the site header. 3) Browse the product grid, categories, or brands below. 4) Open a product for photos and any QC reference. 5) Press Buy so the marketplace listing opens through BoonBuy with current attribution.",
              "New spreadsheet imports land in Latest Finds after each catalog sync. Keep a personal sheet for notes if you want — use this hub for search, filters, and shareable product URLs.",
            ]
          : [
              `1) Set ${name} as your preferred agent in the site header. 2) Browse the product grid below or open category / brand hubs. 3) Review photos and any QC reference on the product page. 4) Press Buy so the marketplace listing opens through ${name}.`,
              `Keep a personal sheet for notes if you want — use this ${name} spreadsheet guide when you need filters, shareable product URLs, and Latest Finds syncs.`,
            ],
        links: [
          { href: "/latest-finds", label: "Latest finds" },
          { href: "/how-to-buy", label: "How to buy" },
          { href: agentTelegramPath(agent), label: `${name} Telegram` },
          ...(isBoonBuy
            ? [{ href: "/boonbuy-coupons", label: "BoonBuy coupons" }]
            : []),
        ],
      },
      {
        heading: isBoonBuy
          ? "Categories in the BoonBuy spreadsheet catalog"
          : `${name} finds discovery by category`,
        paragraphs: isBoonBuy
          ? [
              "The catalog mirrors real spreadsheet lanes: Shoes, Hoodies and Pants, Coats and Jackets, T-shirt and Shorts, Accessories, and Electronic Products. Open a category page when you know the lane; use brand pages when you know the label.",
              "Pair this BoonBuy spreadsheet hub with BoonBuy finds for the agent-branded catalog landing, and with Latest Finds for newest imports.",
            ]
          : [
              `${name} spreadsheet rows typically span sneakers, streetwear, hoodies, jackets, bags, and accessories. LitBuy Finds mirrors those lanes as category find pages so ${name} shoppers can jump to a silhouette without re-opening a raw sheet.`,
              `Pair this ${name} spreadsheet page with ${name} finds when you want the agent-branded catalog landing, and with Best / Latest finds when you want ranked or newest imports.`,
            ],
        links: isBoonBuy
          ? [
              { href: "/categories/shoes", label: "Shoes" },
              { href: "/categories/hoodies-and-pants", label: "Hoodies and Pants" },
              { href: "/categories/coats-and-jackets", label: "Coats and Jackets" },
              { href: "/categories/tshirts-and-shorts", label: "T-shirt and Shorts" },
              { href: "/categories/accessories", label: "Accessories" },
              { href: "/categories/electronics", label: "Electronic Products" },
              { href: "/categories", label: "All categories" },
            ]
          : [
              { href: agentFindsPath(agent), label: `${name} finds` },
              { href: "/sneaker-finds", label: "Sneaker finds" },
              { href: "/clothing-finds", label: "Clothing finds" },
              { href: "/streetwear-finds", label: "Streetwear finds" },
              { href: "/jacket-finds", label: "Jacket finds" },
              { href: "/rep-finds", label: "Rep finds hub" },
            ],
      },
      {
        heading: isBoonBuy
          ? "QC photos and BoonBuy spreadsheet finds"
          : `${name} QC spreadsheet & quality checks`,
        paragraphs: isBoonBuy
          ? [
              `Many spreadsheet rows include QC references from previous buyers. LitBuy Finds shows those as QC badges on product pages and keeps a QC database of ${stats!.qcFindsLabel} listings. Reference QC shows batch examples; warehouse QC on BoonBuy photographs your exact item after purchase.`,
              "Use QC-linked finds when you want fewer surprises on sneakers, jackets, and bags — then still request warehouse QC before international shipping.",
            ]
          : [
              `Many ${name} spreadsheet rows include QC references — that is the ${name} QC signal buyers look for before shipping. LitBuy Finds surfaces QC badges on product pages and links into the shared QC finds database.`,
              `Reference QC from community albums helps compare batches. Warehouse QC on ${name} photographs your exact item after purchase — still request it before international freight.`,
            ],
        links: [
          { href: "/litbuy-qc", label: "QC finds database" },
          { href: "/what-are-qc-photos", label: "What are QC photos" },
          { href: "/collections/best-qc-approved-finds", label: "QC-approved finds" },
        ],
      },
      {
        heading: isBoonBuy
          ? "BoonBuy spreadsheet vs LitBuy Spreadsheet"
          : `${name} spreadsheet vs LitBuy Spreadsheet`,
        paragraphs: [
          `The LitBuy Spreadsheet hub is the primary spreadsheet authority for this site. ${name} spreadsheet pages help shoppers who specifically searched “${name} spreadsheet” or “${name} finds spreadsheet” and want ${name} checkout context on the same catalog.`,
          `Product data is shared across agents — you are not looking at a separate inventory. Switching agents changes the buy URL builder, not the underlying marketplace listing.`,
        ],
        links: [
          { href: "/litbuy-spreadsheet", label: "LitBuy Spreadsheet (canonical)" },
          { href: "/best-rep-spreadsheets", label: "Best rep spreadsheets" },
          { href: agentReviewPath(agent), label: `${name} review` },
        ],
      },
      {
        heading: `${name} community resources`,
        paragraphs: [
          isBoonBuy
            ? "For same-day row chatter, open BoonBuy Telegram. For slower threaded discussion, see BoonBuy Discord. Claim BoonBuy coupons with invite JOINUP when you need registration savings — then return here for the cleaned spreadsheet-style catalog."
            : `For same-day row chatter, open ${name} Telegram. For slower threaded discussion, see ${name} Discord. For strengths and limits, read the ${name} review — then return here for the cleaned spreadsheet-style catalog.`,
        ],
        links: [
          { href: agentTelegramPath(agent), label: `${name} Telegram` },
          { href: agentDiscordPath(agent), label: `${name} Discord` },
          { href: agentReviewPath(agent), label: `${name} review` },
          ...(isBoonBuy
            ? [{ href: "/boonbuy-coupons", label: "BoonBuy coupons" }]
            : [{ href: "/spreadsheet-telegram", label: "Spreadsheet Telegram guide" }]),
        ],
      },
    ],
    relatedLinks: [
      { href: agentFindsPath(agent), label: `${name} finds hub` },
      ...(isBoonBuy
        ? [
            { href: "/boonbuy-coupons", label: "BoonBuy coupons" },
            { href: "/boonbuy-spreadsheet-2026", label: "BoonBuy spreadsheet 2026" },
            { href: "/best-boonbuy-spreadsheet", label: "Best BoonBuy spreadsheet" },
          ]
        : []),
      { href: agentTelegramPath(agent), label: `${name} Telegram` },
      { href: agentDiscordPath(agent), label: `${name} Discord` },
      { href: agentReviewPath(agent), label: `${name} review` },
      { href: "/litbuy-spreadsheet", label: "LitBuy Spreadsheet" },
      { href: "/latest-finds", label: "Latest finds" },
      { href: "/litbuy-qc", label: "QC finds database" },
      { href: "/rep-finds", label: "Rep finds" },
      { href: "/rep-agent-spreadsheets", label: "Agent spreadsheets hub" },
      ...SPREADSHEET_CLUSTER_LINKS.filter(
        (link) => !link.href.includes(slug)
      ).slice(0, 5),
    ],
    faqs: isBoonBuy
      ? [
          {
            question: "What is the BoonBuy spreadsheet?",
            answer: `The BoonBuy spreadsheet is the community product-find list that LitBuy Finds indexes into ${stats!.totalFindsLabel} searchable listings with photos, categories, and BoonBuy checkout. This page is the main hub for browsing that catalog with BoonBuy selected.`,
          },
          {
            question: "Is the BoonBuy spreadsheet updated?",
            answer: `Yes. The LitBuy Finds catalog syncs from spreadsheet imports — last sync ${stats!.lastSyncLabel}. New rows appear in Latest Finds after each import.`,
          },
          {
            question: "Does the BoonBuy spreadsheet include QC photos?",
            answer: `Many rows include QC references. LitBuy Finds surfaces ${stats!.qcFindsLabel} QC-linked listings with badges on product pages. Reference QC shows batch examples; warehouse QC on BoonBuy photographs your exact item after purchase.`,
          },
          {
            question: "How do I open products through BoonBuy?",
            answer:
              "Set BoonBuy in the site header or on the product page, then press Buy. Destination links use the current JOINUP invite attribution while keeping the same marketplace product identity.",
          },
          {
            question: "Where are BoonBuy coupons?",
            answer:
              "Open the BoonBuy coupons hub for invite JOINUP registration and current promo claim steps. Spreadsheet browsing and coupon signup are separate resources.",
          },
          {
            question: "Is this the same catalog as the LitBuy Spreadsheet?",
            answer:
              "Yes — shared product universe. The LitBuy Spreadsheet hub is the primary site-wide spreadsheet guide; this page targets BoonBuy spreadsheet / BoonBuy finds spreadsheet searches with BoonBuy checkout context.",
          },
        ]
      : [
          {
            question: `What is the ${name} spreadsheet?`,
            answer: `The ${name} spreadsheet is the community product-row universe shoppers use with ${name}. LitBuy Finds turns those rows into searchable ${name} finds pages with photos, QC badges, and ${name} checkout.`,
          },
          {
            question: `How is this different from a raw ${name} spreadsheet?`,
            answer:
              "Raw sheets are static rows that are hard to search on mobile. LitBuy Finds syncs catalog data into product pages with filters, shareable URLs, and agent switching.",
          },
          {
            question: `Can I open every listing on ${name}?`,
            answer: `Yes. Select ${name} as your preferred agent in the header or on the product page — buy links rebuild for the same marketplace listing through ${name}.`,
          },
          {
            question: `Does ${name} have its own QC spreadsheet?`,
            answer: `QC references attached to spreadsheet rows become QC badges on LitBuy Finds. Use the QC finds database for QC-linked products, then request warehouse QC on ${name} for your exact item.`,
          },
          {
            question: `Is this the same catalog as the LitBuy Spreadsheet?`,
            answer: `Yes — shared product universe. The LitBuy Spreadsheet hub is the primary spreadsheet guide; this page targets ${name} spreadsheet / ${name} finds spreadsheet searches with ${name} checkout context.`,
          },
          {
            question: `Where do I find ${name} Telegram or Discord?`,
            answer: `Use the ${name} Telegram and ${name} Discord resource pages linked above for community updates, then return here for the searchable catalog.`,
          },
        ],
    productSectionTitle: isBoonBuy
      ? "Featured BoonBuy spreadsheet picks"
      : `${name} spreadsheet picks`,
  };

  return base;
}

/** Supporting BoonBuy spreadsheet landings — distinct intents that point at the primary hub. */
export function buildBoonbuySpreadsheetSupportPages() {
  const hub = "/boonbuy-spreadsheet";
  const stats = getFindsAuthorityStats();
  const signup = getAgentById("boonbuy").signupUrl;

  return {
    "boonbuy-spreadsheet-2026": {
      slug: "boonbuy-spreadsheet-2026",
      type: "spreadsheet" as const,
      agentId: "boonbuy" as const,
      title: "BoonBuy Spreadsheet 2026 | Latest Finds & QC Catalog",
      description: `BoonBuy spreadsheet 2026 — latest searchable BoonBuy finds with QC photos where available, category browsing, and JOINUP registration. Last catalog sync ${stats.lastSyncLabel}.`,
      h1: "BoonBuy Spreadsheet 2026",
      intro: `Looking for the BoonBuy spreadsheet 2026 or the latest BoonBuy spreadsheet? Start on the main BoonBuy spreadsheet hub for the full catalog (${stats.totalFindsLabel} finds, ${stats.qcFindsLabel} QC-linked). This page covers 2026 wording and freshness — last sync ${stats.lastSyncLabel}.`,
      badge: "2026 guide",
      keywords: [
        "boonbuy spreadsheet 2026",
        "latest boonbuy spreadsheet",
        "boonbuy finds spreadsheet 2026",
      ],
      updateFrequency: "weekly" as const,
      filter: { latest: true },
      productLimit: 24,
      actionLinks: [
        { href: hub, label: "Complete BoonBuy spreadsheet", primary: true },
        {
          href: signup,
          label: "Register on BoonBuy",
          external: true,
        },
      ] as DiscoveryPageActionLink[],
      sections: [
        {
          heading: "2026 BoonBuy spreadsheet workflow",
          paragraphs: [
            "Open the main BoonBuy spreadsheet hub first for categories, QC badges, and the full product grid. Use this 2026 page when you specifically searched year-focused wording.",
            "Set BoonBuy in the header so buy links use current JOINUP attribution while keeping the same Weidian/Taobao product identity.",
          ],
          links: [
            { href: hub, label: "Main BoonBuy spreadsheet" },
            { href: "/boonbuy-finds", label: "BoonBuy finds" },
            { href: "/boonbuy-coupons", label: "BoonBuy coupons" },
            { href: "/latest-finds", label: "Latest finds" },
          ],
        },
      ],
      relatedLinks: [
        { href: hub, label: "BoonBuy Spreadsheet" },
        { href: "/best-boonbuy-spreadsheet", label: "Best BoonBuy spreadsheet" },
        { href: "/boonbuy-finds", label: "BoonBuy finds" },
        { href: "/boonbuy-coupons", label: "BoonBuy coupons" },
        { href: "/telegram-boonbuy", label: "BoonBuy Telegram" },
        { href: "/litbuy-spreadsheet", label: "LitBuy Spreadsheet" },
      ],
      faqs: [
        {
          question: "Where is the complete BoonBuy spreadsheet?",
          answer:
            "The primary BoonBuy spreadsheet hub is /boonbuy-spreadsheet — searchable catalog, categories, QC badges, and BoonBuy checkout context.",
        },
        {
          question: "Is the 2026 catalog current?",
          answer: `Yes. Catalog data syncs from spreadsheet imports — last sync ${stats.lastSyncLabel}. Check Latest Finds for the newest rows.`,
        },
      ],
      productSectionTitle: "Latest BoonBuy spreadsheet picks",
    },
    "best-boonbuy-spreadsheet": {
      slug: "best-boonbuy-spreadsheet",
      type: "spreadsheet" as const,
      agentId: "boonbuy" as const,
      title: "Best BoonBuy Spreadsheet 2026 | Top Finds & QC Picks",
      description:
        "Best BoonBuy spreadsheet picks — editor-style finds with QC photos where available, strong presentation, and BoonBuy checkout. Links back to the complete BoonBuy spreadsheet hub.",
      h1: "Best BoonBuy Spreadsheet",
      intro:
        "Searching for the best BoonBuy spreadsheet or best BoonBuy finds spreadsheet? This page highlights stronger product picks from the shared catalog. For the complete BoonBuy product spreadsheet — categories, freshness, and claim CTAs — open the main BoonBuy spreadsheet hub.",
      badge: "Best picks",
      keywords: [
        "best boonbuy spreadsheet",
        "best boonbuy finds spreadsheet",
        "best boonbuy spreadsheet 2026",
      ],
      updateFrequency: "weekly" as const,
      filter: { trending: true },
      productLimit: 24,
      actionLinks: [
        { href: hub, label: "See complete BoonBuy spreadsheet", primary: true },
        { href: "/boonbuy-finds", label: "BoonBuy finds" },
      ] as DiscoveryPageActionLink[],
      sections: [
        {
          heading: "Best BoonBuy spreadsheet options",
          paragraphs: [
            "The strongest BoonBuy spreadsheet experience on LitBuy Finds is the main hub: full catalog search, category chips, QC badges, and BoonBuy agent switching with JOINUP attribution.",
            "Use this page for ranked/trending picks; return to the complete BoonBuy spreadsheet when you want the full resource.",
          ],
          links: [
            { href: hub, label: "Complete BoonBuy product spreadsheet" },
            { href: "/boonbuy-spreadsheet-2026", label: "BoonBuy spreadsheet 2026" },
            { href: "/boonbuy-coupons", label: "BoonBuy coupons" },
          ],
        },
      ],
      relatedLinks: [
        { href: hub, label: "BoonBuy Spreadsheet" },
        { href: "/boonbuy-spreadsheet-2026", label: "BoonBuy spreadsheet 2026" },
        { href: "/boonbuy-finds", label: "BoonBuy finds" },
        { href: "/boonbuy-coupons", label: "BoonBuy coupons" },
        { href: "/discord-boonbuy", label: "BoonBuy Discord" },
        { href: "/boonbuy-review", label: "BoonBuy review" },
      ],
      faqs: [
        {
          question: "What is the best BoonBuy spreadsheet?",
          answer:
            "On LitBuy Finds, the main /boonbuy-spreadsheet hub is the complete BoonBuy finds spreadsheet resource. This page surfaces stronger picks and links back there.",
        },
        {
          question: "How do I checkout with BoonBuy?",
          answer:
            "Select BoonBuy in the header or on a product page. Buy links keep the same marketplace listing and apply current JOINUP invite attribution.",
        },
      ],
      productSectionTitle: "Best BoonBuy spreadsheet picks",
    },
  };
}


export function buildAgentReviewPage(
  agent: AgentResourceDefinition
): AuthorityPage {
  const name = agent.name;
  return {
    slug: `${agent.slug}-review`,
    path: `/${agent.slug}-review`,
    title: `${name} Review 2026 – Strengths, Limits & Who It Suits`,
    metaDescription: `An honest ${name} review for 2026: how ${name} works for Weidian and Taobao finds, QC workflow, shipping, and who should use ${name} vs other agents. Independent guide from LitBuy Finds.`,
    badge: "Review",
    h1: `${name} review`,
    directAnswer: `${name} is a shopping agent that helps international buyers purchase from Chinese marketplaces such as Weidian, Taobao, and 1688. It suits buyers who want warehouse storage, QC photos, and consolidated shipping — not a retail store with guaranteed authenticity on every listing.`,
    summary: `Strengths: marketplace import, haul consolidation, QC workflow. Limits: seller variance, shipping cost, no luxury authenticity guarantees. LitBuy Finds helps you discover — ${name} handles checkout.`,
    sections: [
      {
        heading: `What ${name} does well`,
        paragraphs: [
          `${name} acts as a proxy buyer: you paste or import marketplace links, pay in your currency, and ${name} purchases from the seller, stores items at a warehouse, and ships internationally when you are ready.`,
          `For spreadsheet and community finds, ${name} is a practical checkout layer once you have already picked a listing on LitBuy Finds or in a Telegram/Discord feed.`,
        ],
        links: [
          { href: agentFindsPath(agent), label: `${name} finds` },
          { href: agentSpreadsheetPath(agent), label: `${name} spreadsheet` },
        ],
      },
      {
        heading: "Where expectations should stay realistic",
        paragraphs: [
          "Products come from third-party sellers, not agent inventory. Batch quality, sizing, and materials can vary. Community QC helps compare batches — your own warehouse QC is still required before shipping.",
          "International shipping can cost more than the product for heavy jackets or large hauls. Customs duties may apply depending on your country.",
        ],
        links: [
          { href: "/guides/how-shipping-works-with-agents", label: "Shipping guide" },
          { href: "/what-are-qc-photos", label: "What are QC photos" },
        ],
      },
      {
        heading: `Who ${name} is for`,
        paragraphs: [
          `Good fit: buyers who read QC, compare batches, and plan hauls over time. Less ideal: shoppers expecting instant delivery, Amazon-like returns, or authenticated luxury guarantees on every listing.`,
          `LitBuy Finds works regardless of agent — browse here first, then open checkout on ${name} when that is your preference.`,
        ],
        links: [
          { href: "/best-shopping-agent", label: "Compare shopping agents" },
          { href: "/how-to-buy-reps", label: "How to buy reps" },
        ],
      },
      {
        heading: "How we evaluate agents on this site",
        paragraphs: [
          "LitBuy Finds is independent. We support multiple agents on product pages. LitBuy is recommended because most catalog links are LitBuy-first — not because we guarantee outcomes for any agent.",
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
        question: `Is this an official ${name} review?`,
        answer: `No. This is an editorial overview from LitBuy Finds based on common agent workflows and catalog linking. ${name} does not endorse this site.`,
      },
      {
        question: `Should I use ${name} or LitBuy?`,
        answer:
          "Compare fees, shipping lines, and interface for your country. LitBuy is recommended on this site; other agents are supported when they fit your workflow better.",
      },
      {
        question: `Where can I find ${name} community resources?`,
        answer: `See our ${name} Telegram, Discord, and spreadsheet pages for discovery guides linked to this catalog.`,
      },
    ],
    relatedLinks: resourceLinks(agent),
    publishedTime: PUBLISHED,
    modifiedTime: MODIFIED,
  };
}

export function buildAgentTelegramMeta(agent: AgentResourceDefinition) {
  const name = agent.name;
  const agentLower = name.toLowerCase();
  return {
    title: `${name} Telegram – Finds, Reps, QC Photos & Spreadsheet Updates`,
    metaDescription: `${name} Telegram guide for ${name} finds, ${name} reps, QC photo discussion, and ${name} spreadsheet updates. Join free, then browse the LitBuy Finds product database with ${name} checkout.`,
    h1: `${name} Telegram`,
    keywords: [
      `${agentLower} telegram`,
      `${agentLower} reps`,
      `${agentLower} finds`,
      `${agentLower} spreadsheet`,
      `${agentLower} reps telegram`,
      `${agentLower} finds telegram`,
      `${agentLower} spreadsheet telegram`,
      `telegram ${agentLower}`,
      `join ${agentLower} telegram`,
      `${agentLower} telegram group`,
      `${agentLower} qc telegram`,
    ],
  };
}

export function buildAgentDiscordMeta(agent: AgentResourceDefinition) {
  const name = agent.name;
  const agentLower = name.toLowerCase();
  return {
    title: `${name} Discord | Community Finds, QC & Spreadsheet Guides`,
    metaDescription: `Looking for ${name} Discord servers for finds, QC references, haul advice, and spreadsheet updates? LitBuy Finds helps ${name} shoppers discover products before joining community channels.`,
    h1: `${name} Discord finds & community guide`,
    keywords: [
      `${agentLower} discord`,
      `discord ${agentLower}`,
      `${agentLower} finds discord`,
    ],
  };
}
