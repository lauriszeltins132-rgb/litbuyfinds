/** Active buying agents that get resource pages (telegram, discord, spreadsheet, review). */
export const AGENT_RESOURCE_AGENTS = [
  {
    id: "oopbuy",
    name: "OopBuy",
    slug: "oopbuy",
    telegramFocus:
      "OopBuy finds Telegram searches often mix spreadsheet rows with fee and shipping-line chatter — useful when comparing OopBuy checkout to LitBuy on the same marketplace listing.",
  },
  {
    id: "kakobuy",
    name: "Kakobuy",
    slug: "kakobuy",
    telegramFocus:
      "Kakobuy Telegram and Kakobuy finds threads are popular for QC photo shares and Kakobuy spreadsheet updates on sneakers and streetwear batches.",
  },
  {
    id: "hipobuy",
    name: "HipoBuy",
    slug: "hipobuy",
    telegramFocus:
      "HipoBuy Telegram and HipoBuy reps discussions often focus on haul consolidation, QC albums, and HipoBuy finds shared alongside spreadsheet links.",
  },
  {
    id: "usfans",
    name: "USFans",
    slug: "usfans",
    telegramFocus:
      "USFans Telegram, USFans reps, and USFans spreadsheet searches usually mean buyers want US-friendly agent links with live QC notes — not just a static invite.",
  },
  {
    id: "gtbuy",
    name: "GTBuy",
    slug: "gtbuy",
    telegramFocus:
      "GTBuy Telegram and GTBuy finds posts tend to highlight new product rows and GTBuy reps updates before they land in a cleaned catalog page.",
  },
  {
    id: "boonbuy",
    name: "BoonBuy",
    slug: "boonbuy",
    telegramFocus:
      "BoonBuy Telegram and BoonBuy finds shares often include budget streetwear rows, QC notes, and BoonBuy reps drops for shoppers comparing agents.",
  },
] as const;

export type AgentResourceId = (typeof AGENT_RESOURCE_AGENTS)[number]["id"];

export type AgentResourceDefinition = (typeof AGENT_RESOURCE_AGENTS)[number];

export function getAgentResourceBySlug(
  slug: string
): AgentResourceDefinition | undefined {
  return AGENT_RESOURCE_AGENTS.find((agent) => agent.slug === slug);
}
