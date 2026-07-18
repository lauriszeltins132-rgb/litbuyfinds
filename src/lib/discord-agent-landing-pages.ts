import { buildDiscordFooterLinks } from "./agent-seo-shared";
import { SOCIAL_LINKS } from "./constants";

export type DiscordAgentLandingConfig = {
  slug: string;
  path: string;
  agentName: string;
  title: string;
  metaDescription: string;
  h1: string;
  intro: string;
  ctaLabel: string;
  discordUrl: string;
  keywords: string[];
  footerLinks: { href: string; label: string }[];
};

const AGENTS = [
  { slug: "discord-litbuy", agentName: "LitBuy" },
  { slug: "discord-mulebuy", agentName: "MuleBuy" },
  { slug: "discord-hipobuy", agentName: "HipoBuy" },
  { slug: "discord-oopbuy", agentName: "OopBuy" },
  { slug: "discord-kakobuy", agentName: "Kakobuy" },
] as const;

function buildAgentConfig(
  slug: string,
  agentName: string
): DiscordAgentLandingConfig {
  const agentLower = agentName.toLowerCase();
  const agentSlug = slug.replace("discord-", "");
  const isLitBuy = agentSlug === "litbuy";

  return {
    slug,
    path: `/${slug}`,
    agentName,
    title: isLitBuy
      ? "LitBuy Discord – Community & QC Updates"
      : `${agentName} Discord | Join ${agentName} Server`,
    metaDescription: isLitBuy
      ? "Join the official LitBuy Discord server for verified finds, spreadsheet updates, and community discussions."
      : `Join the official ${agentName} Discord to get verified finds, QC photos, spreadsheet updates, and community discussion.`,
    h1: `Join ${agentName} Discord`,
    intro: isLitBuy
      ? "Chat with the LitBuy community, get spreadsheet updates, QC feedback, and verified find alerts on Discord. Join the official LitBuy Discord server below."
      : `Stay updated with ${agentName} verified finds, QC photos, spreadsheet links, and chat with the community. Click below to join the official Discord.`,
    ctaLabel: `Join ${agentName} Discord ✅`,
    discordUrl: SOCIAL_LINKS.discord,
    keywords: isLitBuy
      ? [
          "litbuy discord",
          "discord litbuy",
          "litbuy finds discord",
          "litbuy spreadsheet discord",
          "litbuy community discord",
        ]
      : [
          `discord ${agentLower}`,
          `${agentLower} discord`,
          `${agentLower} finds discord`,
        ],
    footerLinks: buildDiscordFooterLinks(agentSlug),
  };
}

export const DISCORD_AGENT_LANDING_PAGES: Record<
  string,
  DiscordAgentLandingConfig
> = Object.fromEntries(
  AGENTS.map((agent) => [
    agent.slug,
    buildAgentConfig(agent.slug, agent.agentName),
  ])
);

export const DISCORD_AGENT_LANDING_SLUGS = AGENTS.map((agent) => agent.slug);

export function getDiscordAgentLandingPage(
  slug: string
): DiscordAgentLandingConfig | undefined {
  return DISCORD_AGENT_LANDING_PAGES[slug];
}
