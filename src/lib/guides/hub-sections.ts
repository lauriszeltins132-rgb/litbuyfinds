import type { GuideCategory } from "./types";

export type GuideHubSectionId = "beginner" | "agent" | "finds" | "shipping";

export type GuideHubSectionMeta = {
  id: GuideHubSectionId;
  title: string;
  description: string;
  anchor: string;
};

/** Four hub sections surfaced on /guides — maps existing guide categories. */
export const GUIDE_HUB_SECTIONS: GuideHubSectionMeta[] = [
  {
    id: "beginner",
    anchor: "beginner-guides",
    title: "Beginner guides",
    description:
      "New to LitBuy, agents, or spreadsheet finds? Start here for platform basics and your first haul.",
  },
  {
    id: "agent",
    anchor: "agent-guides",
    title: "Agent guides",
    description:
      "How shopping agents work, ordering from Weidian and Taobao, agent links, and checkout workflow.",
  },
  {
    id: "finds",
    anchor: "find-guides",
    title: "Find guides",
    description:
      "Browse sneakers, streetwear, brands, and budget picks — how to search the catalog and spot quality listings.",
  },
  {
    id: "shipping",
    anchor: "shipping-guides",
    title: "Shipping guides",
    description:
      "QC photos, haul prep, freight lines, and practical ways to save on international shipping.",
  },
];

const CATEGORY_TO_HUB: Record<GuideCategory, GuideHubSectionId> = {
  beginner: "beginner",
  buying: "agent",
  qc: "shipping",
  sneakers: "finds",
  fashion: "finds",
  brands: "finds",
  budget: "finds",
};

export function getGuideHubSectionId(category: GuideCategory): GuideHubSectionId {
  return CATEGORY_TO_HUB[category];
}

export function getGuideHubSectionMeta(id: GuideHubSectionId) {
  return GUIDE_HUB_SECTIONS.find((section) => section.id === id);
}

export const GUIDES_HUB_FAQS = [
  {
    question: "Where should I start if I am new to rep buying?",
    answer:
      "Read the beginner guides first — they explain what LitBuy is, how agents work, and how LitBuy Finds fits into discovery. Then open a product page and follow the agent link when you are ready to order.",
  },
  {
    question: "What is the difference between LitBuy Finds and LitBuy?",
    answer:
      "LitBuy Finds is a discovery catalog with photos, QC references, and guides. LitBuy is the shopping agent where you pay, receive warehouse QC, and ship internationally.",
  },
  {
    question: "How do QC photos and shipping guides help?",
    answer:
      "QC guides explain warehouse quality-check photos before you approve shipping. Shipping guides cover freight lines, consolidation, and ways to reduce cost per item in a haul.",
  },
] as const;
