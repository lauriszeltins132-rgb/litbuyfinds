import type { StaticPageSection } from "./static-pages";
import { buildDiscordFooterLinks } from "./agent-seo-shared";
import { AGENT_RESOURCE_AGENTS } from "./agent-resource-agents";
import {
  buildAgentDiscordFaqs,
  buildAgentDiscordIntro,
  buildAgentDiscordMeta,
  buildAgentDiscordSections,
} from "./agent-resource-content";
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
  sections: StaticPageSection[];
  faqs: { question: string; answer: string }[];
  footerLinks: { href: string; label: string }[];
};

const LEGACY_AGENTS = [
  { slug: "discord-litbuy", agentName: "LitBuy" },
  { slug: "discord-mulebuy", agentName: "MuleBuy" },
] as const;

function buildLegacyAgentConfig(
  slug: string,
  agentName: string
): DiscordAgentLandingConfig {
  const agentLower = agentName.toLowerCase();
  const agentSlug = slug.replace("discord-", "");

  return {
    slug,
    path: `/${slug}`,
    agentName,
    title: `${agentName} Discord | Join ${agentName} Server`,
    metaDescription: `Join the ${agentName} Discord community for verified finds, QC photos, spreadsheet updates, and discussion. Independent guide from LitBuy Finds.`,
    h1: `Join ${agentName} Discord`,
    intro: `Stay updated with ${agentName} verified finds, QC photos, spreadsheet links, and community chat. Click below to join the Discord server used by LitBuy Finds readers.`,
    ctaLabel: `Join ${agentName} Discord ✅`,
    discordUrl: SOCIAL_LINKS.discord,
    keywords: [
      `discord ${agentLower}`,
      `${agentLower} discord`,
      `${agentLower} finds discord`,
    ],
    sections: [],
    faqs: [],
    footerLinks: buildDiscordFooterLinks(agentSlug),
  };
}

function buildResourceAgentConfig(
  agent: (typeof AGENT_RESOURCE_AGENTS)[number]
): DiscordAgentLandingConfig {
  const slug = `discord-${agent.slug}`;
  const meta = buildAgentDiscordMeta(agent);

  return {
    slug,
    path: `/${slug}`,
    agentName: agent.name,
    title: meta.title,
    metaDescription: meta.metaDescription,
    h1: meta.h1,
    intro: buildAgentDiscordIntro(agent),
    ctaLabel: `Join ${agent.name} Discord community ✅`,
    discordUrl: SOCIAL_LINKS.discord,
    keywords: meta.keywords,
    sections: buildAgentDiscordSections(agent),
    faqs: buildAgentDiscordFaqs(agent),
    footerLinks: buildDiscordFooterLinks(agent.slug),
  };
}

export const DISCORD_AGENT_LANDING_PAGES: Record<
  string,
  DiscordAgentLandingConfig
> = Object.fromEntries([
  ...LEGACY_AGENTS.map((agent) => [
    agent.slug,
    buildLegacyAgentConfig(agent.slug, agent.agentName),
  ]),
  ...AGENT_RESOURCE_AGENTS.map((agent) => [
    `discord-${agent.slug}`,
    buildResourceAgentConfig(agent),
  ]),
]);

export const DISCORD_AGENT_LANDING_SLUGS = Object.keys(
  DISCORD_AGENT_LANDING_PAGES
);

export function getDiscordAgentLandingPage(
  slug: string
): DiscordAgentLandingConfig | undefined {
  return DISCORD_AGENT_LANDING_PAGES[slug];
}
