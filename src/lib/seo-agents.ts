import { BUYING_AGENTS, type AgentId } from "./agents";

/**
 * Agents supported by the Discord + Coupon SEO landing pages.
 * ACBuy is intentionally excluded — only these five ship dedicated
 * Discord/coupon/spreadsheet SEO pages.
 */
export type SeoAgentId = Extract<
  AgentId,
  "litbuy" | "kakobuy" | "mulebuy" | "hipobuy" | "oopbuy"
>;

export type SeoAgent = {
  id: SeoAgentId;
  name: string;
  slug: string;
  signupUrl: string;
  findsPath: string;
  spreadsheetPath: string;
  discordPath: string;
};

const SEO_AGENT_IDS: SeoAgentId[] = [
  "litbuy",
  "kakobuy",
  "mulebuy",
  "hipobuy",
  "oopbuy",
];

function requireAgent(id: SeoAgentId) {
  const agent = BUYING_AGENTS.find((candidate) => candidate.id === id);
  if (!agent) {
    throw new Error(`Missing BUYING_AGENTS entry for "${id}"`);
  }
  return agent;
}

export const SEO_AGENTS: SeoAgent[] = SEO_AGENT_IDS.map((id) => {
  const agent = requireAgent(id);
  return {
    id,
    name: agent.name,
    slug: agent.slug,
    signupUrl: agent.signupUrl,
    findsPath: `/${agent.slug}-finds`,
    spreadsheetPath: `/${agent.slug}-spreadsheet`,
    discordPath: `/discord-${agent.slug}`,
  };
});

export function getSeoAgent(id: SeoAgentId): SeoAgent {
  const agent = SEO_AGENTS.find((candidate) => candidate.id === id);
  if (!agent) {
    throw new Error(`Unknown SEO agent id "${id}"`);
  }
  return agent;
}

export function getSeoAgentBySlug(slug: string): SeoAgent | undefined {
  return SEO_AGENTS.find((agent) => agent.slug === slug);
}

export function couponSlugFor(
  agentSlug: string,
  variant: "standard" | "best" | "y2026"
): string {
  switch (variant) {
    case "standard":
      return `${agentSlug}-coupons`;
    case "best":
      return `best-${agentSlug}-coupons`;
    case "y2026":
      return `${agentSlug}-coupons-2026`;
  }
}
