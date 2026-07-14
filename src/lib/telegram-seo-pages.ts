import type { StaticPageSection } from "./static-pages";
import {
  SOCIAL_LINKS,
  TELEGRAM_CHANNEL_NAME,
  TELEGRAM_HANDLE,
  TELEGRAM_MEMBER_LABEL,
} from "./constants";

export type TelegramSeoFocus = "hub" | "agent" | "topic";

export type TelegramSeoPageConfig = {
  slug: string;
  path: string;
  title: string;
  metaDescription: string;
  badge: string;
  h1: string;
  intro: string;
  focus: TelegramSeoFocus;
  focusAgent?: string;
  keywords: string[];
  sections: StaticPageSection[];
  faqs: { question: string; answer: string }[];
  relatedLinks: { href: string; label: string }[];
};

export const TELEGRAM_SUPPORTED_AGENTS = [
  "LitBuy",
  "MuleBuy",
  "OopBuy",
  "ACBuy",
  "Kakobuy",
] as const;

const AGENT_LIST_TEXT = TELEGRAM_SUPPORTED_AGENTS.join(", ");

const HUB_LINKS = [
  { href: "/telegram", label: "Telegram finds hub" },
  { href: "/rn-finds", label: "RN Finds community" },
  { href: "/agent-finds-telegram", label: "Agent finds Telegram" },
  { href: "/spreadsheet-telegram", label: "Spreadsheet Telegram" },
  { href: "/qc-finds-telegram", label: "QC finds Telegram" },
];

const AGENT_TELEGRAM_LINKS = [
  { href: "/telegram-litbuy", label: "LitBuy Telegram" },
  { href: "/telegram-mulebuy", label: "MuleBuy Telegram" },
  { href: "/telegram-hipobuy", label: "HipoBuy Telegram" },
  { href: "/telegram-oopbuy", label: "OopBuy Telegram" },
  { href: "/acbuy-telegram", label: "ACBuy Telegram" },
  { href: "/telegram-kakobuy", label: "Kakobuy Telegram" },
];

export const TELEGRAM_COMMUNITY_FOOTER_LINKS = [
  { href: SOCIAL_LINKS.telegram, label: "Join RN Finds Telegram", external: true },
  ...AGENT_TELEGRAM_LINKS.map((link) => ({ ...link, external: false })),
];

function baseFaqs(agentName?: string): { question: string; answer: string }[] {
  const agentMention = agentName
    ? `Yes. RN Finds supports ${agentName} alongside ${AGENT_LIST_TEXT.replace(`${agentName}, `, "").replace(`, ${agentName}`, "")}.`
    : `Yes. RN Finds supports multiple agents including ${AGENT_LIST_TEXT}.`;

  return [
    {
      question: "What is RN Finds?",
      answer: `${TELEGRAM_CHANNEL_NAME} (${TELEGRAM_HANDLE}) is a Telegram community with ${TELEGRAM_MEMBER_LABEL} sharing daily finds, QC photos, spreadsheet-style product rows, sneaker picks, fashion drops, and shopping-agent links.`,
    },
    {
      question: agentName
        ? `Does RN Finds support ${agentName}?`
        : "Which shopping agents does RN Finds support?",
      answer: agentMention,
    },
    {
      question: "Is RN Finds only for LitBuy?",
      answer:
        "No. LitBuy may be recommended on the LitBuy Finds website for verified checkout links, but the Telegram community is multi-agent. Members share finds for LitBuy, MuleBuy, OopBuy, ACBuy, and Kakobuy depending on the listing.",
    },
    {
      question: "What kind of finds are posted on Telegram?",
      answer:
        "Expect daily spreadsheet updates, QC-approved references, sneaker and streetwear picks, budget fashion finds, shoe comparisons, and direct agent product links. Posts are meant to help buyers discover items faster than scrolling raw sheets alone.",
    },
    {
      question: "How is this different from LitBuy Finds?",
      answer:
        "LitBuy Finds is the product catalog on this website — searchable pages with photos, filters, and buy links. RN Finds on Telegram is the live community layer where members share new rows, QC photos, and agent-specific links in real time.",
    },
  ];
}

