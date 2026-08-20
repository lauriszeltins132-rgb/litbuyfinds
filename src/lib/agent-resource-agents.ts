/** Active buying agents that get resource pages (telegram, discord, spreadsheet, review). */
export const AGENT_RESOURCE_AGENTS = [
  {
    id: "oopbuy",
    name: "OopBuy",
    slug: "oopbuy",
    telegramFocus:
      "OopBuy finds Telegram searches often mix spreadsheet rows with fee and shipping-line chatter — useful when comparing OopBuy checkout to LitBuy on the same marketplace listing.",
    spreadsheetFocus:
      "OopBuy spreadsheet searches usually mean shoppers want the same Weidian/Taobao rows with OopBuy selected at checkout — especially when comparing shipping lines and fees against LitBuy on identical listings.",
    angleLabel: "fee & shipping comparison",
  },
  {
    id: "kakobuy",
    name: "Kakobuy",
    slug: "kakobuy",
    telegramFocus:
      "Kakobuy Telegram and Kakobuy finds threads are popular for QC photo shares and Kakobuy spreadsheet updates on sneakers and streetwear batches.",
    spreadsheetFocus:
      "Kakobuy spreadsheet searches often target sneaker and streetwear batches with QC references — buyers want a searchable Kakobuy finds sheet, not a raw Google Sheet scroll on mobile.",
    angleLabel: "sneakers, streetwear & QC batches",
  },
  {
    id: "hipobuy",
    name: "HipoBuy",
    slug: "hipobuy",
    telegramFocus:
      "HipoBuy Telegram and HipoBuy reps discussions often focus on haul consolidation, QC albums, and HipoBuy finds shared alongside spreadsheet links.",
    spreadsheetFocus:
      "HipoBuy spreadsheet searches usually center on haul consolidation — shoppers want HipoBuy finds with QC albums attached so they can fill a warehouse cart before shipping.",
    angleLabel: "haul consolidation & QC albums",
  },
  {
    id: "usfans",
    name: "USFans",
    slug: "usfans",
    telegramFocus:
      "USFans Telegram, USFans reps, and USFans spreadsheet searches usually mean buyers want US-friendly agent links with live QC notes — not just a static invite.",
    spreadsheetFocus:
      "USFans spreadsheet and USFans finds searches usually mean US-friendly agent checkout with live QC notes — buyers want a cleaned catalog they can open on USFans without hunting invite-only sheets.",
    angleLabel: "US-friendly checkout & QC notes",
  },
  {
    id: "gtbuy",
    name: "GTBuy",
    slug: "gtbuy",
    telegramFocus:
      "GTBuy Telegram and GTBuy finds posts tend to highlight new product rows and GTBuy reps updates before they land in a cleaned catalog page.",
    spreadsheetFocus:
      "GTBuy spreadsheet searches often mean new product rows and GTBuy reps updates — shoppers want GTBuy finds indexed into pages before a static sheet goes stale.",
    angleLabel: "new product rows & reps updates",
  },
  {
    id: "boonbuy",
    name: "BoonBuy",
    slug: "boonbuy",
    telegramFocus:
      "BoonBuy Telegram and BoonBuy finds shares often include budget streetwear rows, QC notes, and BoonBuy reps drops for shoppers comparing agents.",
    spreadsheetFocus:
      "BoonBuy spreadsheet searches often focus on budget streetwear rows and BoonBuy finds with QC notes — a practical sheet alternative for comparing value before checkout.",
    angleLabel: "budget streetwear & value finds",
  },
] as const;

export type AgentResourceId = (typeof AGENT_RESOURCE_AGENTS)[number]["id"];

export type AgentResourceDefinition = (typeof AGENT_RESOURCE_AGENTS)[number];

export function getAgentResourceBySlug(
  slug: string
): AgentResourceDefinition | undefined {
  return AGENT_RESOURCE_AGENTS.find((agent) => agent.slug === slug);
}
