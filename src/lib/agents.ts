import { extractMarketplaceListingId } from "./product-title-quality";
import type { Product } from "./types";

const LITBUY_SIGNUP_URL = "https://litbuy.com/register?inviteCode=SMKS";
const LITBUY_INVITE_CODE = "SMKS";

export type AgentId =
  | "litbuy"
  | "oopbuy"
  | "kakobuy"
  | "hipobuy"
  | "acbuy"
  | "mulebuy";

export type MarketplacePlatform = "weidian" | "taobao" | "1688";

export type AgentDefinition = {
  id: AgentId;
  name: string;
  slug: string;
  recommended: boolean;
  affiliateEnabled: boolean;
  signupUrl: string;
  description: string;
  /** Short label for compact UI */
  shortLabel: string;
};

export const BUYING_AGENTS: AgentDefinition[] = [
  {
    id: "litbuy",
    name: "LitBuy",
    slug: "litbuy",
    recommended: true,
    affiliateEnabled: true,
    signupUrl: LITBUY_SIGNUP_URL,
    description: "Our recommended agent with verified links and QC support.",
    shortLabel: "LitBuy",
  },
  {
    id: "oopbuy",
    name: "OopBuy",
    slug: "oopbuy",
    recommended: false,
    affiliateEnabled: false,
    signupUrl: "https://oopbuy.com/register",
    description: "Import Weidian and Taobao listings through OopBuy.",
    shortLabel: "OopBuy",
  },
  {
    id: "kakobuy",
    name: "Kakobuy",
    slug: "kakobuy",
    recommended: false,
    affiliateEnabled: false,
    signupUrl: "https://www.kakobuy.com/register",
    description: "Paste or import product links on Kakobuy.",
    shortLabel: "Kakobuy",
  },
  {
    id: "hipobuy",
    name: "HipoBuy",
    slug: "hipobuy",
    recommended: false,
    affiliateEnabled: false,
    signupUrl: "https://hipobuy.com/register",
    description: "Open listings on HipoBuy for checkout.",
    shortLabel: "HipoBuy",
  },
  {
    id: "acbuy",
    name: "ACBuy",
    slug: "acbuy",
    recommended: false,
    affiliateEnabled: false,
    signupUrl: "https://www.acbuy.com/register",
    description: "Import marketplace links on ACBuy.",
    shortLabel: "ACBuy",
  },
  {
    id: "mulebuy",
    name: "MuleBuy",
    slug: "mulebuy",
    recommended: false,
    affiliateEnabled: false,
    signupUrl: "https://mulebuy.com/register",
    description: "Search or import finds on MuleBuy.",
    shortLabel: "MuleBuy",
  },
];

export const DEFAULT_AGENT_ID: AgentId = "litbuy";

const AGENT_BY_ID = Object.fromEntries(
  BUYING_AGENTS.map((agent) => [agent.id, agent])
) as Record<AgentId, AgentDefinition>;

export function isAgentId(value: string): value is AgentId {
  return value in AGENT_BY_ID;
}

export function getAgentById(agentId: AgentId): AgentDefinition {
  return AGENT_BY_ID[agentId];
}

export function getAgentDisplayLabel(agentId: AgentId): string {
  const agent = getAgentById(agentId);
  return agent.recommended ? `${agent.name} — Recommended` : agent.name;
}

export function extractListingFromAffiliateLink(
  affiliateLink: string
): { platform: MarketplacePlatform; id: string } | null {
  const fromLitBuy = extractMarketplaceListingId(affiliateLink);
  if (fromLitBuy) return fromLitBuy;

  const alibaba = affiliateLink.match(/1688\/(\d+)/i);
  if (alibaba) return { platform: "1688", id: alibaba[1] };

  return null;
}