function agentSections(
  agentName: string,
  findsPath: string,
  agentNotes: string[]
): StaticPageSection[] {
  return [
    {
      heading: `Why buyers search for ${agentName} Telegram finds`,
      paragraphs: [
        `Many shoppers look for a ${agentName} Telegram channel or ${agentName} finds community because spreadsheets move fast. A dedicated ${agentName} spreadsheet Telegram feed helps you catch new rows, QC photo updates, and price changes without refreshing static files.`,
        `${agentNotes[0]} RN Finds aggregates that energy into one ${TELEGRAM_MEMBER_LABEL} channel so you are not hunting across five different group chats.`,
      ],
      links: [
        { href: findsPath, label: `Browse ${agentName} finds on site` },
        { href: "/spreadsheet-telegram", label: "Spreadsheet Telegram guide" },
      ],
    },
    {
      heading: `${agentName} QC photos and quality checks`,
      paragraphs: [
        `QC-approved finds matter when you are buying blind from Weidian or Taobao. On Telegram, members often attach warehouse photos, batch comparisons, and sizing notes tied to ${agentName} agent links.`,
        `Use ${agentName} QC photo finds as reference — not a guarantee — then open the product on your agent to confirm the live listing before you pay.`,
      ],
      links: [
        { href: "/qc-finds-telegram", label: "QC finds Telegram" },
        { href: "/guides/how-to-check-qc-photos", label: "How to read QC photos" },
      ],
    },
    {
      heading: `${agentName} sneaker finds and fashion picks`,
      paragraphs: [
        `Sneaker finds and fashion finds are the most active categories in agent Telegram groups. RN Finds highlights ${agentName} sneaker finds — Jordans, Dunks, New Balance, and budget runners — plus jackets, hoodies, bags, and accessories.`,
        `Whether you care about streetwear finds, clothing finds, or shoe finds, the channel mixes spreadsheet rows with short commentary so you know why a link is worth opening.`,
      ],
      links: [
        { href: "/sneaker-finds-telegram", label: "Sneaker finds Telegram" },
        { href: "/fashion-finds-telegram", label: "Fashion finds Telegram" },
      ],
    },
    {
      heading: "Multi-agent community, one Telegram home",
      paragraphs: [
        `RN Finds is positioned as a best agent finds community for buyers who switch agents or compare shipping lines. LitBuy may be the recommended default on LitBuy Finds, but Telegram supports ${AGENT_LIST_TEXT} product links in the same feed.`,
        `That makes RN Finds useful if you want daily finds Telegram updates without joining separate single-agent channels for every platform.`,
      ],
      links: [
        { href: "/agent-finds-telegram", label: "Best shopping agent Telegram" },
        { href: "/telegram", label: "All Telegram guides" },
      ],
    },
  ];
}

function buildAgentPage(
  slug: string,
  agentName: string,
  findsPath: string,
  introExtra: string,
  agentNotes: string[]
): TelegramSeoPageConfig {
  const title = `${agentName} Telegram Finds | ${TELEGRAM_CHANNEL_NAME}`;
  const h1 = `${agentName} Telegram Finds`;

  return {
    slug,
    path: `/${slug}`,
    title,
    metaDescription: `Join ${TELEGRAM_CHANNEL_NAME}, a ${TELEGRAM_MEMBER_LABEL} Telegram community for daily ${agentName} finds, QC photos, spreadsheet products, sneaker finds, fashion finds, and multi-agent shopping links.`,
    badge: `${agentName} · Telegram`,
    h1,
    intro: `${TELEGRAM_CHANNEL_NAME} is a multi-agent Telegram community where buyers share ${agentName} finds, ${agentName} spreadsheet rows, QC references, and agent product links every day. ${introExtra} LitBuy Finds keeps the searchable catalog on this site; RN Finds is where the community posts live updates.`,
    focus: "agent",
    focusAgent: agentName,
    keywords: [
      `${agentName.toLowerCase()} telegram`,
      `${agentName.toLowerCase()} finds telegram`,
      `${agentName.toLowerCase()} spreadsheet telegram`,
      `${agentName.toLowerCase()} qc finds`,
      `${agentName.toLowerCase()} sneaker finds`,
      `${agentName.toLowerCase()} fashion finds`,
      `${agentName.toLowerCase()} agent links`,
      "shopping agent telegram",
      "daily finds telegram",
    ],
    sections: agentSections(agentName, findsPath, agentNotes),
    faqs: baseFaqs(agentName),
    relatedLinks: [
      { href: SOCIAL_LINKS.telegram, label: `Join ${TELEGRAM_CHANNEL_NAME}` },
      ...AGENT_TELEGRAM_LINKS.filter((l) => !l.href.includes(slug)),
      ...HUB_LINKS,
      { href: findsPath, label: `${agentName} finds catalog` },
    ],
  };
}

