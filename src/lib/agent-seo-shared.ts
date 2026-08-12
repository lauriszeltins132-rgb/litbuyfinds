import { BUYING_AGENTS } from "./agents";
import {
  LITBUY_OFFER_DESCRIPTION,
  LITBUY_OFFER_HEADLINE,
} from "./constants";

export const SEO_AGENT_IDS = [
  "litbuy",
  "oopbuy",
  "kakobuy",
  "hipobuy",
  "usfans",
  "gtbuy",
  "boonbuy",
  "mulebuy",
] as const;

export type SeoAgentId = (typeof SEO_AGENT_IDS)[number];

/** SEO-only agents removed from the active buying selector but kept for landing pages. */
type SeoAgentSource = {
  name: string;
  slug: string;
  signupUrl: string;
  description: string;
  shortLabel: string;
};

const LEGACY_SEO_AGENTS: Partial<Record<SeoAgentId, SeoAgentSource>> = {
  mulebuy: {
    name: "MuleBuy",
    slug: "mulebuy",
    signupUrl: "https://mulebuy.com/register",
    description: "Search or import finds on MuleBuy.",
    shortLabel: "MuleBuy",
  },
};

export type SeoAgentDefinition = {
  id: SeoAgentId;
  name: string;
  slug: string;
  signupUrl: string;
  findsPath: string;
  offerHeadline: string;
  offerDescription: string;
  useRegisterLink: boolean;
};

function getAgent(id: SeoAgentId) {
  const agent =
    BUYING_AGENTS.find((entry) => entry.id === id) ?? LEGACY_SEO_AGENTS[id];
  if (!agent) {
    throw new Error(`Missing SEO agent config: ${id}`);
  }
  return agent;
}

export const SEO_AGENTS: SeoAgentDefinition[] = SEO_AGENT_IDS.map((id) => {
  const agent = getAgent(id);
  const isLitBuy = id === "litbuy";

  return {
    id,
    name: agent.name,
    slug: agent.slug,
    signupUrl: agent.signupUrl,
    findsPath: `/${agent.slug}-finds`,
    offerHeadline: isLitBuy
      ? LITBUY_OFFER_HEADLINE
      : `Start shopping with ${agent.name}`,
    offerDescription: isLitBuy
      ? LITBUY_OFFER_DESCRIPTION
      : `Create a free ${agent.name} account to import finds, track orders, and save on your next haul.`,
    useRegisterLink: isLitBuy,
  };
});

export function getSeoAgent(id: SeoAgentId): SeoAgentDefinition {
  const agent = SEO_AGENTS.find((entry) => entry.id === id);
  if (!agent) {
    throw new Error(`Unknown SEO agent: ${id}`);
  }
  return agent;
}

export function getSeoAgentBySlug(slug: string): SeoAgentDefinition | undefined {
  return SEO_AGENTS.find((entry) => entry.slug === slug);
}

export function getAgentPlatformPaths(agent: SeoAgentDefinition) {
  return {
    telegram: `/telegram-${agent.slug}`,
    discord: `/discord-${agent.slug}`,
    spreadsheet: `/${agent.slug}-spreadsheet`,
    review: `/${agent.slug}-review`,
    coupons: `/${agent.slug}-coupons`,
    finds: agent.findsPath,
  };
}

export function buildTelegramFooterLinks(currentSlug: string) {
  const agent = getSeoAgentBySlug(currentSlug);
  const paths = agent ? getAgentPlatformPaths(agent) : null;

  const links = [
    { href: "/", label: "LitBuy Finds homepage" },
    { href: "/finds", label: "Finds database hub" },
    { href: "/latest-finds", label: "Latest finds" },
    { href: "/litbuy-spreadsheet", label: "LitBuy spreadsheet" },
    { href: "/litbuy-qc", label: "QC database" },
    ...SEO_AGENTS.filter((entry) => entry.slug !== currentSlug).map((entry) => ({
      href: `/telegram-${entry.slug}`,
      label: `${entry.name} Telegram`,
    })),
  ];

  if (paths && agent) {
    links.push(
      { href: paths.finds, label: `${agent.name} finds` },
      { href: paths.spreadsheet, label: `${agent.name} spreadsheet` },
      { href: paths.discord, label: `${agent.name} Discord` },
      { href: paths.review, label: `${agent.name} review` }
    );
  }

  links.push({ href: "/telegram", label: "Telegram finds hub" });
  return links;
}

export function buildDiscordFooterLinks(currentSlug: string) {
  const agent = getSeoAgentBySlug(currentSlug);
  const paths = agent ? getAgentPlatformPaths(agent) : null;

  const links = [
    { href: "/", label: "LitBuy Finds homepage" },
    { href: "/finds", label: "Finds database hub" },
    { href: "/latest-finds", label: "Latest finds" },
    { href: "/litbuy-spreadsheet", label: "LitBuy spreadsheet" },
    { href: "/litbuy-qc", label: "QC database" },
    ...SEO_AGENTS.filter((entry) => entry.slug !== currentSlug).map((entry) => ({
      href: `/discord-${entry.slug}`,
      label: `${entry.name} Discord`,
    })),
  ];

  if (paths && agent) {
    links.push(
      { href: paths.finds, label: `${agent.name} finds` },
      { href: paths.spreadsheet, label: `${agent.name} spreadsheet` },
      { href: paths.telegram, label: `${agent.name} Telegram` },
      { href: paths.review, label: `${agent.name} review` }
    );
  }

  return links;
}

export function buildCouponFooterLinks(
  agent: SeoAgentDefinition,
  currentPath: string,
  siblingCouponPaths: { href: string; label: string }[]
) {
  const paths = getAgentPlatformPaths(agent);

  return [
    { href: "/", label: "LitBuy Finds homepage" },
    { href: "/finds", label: "Finds database hub" },
    { href: "/latest-finds", label: "Latest finds" },
    { href: "/litbuy-spreadsheet", label: "LitBuy spreadsheet" },
    { href: "/litbuy-qc", label: "QC database" },
    { href: paths.finds, label: `${agent.name} finds` },
    { href: paths.spreadsheet, label: `${agent.name} spreadsheet` },
    { href: paths.telegram, label: `${agent.name} Telegram` },
    { href: paths.discord, label: `${agent.name} Discord` },
    { href: paths.review, label: `${agent.name} review` },
    ...siblingCouponPaths.filter((link) => link.href !== currentPath),
    ...SEO_AGENTS.filter((entry) => entry.slug !== agent.slug).map((entry) => ({
      href: `/${entry.slug}-coupons`,
      label: `${entry.name} coupons`,
    })),
  ];
}
