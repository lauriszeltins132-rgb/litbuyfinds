/** Active buying agents that get resource pages (telegram, discord, spreadsheet, review). */
export const AGENT_RESOURCE_AGENTS = [
  { id: "oopbuy", name: "OopBuy", slug: "oopbuy" },
  { id: "kakobuy", name: "Kakobuy", slug: "kakobuy" },
  { id: "hipobuy", name: "HipoBuy", slug: "hipobuy" },
  { id: "usfans", name: "USFans", slug: "usfans" },
  { id: "gtbuy", name: "GTBuy", slug: "gtbuy" },
  { id: "boonbuy", name: "BoonBuy", slug: "boonbuy" },
] as const;

/** Primary internal hub for shopping agent discovery and comparison. */
export const AGENTS_HUB_PATH = "/best-shopping-agent";

export type AgentResourceId = (typeof AGENT_RESOURCE_AGENTS)[number]["id"];

export type AgentResourceDefinition = (typeof AGENT_RESOURCE_AGENTS)[number];

export function getAgentResourceBySlug(
  slug: string
): AgentResourceDefinition | undefined {
  return AGENT_RESOURCE_AGENTS.find((agent) => agent.slug === slug);
}
