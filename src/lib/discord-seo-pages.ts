import { SEO_AGENTS, type SeoAgent } from "./seo-agents";

export type DiscordSeoSection = {
  heading: string;
  level?: 2 | 3;
  paragraphs: string[];
  links?: { href: string; label: string }[];
};

export type DiscordSeoPageConfig = {
  slug: string;
  path: string;
  agentId: SeoAgent["id"];
  agentName: string;
  agentSlug: string;
  title: string;
  metaDescription: string;
  imageAlt: string;
  badge: string;
  h1: string;
  intro: string;
  keywords: string[];
  sections: DiscordSeoSection[];
  faqs: { question: string; answer: string }[];
  relatedLinks: { href: string; label: string }[];
};

function buildDiscordPage(agent: SeoAgent): DiscordSeoPageConfig {
  const slug = `discord-${agent.slug}`;
  const path = `/${slug}`;
  const otherAgents = SEO_AGENTS.filter((candidate) => candidate.id !== agent.id);
  const couponPath = `/${agent.slug}-coupons`;

  return {
    slug,
    path,
    agentId: agent.id,
    agentName: agent.name,
    agentSlug: agent.slug,
    title: `${agent.name} Discord – Community & QC Updates`,
    metaDescription: `Join the official ${agent.name} Discord server for verified finds, spreadsheet updates, and community discussion.`,
    imageAlt: `${agent.name} Discord community — QC updates, spreadsheet finds, and verified ${agent.name} links`,
    badge: `${agent.name} · Discord`,
    h1: `Join ${agent.name} Discord`,
    intro: `Looking for the official ${agent.name} Discord server? Join the community for daily QC updates, spreadsheet-style finds, verified ${agent.name} links, and buyer discussion — all in one place.`,
    keywords: [
      `${agent.slug} discord`,
      `${agent.name.toLowerCase()} discord server`,
      `${agent.slug} discord community`,
      `${agent.slug} qc updates`,
      `${agent.slug} spreadsheet discord`,
      "shopping agent discord",
    ],
    sections: [
      {
        heading: `Why join the ${agent.name} Discord`,
        paragraphs: [
          `The ${agent.name} Discord server brings buyers together to share QC photos, spreadsheet-style product rows, and honest feedback before you check out on ${agent.name}.`,
          `Members post daily finds, batch comparisons, and shipping tips so you are not guessing which listings are worth opening.`,
        ],
        links: [
          { href: agent.findsPath, label: `Browse ${agent.name} finds` },
          { href: agent.spreadsheetPath, label: `${agent.name} spreadsheet` },
        ],
      },
      {
        heading: "QC updates and community verification",
        paragraphs: [
          `QC (quality check) photos shared in the ${agent.name} Discord help you judge stitching, materials, and batch quality before your order ships internationally.`,
          `Treat community QC as a helpful reference — always request your own warehouse photos through ${agent.name} for the exact batch you plan to buy.`,
        ],
        links: [
          { href: "/guides/how-to-check-qc-photos", label: "How to check QC photos" },
        ],
      },
      {
        heading: "Spreadsheet updates without the scroll fatigue",
        paragraphs: [
          `Instead of scrolling a static spreadsheet, the ${agent.name} Discord pushes new rows, restocks, and price changes as members spot them.`,
          `Pair Discord discovery with the searchable ${agent.name} spreadsheet page on LitBuy Finds when you want a stable, shareable product view.`,
        ],
        links: [
          { href: agent.spreadsheetPath, label: `${agent.name} spreadsheet guide` },
        ],
      },
      {
        heading: "Coupons and other agent communities",
        paragraphs: [
          `Check the latest ${agent.name} coupons before you check out, and browse Discord communities for other supported agents if you shop across multiple platforms.`,
        ],
        links: [
          { href: couponPath, label: `${agent.name} coupons` },
          ...otherAgents.map((other) => ({
            href: other.discordPath,
            label: `${other.name} Discord`,
          })),
        ],
      },
    ],
    faqs: [
      {
        question: `Is this the official ${agent.name} Discord invite?`,
        answer: `Yes — the button on this page links directly to the official ${agent.name} Discord community server.`,
      },
      {
        question: `What can I find in the ${agent.name} Discord?`,
        answer: `Expect daily QC photos, spreadsheet-style product links, restock alerts, and buyer discussion focused on ${agent.name} orders.`,
      },
      {
        question: `Do I need a ${agent.name} account to join the Discord?`,
        answer: `No. Anyone can join the server, but you will need a ${agent.name} account to check out on listings members share there.`,
      },
      {
        question: "Does LitBuy Finds only support one agent?",
        answer:
          "No. LitBuy Finds supports LitBuy, Kakobuy, MuleBuy, HipoBuy, and OopBuy. LitBuy is recommended for verified catalog links, but each agent has its own Discord, coupon, and spreadsheet page.",
      },
    ],
    relatedLinks: [
      { href: "/", label: "LitBuy Finds home" },
      { href: agent.findsPath, label: `${agent.name} finds` },
      { href: agent.spreadsheetPath, label: `${agent.name} spreadsheet` },
      { href: couponPath, label: `${agent.name} coupons` },
      ...otherAgents.map((other) => ({
        href: other.discordPath,
        label: `${other.name} Discord`,
      })),
    ],
  };
}

export const DISCORD_SEO_PAGES: Record<string, DiscordSeoPageConfig> = Object.fromEntries(
  SEO_AGENTS.map((agent) => {
    const page = buildDiscordPage(agent);
    return [page.slug, page];
  })
);

export const DISCORD_SEO_SLUGS = Object.keys(DISCORD_SEO_PAGES);

export function getDiscordSeoPage(slug: string): DiscordSeoPageConfig | undefined {
  return DISCORD_SEO_PAGES[slug];
}
