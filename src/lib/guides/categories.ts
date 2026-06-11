import type { GuideCategory, GuideCategoryMeta } from "./types";

export const GUIDE_CATEGORIES: GuideCategoryMeta[] = [
  {
    id: "beginner",
    title: "Beginner Guides",
    description: "Start here if you are new to LitBuy, agents, or spreadsheet finds.",
  },
  {
    id: "buying",
    title: "Buying & Ordering",
    description: "How to order, use agent links, and buy from Weidian, Taobao, and 1688.",
  },
  {
    id: "qc",
    title: "QC & Shipping",
    description: "QC photos, checklists, haul prep, and shipping with agents.",
  },
  {
    id: "sneakers",
    title: "Sneaker Guides",
    description: "How to browse sneaker finds by brand, style, and budget.",
  },
  {
    id: "fashion",
    title: "Fashion Guides",
    description: "Streetwear, layers, accessories, and everyday rotation picks.",
  },
  {
    id: "brands",
    title: "Brand Guides",
    description: "Brand-focused browsing tips and where to find listings.",
  },
  {
    id: "budget",
    title: "Budget Finds",
    description: "Affordable picks, price caps, and seasonal shopping lanes.",
  },
];

export function getGuideCategoryMeta(id: GuideCategory) {
  return GUIDE_CATEGORIES.find((category) => category.id === id);
}
