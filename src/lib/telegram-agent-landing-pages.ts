import type { StaticPageSection } from "./static-pages";
import { buildTelegramFooterLinks } from "./agent-seo-shared";
import { AGENT_RESOURCE_AGENTS } from "./agent-resource-agents";
import {
  buildAgentTelegramFaqs,
  buildAgentTelegramIntro,
  buildAgentTelegramMeta,
  buildAgentTelegramSections,
} from "./agent-resource-content";
import { SOCIAL_LINKS } from "./constants";

export type TelegramAgentLandingConfig = {
  slug: string;
  path: string;
  agentName: string;
  title: string;
  metaDescription: string;
  h1: string;
  intro: string;
  ctaLabel: string;
  telegramUrl: string;
  keywords: string[];
  sections: StaticPageSection[];
  faqs: { question: string; answer: string }[];
  footerLinks: { href: string; label: string }[];
};

const LEGACY_AGENTS = [
  { slug: "telegram-litbuy", agentName: "LitBuy" },
  { slug: "telegram-mulebuy", agentName: "MuleBuy" },
] as const;

function buildLegacyAgentConfig(
  slug: string,
  agentName: string
): TelegramAgentLandingConfig {
  const agentLower = agentName.toLowerCase();
  const agentSlug = slug.replace("telegram-", "");

  return {
    slug,
    path: `/${slug}`,
    agentName,
    title: `${agentName} Telegram | Join ${agentName} Channel`,
    metaDescription: `Join the ${agentName} Telegram community for verified finds, QC photos, and spreadsheet updates. Independent guide from LitBuy Finds.`,
    h1: `Join ${agentName} Telegram`,
    intro: `Stay updated with ${agentName} verified finds, QC photos, and spreadsheet links. Click below to join the community Telegram channel used by LitBuy Finds readers.`,
    ctaLabel: `Join ${agentName} Telegram ✅`,
    telegramUrl: SOCIAL_LINKS.telegram,
    keywords: [
      `telegram ${agentLower}`,
      `${agentLower} telegram`,
      `${agentLower} finds telegram`,
    ],
    sections: [],
    faqs: [],
    footerLinks: buildTelegramFooterLinks(agentSlug),
  };
}

function buildResourceAgentConfig(
  agent: (typeof AGENT_RESOURCE_AGENTS)[number]
): TelegramAgentLandingConfig {
  const slug = `telegram-${agent.slug}`;
  const meta = buildAgentTelegramMeta(agent);

  return {
    slug,
    path: `/${slug}`,
    agentName: agent.name,
    title: meta.title,
    metaDescription: meta.metaDescription,
    h1: meta.h1,
    intro: buildAgentTelegramIntro(agent),
    ctaLabel: `Join ${agent.name} Telegram`,
    telegramUrl: SOCIAL_LINKS.telegram,
    keywords: meta.keywords,
    sections: buildAgentTelegramSections(agent),
    faqs: buildAgentTelegramFaqs(agent),
    footerLinks: buildTelegramFooterLinks(agent.slug),
  };
}

export const TELEGRAM_AGENT_LANDING_PAGES: Record<
  string,
  TelegramAgentLandingConfig
> = Object.fromEntries([
  ...LEGACY_AGENTS.map((agent) => [
    agent.slug,
    buildLegacyAgentConfig(agent.slug, agent.agentName),
  ]),
  ...AGENT_RESOURCE_AGENTS.map((agent) => [
    `telegram-${agent.slug}`,
    buildResourceAgentConfig(agent),
  ]),
]);

export const TELEGRAM_AGENT_LANDING_SLUGS = Object.keys(
  TELEGRAM_AGENT_LANDING_PAGES
);

export function getTelegramAgentLandingPage(
  slug: string
): TelegramAgentLandingConfig | undefined {
  return TELEGRAM_AGENT_LANDING_PAGES[slug];
}