const HUB_PAGE: TelegramSeoPageConfig = {
  slug: "telegram",
  path: "/telegram",
  title: `LitBuy & Agent Finds Telegram | ${TELEGRAM_CHANNEL_NAME}`,
  metaDescription: `Discover ${TELEGRAM_CHANNEL_NAME} on Telegram — ${TELEGRAM_MEMBER_LABEL} sharing LitBuy finds, MuleBuy links, OopBuy picks, ACBuy rows, Kakobuy QC photos, spreadsheet updates, and daily sneaker & fashion finds.`,
  badge: "Telegram SEO hub",
  h1: "LitBuy & agent finds on Telegram",
  intro: `Looking for a LitBuy Telegram group, agent finds Telegram channel, or spreadsheet Telegram feed? ${TELEGRAM_CHANNEL_NAME} (${TELEGRAM_HANDLE}) is a ${TELEGRAM_MEMBER_LABEL} community for daily finds, QC-approved references, sneaker drops, and fashion picks across LitBuy, MuleBuy, OopBuy, ACBuy, and Kakobuy. This page is a dedicated guide — the main LitBuy Finds site stays focused on products and buying.`,
  focus: "hub",
  keywords: [
    "litbuy telegram",
    "litbuy finds telegram",
    "litbuy spreadsheet telegram",
    "best agent telegram",
    "best shopping agent telegram",
    "qc finds telegram",
    "reps finds telegram",
    "spreadsheet finds telegram",
    "agent finds telegram",
    "daily finds telegram",
  ],
  sections: [
    {
      heading: "A separate Telegram funnel — not the whole website",
      paragraphs: [
        "LitBuy Finds is built for browsing products, comparing QC status, and opening verified buy links. Telegram is an optional community layer for buyers who want push-style updates, haul discussion, and fresh spreadsheet rows.",
        "We keep Telegram promotion subtle on the homepage and product pages. These SEO pages exist so people searching Google for agent + Telegram keywords can land on a clear, trustworthy explanation before joining RN Finds.",
      ],
    },
    {
      heading: "What you get inside RN Finds",
      paragraphs: [
        "Members share daily finds, QC photos, spreadsheet product links, sneaker finds, streetwear picks, and multi-agent checkout URLs. The channel is active enough that many buyers treat it as a supplement to static spreadsheets.",
        "You will see LitBuy links often because they are verified on this catalog, but the Telegram feed intentionally supports MuleBuy, OopBuy, ACBuy, and Kakobuy when a listing fits that workflow.",
      ],
      links: [
        { href: "/rn-finds", label: "About RN Finds" },
        { href: "/spreadsheet-telegram", label: "Spreadsheet Telegram" },
      ],
    },
    {
      heading: "Agent-specific Telegram guides",
      paragraphs: [
        "Each supported agent has its own landing page explaining how RN Finds covers that platform — from MuleBuy spreadsheet Telegram searches to Kakobuy QC photo threads.",
        "Use these pages if you arrived from a specific search like OopBuy finds Telegram or ACBuy sneaker finds rather than a generic community query.",
      ],
      links: AGENT_TELEGRAM_LINKS,
    },
    {
      heading: "Best practices before you join",
      paragraphs: [
        "Telegram communities move quickly. Save products to your wishlist on LitBuy Finds when you want a stable page to revisit. Use RN Finds for discovery and discussion, then confirm price, batch, and size on your agent before paying.",
        "QC-approved finds on Telegram are community references — always request your own warehouse photos when your agent supports QC.",
      ],
      links: [
        { href: "/guides/how-to-check-qc-photos", label: "QC photo guide" },
        { href: "/trending", label: "Trending catalog" },
      ],
    },
  ],
  faqs: baseFaqs(),
  relatedLinks: [
    { href: SOCIAL_LINKS.telegram, label: `Join ${TELEGRAM_CHANNEL_NAME}` },
    ...AGENT_TELEGRAM_LINKS,
    ...HUB_LINKS.filter((l) => l.href !== "/telegram"),
  ],
};

