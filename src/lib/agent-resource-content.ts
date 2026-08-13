import type { StaticPageSection } from "./static-pages";
import type { AuthorityPage } from "./litbuy-authority-pages";
import { getDatasetSyncedIso } from "./catalog-meta";
import {
  CATEGORY_FINDS_LINKS,
  FINDS_DATABASE_LINKS,
  GUIDE_AUTHORITY_LINKS,
  SPREADSHEET_CLUSTER_LINKS,
} from "./seo-internal-links";
import type { AgentResourceDefinition } from "./agent-resource-agents";

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
  return `${name} Telegram is the fastest way to catch daily QC photos, spreadsheet-style product updates, and ${name} agent finds without refreshing static files. LitBuy Finds readers use the RN Finds Telegram community for ${name} reps Telegram drops, haul notes, and verified marketplace links you can open on ${name} at checkout. Tap below to join ${name} Telegram.`;
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
        `${name} Telegram is the community feed where buyers share ${name} spreadsheet rows, QC warehouse photos, sneaker and streetwear finds, and agent product links. If you searched “${name} Telegram”, “${name} reps Telegram”, or “${name} finds Telegram”, this page is the join guide for that workflow.`,
        `Unlike a static Google Sheet, ${name} Telegram pushes new rows and QC discussion in real time so you can react before popular batches sell out — then open the same listing on LitBuy Finds with ${name} selected at checkout.`,
      ],
      links: [
        { href: agentFindsPath(agent), label: `Browse ${name} finds` },
        { href: agentSpreadsheetPath(agent), label: `${name} spreadsheet` },
        { href: "/telegram", label: "Telegram finds hub" },
      ],
    },
    {
      heading: `Why buyers join ${name} Telegram`,
      paragraphs: [
        `${name} Telegram is useful when you want community QC context, haul discussion, and same-day spreadsheet drops. Members post ${name} finds with notes on batch quality, sizing, restocks, and price changes that are hard to capture in a sheet alone.`,
        `Shoppers also look for ${name} spreadsheet Telegram updates and discount or shipping announcements when the community shares them — always confirm live terms on ${name} checkout before paying.`,
      ],
      links: [
        { href: "/qc-finds-telegram", label: "QC finds on Telegram" },
        { href: "/spreadsheet-telegram", label: "Spreadsheet Telegram guide" },
        { href: "/latest-finds", label: "Latest LitBuy Finds" },
      ],
    },
    {
      heading: `Finding products, rep updates & spreadsheet shares`,
      paragraphs: [
        `A typical ${name} finds Telegram day mixes new product rows, seller restocks, and short commentary on why a link is worth opening. That is how most buyers discover heat faster than scrolling raw spreadsheets.`,
        `When a row looks promising, search the product on LitBuy Finds, compare related picks, then set ${name} as your preferred agent so Buy links open the same marketplace listing through ${name}.`,
      ],
      links: [
        { href: agentFindsPath(agent), label: `${name} finds catalog` },
        { href: agentSpreadsheetPath(agent), label: `${name} spreadsheet guide` },
        ...CATEGORY_FINDS_LINKS.slice(0, 4),
      ],
    },
    {
      heading: `${name} QC photos and discussion`,
      paragraphs: [
        `QC threads are a core reason people join ${name} Telegram communities. Members share warehouse albums, batch comparisons, and sizing notes tied to ${name} checkout workflows.`,
        `Treat community QC as reference — not a guarantee. Open the product on LitBuy Finds, review listing photos, choose ${name}, then request warehouse QC on your exact item before international shipping.`,
      ],
      links: [
        { href: "/litbuy-qc", label: "QC database" },
        { href: "/collections/best-qc-approved-finds", label: "QC Finds" },
        { href: "/guides/how-to-check-qc-photos", label: "How to read QC photos" },
      ],
    },
    {
      heading: `${name} Telegram vs LitBuy Finds website`,
      paragraphs: [
        `LitBuy Finds is the searchable product catalog on this website — filters, photos, categories, and stable product URLs with ${name} buy support. ${name} Telegram is the live community layer where members post fresh rows before they are indexed here.`,
        `Use ${name} Telegram to discover quickly, then save products on LitBuy Finds when you want a permanent link to revisit before checkout.`,
      ],
      links: [
        { href: "/", label: "LitBuy Finds homepage" },
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
        { href: agentReviewPath(agent), label: `${name} review` },
        { href: agentDiscordPath(agent), label: `${name} Discord guide` },
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
      answer: `${name} Telegram is the community feed LitBuy Finds readers use for daily ${name} finds, ${name} reps Telegram updates, QC photos, and spreadsheet-style product rows — with links you can open on ${name} at checkout.`,
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
      question: `What can I find in ${name} Telegram?`,
      answer: `Expect ${name} finds Telegram posts, spreadsheet shares, QC discussions, restock notes, and occasional discount or shipping announcements. Always verify live prices and coupon terms on ${name} before paying.`,
    },
    {
      question: `Can I buy with ${name} from LitBuy Finds?`,
      answer: `Yes. Open any product, choose ${name} as your preferred agent, and use the Buy button. LitBuy is recommended on this site, but ${name} is fully supported.`,
    },
    {
      question: `Is ${name} Telegram the same as LitBuy Finds?`,
      answer: `No. ${name} Telegram is the live community feed. LitBuy Finds is the searchable product catalog on this website with photos, filters, QC references, and ${name} buy links.`,
    },
    {
      question: `Where should I start for ${name} spreadsheet finds?`,
      answer: `Use the ${name} spreadsheet guide on this site for a cleaner front-end to the catalog — then browse Latest Finds and category pages, or follow ${name} spreadsheet Telegram shares in the community feed.`,
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
  return {
    slug: `${agent.slug}-spreadsheet`,
    type: "spreadsheet" as const,
    title: `${name} Spreadsheet Finds | Searchable Catalog & QC Links`,
    description: `${name} spreadsheet-style finds on LitBuy Finds — searchable catalog with QC references, category filters, and ${name} checkout on every product page.`,
    h1: `${name} spreadsheet finds`,
    intro: `${name} shoppers often start from community spreadsheets. LitBuy Finds indexes the same product universe into searchable pages with photos, QC badges, and your saved agent preference — set ${name} in the header, then browse normally.`,
    badge: "Agent spreadsheet",
    keywords: [
      `${agent.slug} spreadsheet`,
      `${agent.slug} finds sheet`,
      `${agent.slug} spreadsheet finds`,
    ],
    updateFrequency: "weekly" as const,
    filter: { trending: true },
    relatedLinks: [
      { href: agentFindsPath(agent), label: `${name} finds hub` },
      { href: agentTelegramPath(agent), label: `${name} Telegram` },
      { href: agentDiscordPath(agent), label: `${name} Discord` },
      { href: agentReviewPath(agent), label: `${name} review` },
      { href: "/litbuy-spreadsheet", label: "LitBuy spreadsheet" },
      { href: "/rep-agent-spreadsheets", label: "Agent spreadsheets hub" },
      ...SPREADSHEET_CLUSTER_LINKS.filter(
        (link) => !link.href.includes(agent.slug)
      ).slice(0, 3),
    ],
    faqs: [
      {
        question: `How is this different from a raw ${name} spreadsheet?`,
        answer:
          "Sheets are static rows. LitBuy Finds syncs catalog data into searchable product pages with photos, filters, QC references, and shareable URLs.",
      },
      {
        question: `Is LitBuy required?`,
        answer: `No. LitBuy is recommended on this site, but you can choose ${name} before pressing Buy on any product.`,
      },
      {
        question: `Can I open listings on ${name}?`,
        answer: `Yes. Select ${name} as your preferred agent in the header or on the product page — buy links rebuild for the same marketplace listing.`,
      },
    ],
    productSectionTitle: `Trending finds for ${name} shoppers`,
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
    title: `${name} Telegram – Daily QC Photos & Spreadsheet Finds`,
    metaDescription: `${name} Telegram is the community feed for daily QC photos, spreadsheet updates, and verified ${name} finds. Join ${name} Telegram for reps drops, haul notes, and agent links — free via LitBuy Finds.`,
    h1: `${name} Telegram`,
    keywords: [
      `${agentLower} telegram`,
      `${agentLower} reps telegram`,
      `${agentLower} finds telegram`,
      `${agentLower} spreadsheet telegram`,
      `telegram ${agentLower}`,
      `join ${agentLower} telegram`,
      `${agentLower} telegram group`,
      `${agentLower} telegram channel`,
      `${agentLower} qc telegram`,
      `${agentLower} telegram community`,
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
