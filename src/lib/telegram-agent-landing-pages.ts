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
  useSearchActionSchema?: boolean;
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
  const isLitBuy = agentSlug === "litbuy";

  return {
    slug,
    path: `/${slug}`,
    agentName,
    title: isLitBuy
      ? "LitBuy Telegram – Daily QC & Spreadsheet Finds"
      : `${agentName} Telegram | Join ${agentName} Channel`,
    metaDescription: isLitBuy
      ? "Join the official LitBuy Telegram channel to receive daily QC photos, spreadsheet updates, and verified finds."
      : `Join the official ${agentName} Telegram to get verified finds, QC photos, and spreadsheet updates instantly.`,
    h1: `Join ${agentName} Telegram`,
    intro: isLitBuy
      ? "Get daily LitBuy QC photos, spreadsheet row updates, and verified finds pushed straight to Telegram. Tap below to join the official LitBuy Telegram channel."
      : `Stay updated with ${agentName} verified finds, QC photos, and spreadsheet links. Click below to join the official Telegram.`,
    ctaLabel: `Join ${agentName} Telegram ✅`,
    telegramUrl: SOCIAL_LINKS.telegram,
    keywords: isLitBuy
      ? [
          "litbuy telegram",
          "telegram litbuy",
          "litbuy finds telegram",
          "litbuy spreadsheet telegram",
          "litbuy qc telegram",
        ]
      : [
          `telegram ${agentLower}`,
          `${agentLower} telegram`,
          `${agentLower} finds telegram`,
        ],
    footerLinks: buildTelegramFooterLinks(agentSlug),
    useSearchActionSchema: isLitBuy,
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