/** Raw marketplace URL used by agents that import via link paste. */
export function buildMarketplaceSourceUrl(
  platform: MarketplacePlatform,
  id: string
): string {
  switch (platform) {
    case "weidian":
      return `https://weidian.com/item.html?itemID=${id}`;
    case "taobao":
      return `https://item.taobao.com/item.htm?id=${id}`;
    case "1688":
      return `https://detail.1688.com/offer/${id}.html`;
  }
}

type AgentUrlBuilder = {
  fromListing: (
    platform: MarketplacePlatform,
    id: string,
    sourceUrl: string
  ) => string;
  search: (query: string) => string;
};

/**
 * Per-agent URL templates. Edit handlers here when exact product URLs are known.
 * `fromListing` receives the raw marketplace URL as `sourceUrl` for paste-import agents.
 */
const AGENT_URL_BUILDERS: Record<AgentId, AgentUrlBuilder> = {
  litbuy: {
    fromListing: (platform, id) =>
      `https://litbuy.com/product/${platform}/${id}?inviteCode=${LITBUY_INVITE_CODE}`,
    search: (query) =>
      `https://litbuy.com/search?q=${encodeURIComponent(query)}`,
  },
  oopbuy: {
    fromListing: (platform, id) =>
      `https://oopbuy.com/product/${platform}/${id}`,
    search: (query) =>
      `https://oopbuy.com/search?q=${encodeURIComponent(query)}`,
  },
  kakobuy: {
    fromListing: (_platform, _id, sourceUrl) =>
      `https://www.kakobuy.com/item/details?url=${encodeURIComponent(sourceUrl)}`,
    search: (query) =>
      `https://www.kakobuy.com/search?q=${encodeURIComponent(query)}`,
  },
  hipobuy: {
    fromListing: (platform, id) =>
      `https://hipobuy.com/product/${platform}/${id}`,
    search: (query) =>
      `https://hipobuy.com/search?keyword=${encodeURIComponent(query)}`,
  },
  acbuy: {
    fromListing: (platform, id) =>
      `https://www.acbuy.com/product/${platform}/${id}`,
    search: (query) =>
      `https://www.acbuy.com/search?keyword=${encodeURIComponent(query)}`,
  },
  mulebuy: {
    fromListing: (platform, id) =>
      `https://mulebuy.com/product/${platform}/${id}`,
    search: (query) =>
      `https://mulebuy.com/search?q=${encodeURIComponent(query)}`,
  },
};

export function buildAgentProductUrl(
  product: Product,
  agentId: AgentId
): string | null {
  const agent = getAgentById(agentId);
  const affiliateLink = product.affiliate_link?.trim();

  if (!affiliateLink) return null;

  if (agent.affiliateEnabled && /litbuy\.com/i.test(affiliateLink)) {
    return withCurrentLitBuyInvite(affiliateLink);
  }

  const listing = extractListingFromAffiliateLink(affiliateLink);
  if (listing) {
    const sourceUrl = buildMarketplaceSourceUrl(listing.platform, listing.id);
    return AGENT_URL_BUILDERS[agentId].fromListing(
      listing.platform,
      listing.id,
      sourceUrl
    );
  }

  return AGENT_URL_BUILDERS[agentId].search(product.product_name);
}

export function buildAgentSearchUrl(agentId: AgentId, query: string): string {
  return AGENT_URL_BUILDERS[agentId].search(query);
}

/** Keep stored catalog links on the current invite even if JSON still has an old code. */
export function withCurrentLitBuyInvite(url: string): string {
  if (/inviteCode=/i.test(url)) {
    return url.replace(/inviteCode=[^&]+/i, `inviteCode=${LITBUY_INVITE_CODE}`);
  }
  return url.includes("?")
    ? `${url}&inviteCode=${LITBUY_INVITE_CODE}`
    : `${url}?inviteCode=${LITBUY_INVITE_CODE}`;
}

/** @deprecated Use BUYING_AGENTS — kept for PreferencesContext compatibility */
export const AGENTS = BUYING_AGENTS.map((agent) => ({
  id: agent.id,
  name: agent.name,
  signupUrl: agent.signupUrl,
  description: agent.description,
}));