const RN_FINDS_PAGE: TelegramSeoPageConfig = {
  slug: "rn-finds",
  path: "/rn-finds",
  title: `${TELEGRAM_CHANNEL_NAME} Telegram Community | ${TELEGRAM_MEMBER_LABEL}`,
  metaDescription: `${TELEGRAM_CHANNEL_NAME} (${TELEGRAM_HANDLE}) is a ${TELEGRAM_MEMBER_LABEL} Telegram channel for daily finds, QC photos, spreadsheet products, sneaker & fashion picks, and LitBuy, MuleBuy, OopBuy, ACBuy, and Kakobuy links.`,
  badge: TELEGRAM_CHANNEL_NAME,
  h1: `${TELEGRAM_CHANNEL_NAME} on Telegram`,
  intro: `${TELEGRAM_CHANNEL_NAME} is the Telegram channel behind many LitBuy Finds community updates — ${TELEGRAM_MEMBER_LABEL} sharing agent finds, spreadsheet rows, QC references, and daily sneaker and fashion discoveries. It is a multi-agent shopping community, not a single-brand broadcast.`,
  focus: "hub",
  keywords: [
    "rn finds telegram",
    "rn finds",
    "litbuy telegram community",
    "best finds telegram",
    "shopping agent telegram community",
    "qc finds telegram",
  ],
  sections: [
    {
      heading: `Who ${TELEGRAM_CHANNEL_NAME} is for`,
      paragraphs: [
        "If you buy through Chinese marketplaces with a shopping agent, you probably want two things: a searchable catalog and a live feed when new heat drops. LitBuy Finds covers the catalog; RN Finds covers the feed.",
        "The audience is international buyers who want QC context, spreadsheet-style product links, and honest discussion before they commit to a haul.",
      ],
    },
    {
      heading: "Multi-agent support",
      paragraphs: [
        `RN Finds supports ${AGENT_LIST_TEXT}. LitBuy is often highlighted on this website because links are verified here, but Telegram posts are not limited to one agent.`,
        "That flexibility matters when you compare shipping lines, coupons, or warehouse policies across platforms.",
      ],
      links: AGENT_TELEGRAM_LINKS,
    },
    {
      heading: "Daily content you can expect",
      paragraphs: [
        "Typical posts include new spreadsheet rows, QC photo finds, sneaker release-style picks, budget fashion finds, and direct agent product links. Some days skew toward shoes; other days toward jackets, bags, or accessories.",
        "Treat the channel as a discovery accelerator — not a replacement for reading listing details on your agent checkout page.",
      ],
      links: [
        { href: "/sneaker-finds-telegram", label: "Sneaker finds" },
        { href: "/fashion-finds-telegram", label: "Fashion finds" },
      ],
    },
    {
      heading: "How RN Finds connects to LitBuy Finds",
      paragraphs: [
        "This website indexes thousands of products with photos, categories, and buy buttons. When a Telegram post references a find you like, search the product name or brand here to open a stable page with QC status and related picks.",
        "We built RN Finds SEO pages separately so Google can surface Telegram-related searches without turning the homepage into a community landing page.",
      ],
      links: [
        { href: "/telegram", label: "Telegram hub" },
        { href: "/litbuy-finds", label: "LitBuy finds catalog" },
      ],
    },
  ],
  faqs: baseFaqs(),
  relatedLinks: [
    { href: SOCIAL_LINKS.telegram, label: "Join on Telegram" },
    { href: "/telegram", label: "Telegram guides hub" },
    ...AGENT_TELEGRAM_LINKS,
    { href: "/agent-finds-telegram", label: "Agent finds Telegram" },
  ],
};

