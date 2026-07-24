import { BUYING_AGENTS } from "./agents";
import {
  LITBUY_OFFER_DESCRIPTION,
  LITBUY_OFFER_HEADLINE,
} from "./constants";

export const SEO_AGENT_IDS = [
  "litbuy",
  "mulebuy",
  "hipobuy",
  "oopbuy",
  "kakobuy",
] as const;

export type SeoAgentId = (typeof SEO_AGENT_IDS)[number];

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
  const agent = BUYING_AGENTS.find((entry) => entry.id === id);
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
    coupons: agent.id === "litbuy" ? "/litbuy-coupons" : `/${agent.slug}-coupons`,
    finds: agent.findsPath,
  };
}

export function buildTelegramFooterLinks(currentSlug: string) {
  const agent = getSeoAgentBySlug(currentSlug);
  const paths = agent ? getAgentPlatformPaths(agent) : null;

  const links = [
    { href: "/", label: "LitBuy Finds homepage" },
    ...SEO_AGENTS.filter((entry) => entry.slug !== currentSlug).map((entry) => ({
      href: `/telegram-${entry.slug}`,
      label: `${entry.name} Telegram`,
    })),
  ];

  if (paths && agent) {
    links.push(
      { href: paths.discord, label: `${agent.name} Discord` },
      { href: paths.coupons, label: `${agent.name} coupons` },
      { href: paths.finds, label: `${agent.name} finds` }
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
    ...SEO_AGENTS.filter((entry) => entry.slug !== currentSlug).map((entry) => ({
      href: `/discord-${entry.slug}`,
      label: `${entry.name} Discord`,
    })),
  ];

  if (paths && agent) {
    links.push(
      { href: paths.telegram, label: `${agent.name} Telegram` },
      { href: paths.coupons, label: `${agent.name} coupons` },
      { href: paths.finds, label: `${agent.name} finds` }
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
    { href: "/recently-added", label: "New finds" },
    { href: paths.finds, label: `${agent.name} finds` },
    { href: paths.telegram, label: `${agent.name} Telegram` },
    { href: paths.discord, label: `${agent.name} Discord` },
    ...siblingCouponPaths.filter((link) => link.href !== currentPath),
    ...SEO_AGENTS.filter((entry) => entry.slug !== agent.slug).map((entry) => ({
      href: `/${entry.slug}-coupons`,
      label: `${entry.name} coupons`,
    })),
  ];
}
