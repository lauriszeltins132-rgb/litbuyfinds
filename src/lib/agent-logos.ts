import type { AgentId } from "./agents";

/** Official agent logo assets — object-contain, fixed height in UI */
export const AGENT_LOGO_PATHS: Partial<Record<AgentId, string>> = {
  litbuy: "/agents/litbuy.png",
  mulebuy: "/agents/mulebuy.png",
  oopbuy: "/agents/oopbuy.png",
  kakobuy: "/agents/kakobuy.png",
  hipobuy: "/agents/hipobuy.png",
  acbuy: "/agents/acbuy.png",
};

export function getAgentLogoPath(agentId: AgentId): string | null {
  return AGENT_LOGO_PATHS[agentId] ?? null;
}