const TOPIC_PAGES: Record<string, TelegramSeoPageConfig> = {
  "agent-finds-telegram": {
    slug: "agent-finds-telegram",
    path: "/agent-finds-telegram",
    title: `Agent Finds Telegram | ${TELEGRAM_CHANNEL_NAME}`,
    metaDescription: `Join ${TELEGRAM_CHANNEL_NAME} — ${TELEGRAM_MEMBER_LABEL} sharing agent finds, shopping agent Telegram links, QC photos, spreadsheet rows, sneaker picks, and fashion finds for LitBuy, MuleBuy, OopBuy, ACBuy, and Kakobuy.`,
    badge: "Agent finds",
    h1: "Agent finds on Telegram",
    intro: `Searching for agent finds Telegram, shopping agent Telegram communities, or the best agent finds community? ${TELEGRAM_CHANNEL_NAME} brings ${TELEGRAM_MEMBER_LABEL} together around daily product links, QC references, and spreadsheet updates across ${AGENT_LIST_TEXT}.`,
    focus: "topic",
    keywords: [
      "agent finds telegram",
      "shopping agent telegram",
      "best agent telegram",
      "best shopping agent telegram",
      "reps finds telegram",
      "agent product links",
    ],
    sections: [
      {
        heading: "What “agent finds” means on Telegram",
        paragraphs: [
          "Agent finds are marketplace listings formatted for shopping agents — Weidian, Taobao, or 1688 URLs that open on LitBuy, MuleBuy, OopBuy, ACBuy, or Kakobuy. On Telegram, those links travel fast with short notes about batch, price, or QC.",
          "RN Finds is designed as a multi-agent feed so you can compare agents without subscribing to five separate channels.",
        ],
      },
      {
        heading: "Why a community beats solo spreadsheet scrolling",
        paragraphs: [
          "Static spreadsheets go stale. A daily finds Telegram channel surfaces restocks, price drops, and new QC photos in context — often with comments from buyers who already received the item.",
          "That social proof is especially valuable for sneaker finds and fashion finds where small batch differences matter.",
        ],
        links: [
          { href: "/spreadsheet-telegram", label: "Spreadsheet Telegram" },
          { href: "/qc-finds-telegram", label: "QC finds Telegram" },
        ],
      },
      {
        heading: "Supported agents in one channel",
        paragraphs: [
          `RN Finds supports ${AGENT_LIST_TEXT}. LitBuy may be recommended on LitBuy Finds for verified catalog links, but Telegram intentionally remains agent-neutral so members can share what works for their country and budget.`,
          "Use agent-specific guides if you only care about one platform — for example MuleBuy spreadsheet Telegram or Kakobuy QC photo finds.",
        ],
        links: AGENT_TELEGRAM_LINKS,
      },
      {
        heading: "Join with realistic expectations",
        paragraphs: [
          "Telegram is great for speed; this website is great for structure. Combine both: discover on RN Finds, then open the product page here to check category, price history, and related QC-approved picks before you buy.",
          "No community post replaces your agent’s live listing — always confirm size, color, and shipping before payment.",
        ],
      },
    ],
    faqs: baseFaqs(),
    relatedLinks: [
      { href: SOCIAL_LINKS.telegram, label: `Join ${TELEGRAM_MEMBER_LABEL}` },
      ...AGENT_TELEGRAM_LINKS,
      { href: "/telegram", label: "Telegram hub" },
    ],
  },
  "spreadsheet-telegram": {
    slug: "spreadsheet-telegram",
    path: "/spreadsheet-telegram",
    title: `Spreadsheet Finds Telegram | ${TELEGRAM_CHANNEL_NAME}`,
    metaDescription: `Get spreadsheet Telegram updates from ${TELEGRAM_CHANNEL_NAME} — ${TELEGRAM_MEMBER_LABEL} sharing spreadsheet finds, LitBuy rows, agent product links, QC photos, sneaker picks, and fashion finds daily.`,
    badge: "Spreadsheet finds",
    h1: "Spreadsheet finds on Telegram",
    intro: `Spreadsheet Telegram groups are how many buyers first discover reps finds — rows of links, thumbnails, and QC notes. ${TELEGRAM_CHANNEL_NAME} turns that spreadsheet energy into a ${TELEGRAM_MEMBER_LABEL} channel with daily updates across LitBuy, MuleBuy, OopBuy, ACBuy, and Kakobuy.`,
    focus: "topic",
    keywords: [
      "spreadsheet telegram",
      "spreadsheet finds telegram",
      "litbuy spreadsheet telegram",
      "mulebuy spreadsheet telegram",
      "spreadsheet updates",
    ],
    sections: [
      {
        heading: "From static sheets to live Telegram rows",
        paragraphs: [
          "Traditional spreadsheets are powerful but hard to browse on mobile and painful to search. Telegram spreadsheet finds push new rows to you — often with QC photos and agent links attached.",
          "RN Finds sits in the middle: community speed on Telegram, structured catalog pages on LitBuy Finds.",
        ],
      },
      {
        heading: "Agent spreadsheet Telegram variations",
        paragraphs: [
          "Searchers look for LitBuy spreadsheet Telegram, MuleBuy spreadsheet Telegram, OopBuy spreadsheet Telegram, and similar phrases because each agent formats links differently. RN Finds includes multi-agent rows so you are not locked to one template.",
          "When you need a stable product page, search the item here after you spot it on Telegram.",
        ],
        links: [
          { href: "/litbuy-spreadsheet", label: "LitBuy spreadsheet guide" },
          { href: "/collections/litbuy-spreadsheet-alternative", label: "Sheet alternative" },
        ],
      },
      {
        heading: "QC and pricing context in spreadsheet posts",
        paragraphs: [
          "Good spreadsheet Telegram posts include more than a URL — they note batch, seller reputation, approximate USD price, and whether QC photos exist. RN Finds members often add that context in replies.",
          "Use QC-approved finds as a filter, not a promise. Request fresh warehouse photos when your agent allows it.",
        ],
        links: [{ href: "/qc-finds-telegram", label: "QC finds Telegram" }],
      },
      {
        heading: "Categories that move fastest",
        paragraphs: [
          "Sneaker spreadsheet rows and fashion spreadsheet rows tend to get the most engagement — Jordans, Dunks, puffers, hoodies, and crossbody bags. RN Finds mixes categories so the feed stays useful even if you are not a sneakerhead.",
        ],
        links: [
          { href: "/sneaker-finds-telegram", label: "Sneaker finds" },
          { href: "/fashion-finds-telegram", label: "Fashion finds" },
        ],
      },
    ],
    faqs: baseFaqs(),
    relatedLinks: [
      { href: SOCIAL_LINKS.telegram, label: "Join for spreadsheet updates" },
      { href: "/telegram-litbuy", label: "LitBuy spreadsheet Telegram" },
      { href: "/telegram-mulebuy", label: "MuleBuy spreadsheet Telegram" },
      { href: "/telegram", label: "Telegram hub" },
    ],
  },
  "qc-finds-telegram": {
    slug: "qc-finds-telegram",
    path: "/qc-finds-telegram",
    title: `QC Finds Telegram | ${TELEGRAM_CHANNEL_NAME}`,
    metaDescription: `Find QC finds Telegram updates in ${TELEGRAM_CHANNEL_NAME} — ${TELEGRAM_MEMBER_LABEL} sharing QC-approved finds, warehouse photos, agent links, sneaker QC, and fashion QC references daily.`,
    badge: "QC finds",
    h1: "QC finds on Telegram",
    intro: `QC finds Telegram channels help buyers see warehouse photos before they ship. ${TELEGRAM_CHANNEL_NAME} (${TELEGRAM_HANDLE}) shares QC-approved references, community QC albums, and agent links for ${AGENT_LIST_TEXT} with ${TELEGRAM_MEMBER_LABEL}.`,
    focus: "topic",
    keywords: [
      "qc finds telegram",
      "qc approved finds telegram",
      "litbuy qc telegram",
      "qc photos telegram",
      "warehouse photos telegram",
    ],
    sections: [
      {
        heading: "What QC finds mean in a Telegram feed",
        paragraphs: [
          "QC (quality check) photos are taken at the agent warehouse before international shipping. On Telegram, members repost QC albums to help others judge stitching, materials, and shape.",
          "RN Finds highlights QC photo finds alongside product links so you can decide whether to open a listing.",
        ],
      },
      {
        heading: "QC-approved finds vs. your own QC",
        paragraphs: [
          "A post labeled QC-approved means someone in the community already received photos for that batch or seller. It is still smart to request your own QC when purchasing — batches change and listings update.",
          "LitBuy Finds marks catalog items with QC references when available; Telegram adds real-time discussion around those references.",
        ],
        links: [
          { href: "/best-qc-approved-finds", label: "QC-approved catalog" },
          { href: "/guides/how-to-check-qc-photos", label: "How to check QC" },
        ],
      },
      {
        heading: "Sneaker QC and fashion QC threads",
        paragraphs: [
          "Sneaker QC finds get the most scrutiny — toe box shape, suede movement, logo placement. Fashion QC covers embroidery, zippers, and hardware on jackets and bags.",
          "RN Finds mixes both so you can follow QC context for the categories you actually buy.",
        ],
        links: [{ href: "/sneaker-finds-telegram", label: "Sneaker QC finds" }],
      },
      {
        heading: "Multi-agent QC links",
        paragraphs: [
          `Because RN Finds supports ${AGENT_LIST_TEXT}, QC posts may link to different agents depending on who shot the photos. The QC is about the physical item; the agent link is about checkout convenience.`,
        ],
        links: AGENT_TELEGRAM_LINKS,
      },
    ],
    faqs: baseFaqs(),
    relatedLinks: [
      { href: SOCIAL_LINKS.telegram, label: "Join for QC updates" },
      { href: "/litbuy-qc", label: "LitBuy QC guide" },
      { href: "/telegram", label: "Telegram hub" },
    ],
  },
  "sneaker-finds-telegram": {
    slug: "sneaker-finds-telegram",
    path: "/sneaker-finds-telegram",
    title: `Sneaker Finds Telegram | ${TELEGRAM_CHANNEL_NAME}`,
    metaDescription: `Discover sneaker finds Telegram posts in ${TELEGRAM_CHANNEL_NAME} — ${TELEGRAM_MEMBER_LABEL} sharing shoe finds, sneaker QC photos, spreadsheet rows, and agent links for LitBuy, MuleBuy, OopBuy, ACBuy, and Kakobuy.`,
    badge: "Sneaker finds",
    h1: "Sneaker finds on Telegram",
    intro: `Sneaker finds Telegram channels are where Jordan, Dunk, Yeezy, and New Balance links spread fastest. ${TELEGRAM_CHANNEL_NAME} delivers daily shoe finds, sneaker QC references, and agent product links to ${TELEGRAM_MEMBER_LABEL} across multiple shopping agents.`,
    focus: "topic",
    keywords: [
      "sneaker finds telegram",
      "shoe finds telegram",
      "rep sneaker telegram",
      "litbuy sneaker telegram",
      "sneaker qc telegram",
    ],
    sections: [
      {
        heading: "Why sneaker buyers use Telegram",
        paragraphs: [
          "Sneaker batches change quietly — the same listing photo can map to different quality tiers. Telegram sneaker finds move with commentary about which batch a link points to and whether recent QC looked good.",
          "RN Finds concentrates that chatter into one channel instead of scattered Discord threads and dead spreadsheet tabs.",
        ],
      },
      {
        heading: "Shoe finds across agents",
        paragraphs: [
          `Popular searches include LitBuy sneaker finds, MuleBuy sneaker finds, and Kakobuy sneaker QC. RN Finds supports ${AGENT_LIST_TEXT}, so you can follow shoe links even if you switch agents between hauls.`,
        ],
        links: [
          { href: "/best-rep-sneakers", label: "Best rep sneakers" },
          { href: "/categories/shoes", label: "Shoe catalog" },
        ],
      },
      {
        heading: "QC photos for sneakers",
        paragraphs: [
          "Always look for recent sneaker QC photos — toe box, heel cup, and outsole matter more than the seller’s marketing render. Telegram is ideal for sharing multi-angle albums quickly.",
          "Pair Telegram discovery with LitBuy Finds product pages when you want related picks in the same price band.",
        ],
        links: [{ href: "/qc-finds-telegram", label: "QC finds Telegram" }],
      },
      {
        heading: "Streetwear crossovers",
        paragraphs: [
          "Many sneakerheads also want hoodies, track pants, and bags in the same haul. RN Finds mixes sneaker finds with broader streetwear finds so you can build a coherent cart.",
        ],
        links: [{ href: "/fashion-finds-telegram", label: "Fashion finds Telegram" }],
      },
    ],
    faqs: baseFaqs(),
    relatedLinks: [
      { href: SOCIAL_LINKS.telegram, label: "Join for sneaker drops" },
      { href: "/telegram-litbuy", label: "LitBuy sneaker Telegram" },
      { href: "/telegram", label: "Telegram hub" },
    ],
  },
  "fashion-finds-telegram": {
    slug: "fashion-finds-telegram",
    path: "/fashion-finds-telegram",
    title: `Fashion Finds Telegram | ${TELEGRAM_CHANNEL_NAME}`,
    metaDescription: `Explore fashion finds Telegram updates from ${TELEGRAM_CHANNEL_NAME} — ${TELEGRAM_MEMBER_LABEL} sharing clothing finds, streetwear picks, jacket rows, QC photos, and agent links daily.`,
    badge: "Fashion finds",
    h1: "Fashion finds on Telegram",
    intro: `Fashion finds Telegram communities cover jackets, hoodies, tees, bags, and accessories — not just sneakers. ${TELEGRAM_CHANNEL_NAME} posts daily clothing finds, streetwear picks, and QC references for ${AGENT_LIST_TEXT} with ${TELEGRAM_MEMBER_LABEL}.`,
    focus: "topic",
    keywords: [
      "fashion finds telegram",
      "clothing finds telegram",
      "streetwear finds telegram",
      "litbuy fashion telegram",
      "fashion qc telegram",
    ],
    sections: [
      {
        heading: "Clothing finds beyond hype sneakers",
        paragraphs: [
          "Fashion Telegram feeds highlight puffers, fleeces, denim, and designer-inspired pieces that never hit mainstream sneaker channels. RN Finds balances shoe and clothing finds so the channel stays useful year-round.",
          "Expect spreadsheet-style rows with short notes on materials, known batches, and approximate ship weight.",
        ],
      },
      {
        heading: "Streetwear finds and seasonal drops",
        paragraphs: [
          "Streetwear finds Telegram posts spike before colder months — jackets and hoodies dominate, then bags and belts follow. Members flag when a seller restocks a popular fleece or when QC for a new batch lands.",
        ],
        links: [
          { href: "/top-streetwear-finds", label: "Streetwear catalog" },
          { href: "/categories/jackets", label: "Jacket finds" },
        ],
      },
      {
        heading: "QC for fashion pieces",
        paragraphs: [
          "Fashion QC focuses on embroidery alignment, zipper brands, hardware color, and lining materials. Telegram makes it easy to compare two batches side by side in an album.",
          "Combine RN Finds posts with LitBuy Finds filters when you want QC-approved catalog items only.",
        ],
        links: [{ href: "/qc-finds-telegram", label: "QC finds Telegram" }],
      },
      {
        heading: "Agent links for fashion hauls",
        paragraphs: [
          `Fashion hauls often span multiple sellers. Because RN Finds supports ${AGENT_LIST_TEXT}, you can consolidate discussion even if links point to different agents — handy when you are optimizing shipping lines.`,
        ],
        links: AGENT_TELEGRAM_LINKS,
      },
    ],
    faqs: baseFaqs(),
    relatedLinks: [
      { href: SOCIAL_LINKS.telegram, label: "Join for fashion drops" },
      { href: "/top-streetwear-finds", label: "Streetwear catalog" },
      { href: "/telegram", label: "Telegram hub" },
    ],
  },
};

export const TELEGRAM_SEO_PAGES: Record<string, TelegramSeoPageConfig> = {
  telegram: HUB_PAGE,
  "rn-finds": RN_FINDS_PAGE,
  "acbuy-telegram": buildAgentPage(
    "acbuy-telegram",
    "ACBuy",
    "/acbuy-finds",
    "ACBuy (formerly AllChinaBuy) buyers look for English-friendly community links — RN Finds shares ACBuy agent product links with QC and pricing discussion.",
    [
      "ACBuy Telegram searches often combine spreadsheet culture with newer buyers asking for QC help — RN Finds bridges both needs.",
    ]
  ),
  ...TOPIC_PAGES,
};

export const TELEGRAM_SEO_SLUGS = Object.keys(TELEGRAM_SEO_PAGES);

export function getTelegramSeoPage(
  slug: string
): TelegramSeoPageConfig | undefined {
  return TELEGRAM_SEO_PAGES[slug];
}
