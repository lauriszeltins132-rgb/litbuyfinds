import type { AuthorityPage } from "./litbuy-authority-pages";
import { AGENT_RESOURCE_AGENTS } from "./agent-resource-agents";
import { buildAgentReviewPage } from "./agent-resource-content";

export const AGENT_REVIEW_PAGES: Record<string, AuthorityPage> =
  Object.fromEntries(
    AGENT_RESOURCE_AGENTS.map((agent) => [
      `${agent.slug}-review`,
      buildAgentReviewPage(agent),
    ])
  );

export const AGENT_REVIEW_SLUGS = Object.keys(AGENT_REVIEW_PAGES);

export function getAgentReviewPage(slug: string): AuthorityPage | undefined {
  return AGENT_REVIEW_PAGES[slug];
}
