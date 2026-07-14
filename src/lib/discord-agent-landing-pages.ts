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

  return {
    slug,
    path: `/${slug}`,
    agentName,
    title: `${agentName} Discord | Join ${agentName} Server`,
    metaDescription: `Join the official ${agentName} Discord to get verified finds, QC photos, spreadsheet updates, and community discussion.`,
    h1: `Join ${agentName} Discord`,
    intro: `Stay updated with ${agentName} verified finds, QC photos, spreadsheet links, and chat with the community. Click below to join the official Discord.`,
    ctaLabel: `Join ${agentName} Discord ✅`,
    discordUrl: SOCIAL_LINKS.discord,
    keywords: [
      `discord ${agentLower}`,
      `${agentLower} discord`,
      `${agentLower} finds discord`,
    ],
    footerLinks: [
      { href: "/", label: "LitBuy Finds homepage" },
      ...AGENTS.filter((agent) => agent.slug !== slug).map((agent) => ({
        href: `/${agent.slug}`,
        label: `${agent.agentName} Discord`,
      })),
    ],
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
