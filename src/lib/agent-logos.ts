import type { AgentId } from "./agents";

/** Official agent logo assets — object-contain, fixed height in UI */
export const AGENT_LOGO_PATHS: Partial<Record<AgentId, string>> = {
  litbuy: "/agents/litbuy.png",
  oopbuy: "/agents/oopbuy.png",
  kakobuy: "/agents/kakobuy.png",
  hipobuy: "/agents/hipobuy.png",
  usfans: "/agents/usfans.png",
  gtbuy: "/agents/gtbuy.png",
  boonbuy: "/agents/boonbuy.png",
};

export function getAgentLogoPath(agentId: AgentId): string | null {
  return AGENT_LOGO_PATHS[agentId] ?? null;
}
