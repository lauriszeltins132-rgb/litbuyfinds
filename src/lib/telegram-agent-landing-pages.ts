import { buildTelegramFooterLinks } from "./agent-seo-shared";
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
  footerLinks: { href: string; label: string }[];
};

const AGENTS = [
  { slug: "telegram-litbuy", agentName: "LitBuy" },
  { slug: "telegram-mulebuy", agentName: "MuleBuy" },
  { slug: "telegram-hipobuy", agentName: "HipoBuy" },
  { slug: "telegram-oopbuy", agentName: "OopBuy" },
  { slug: "telegram-kakobuy", agentName: "Kakobuy" },
] as const;

function buildAgentConfig(
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
    metaDescription: `Join the official ${agentName} Telegram to get verified finds, QC photos, and spreadsheet updates instantly.`,
    h1: `Join ${agentName} Telegram`,
    intro: `Stay updated with ${agentName} verified finds, QC photos, and spreadsheet links. Click below to join the official Telegram.`,
    ctaLabel: `Join ${agentName} Telegram ✅`,
    telegramUrl: SOCIAL_LINKS.telegram,
    keywords: [
      `telegram ${agentLower}`,
      `${agentLower} telegram`,
      `${agentLower} finds telegram`,
    ],
    footerLinks: buildTelegramFooterLinks(agentSlug),
  };
}

export const TELEGRAM_AGENT_LANDING_PAGES: Record<
  string,
  TelegramAgentLandingConfig
> = Object.fromEntries(
  AGENTS.map((agent) => [
    agent.slug,
    buildAgentConfig(agent.slug, agent.agentName),
  ])
);

export const TELEGRAM_AGENT_LANDING_SLUGS = AGENTS.map((agent) => agent.slug);

export function getTelegramAgentLandingPage(
  slug: string
): TelegramAgentLandingConfig | undefined {
  return TELEGRAM_AGENT_LANDING_PAGES[slug];
}
