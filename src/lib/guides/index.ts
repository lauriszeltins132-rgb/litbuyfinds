import { BEGINNER_GUIDES } from "./beginner-guides";
import { BUYING_GUIDES } from "./buying-guides";
import { QC_GUIDES } from "./qc-guides";
import { SNEAKER_GUIDES } from "./sneaker-guides";
import { FASHION_GUIDES } from "./fashion-guides";
import { BRAND_GUIDES } from "./brand-guides";
import { BUDGET_GUIDES } from "./budget-guides";
import type { GuideCategory, GuidePage } from "./types";

export type { GuideCategory, GuidePage } from "./types";
export { GUIDE_CATEGORIES, getGuideCategoryMeta } from "./categories";
export { CORE_LINKS } from "./shared";

export const GUIDE_PAGES: Record<string, GuidePage> = {
  ...BEGINNER_GUIDES,
  ...BUYING_GUIDES,
  ...QC_GUIDES,
  ...SNEAKER_GUIDES,
  ...FASHION_GUIDES,
  ...BRAND_GUIDES,
  ...BUDGET_GUIDES,
};

export const GUIDE_SLUGS = Object.keys(GUIDE_PAGES);

export function getGuide(slug: string): GuidePage | undefined {
  return GUIDE_PAGES[slug];
}

export function getAllGuides(): GuidePage[] {
  return GUIDE_SLUGS.map((slug) => GUIDE_PAGES[slug]);
}

export function getGuidesByCategory(category: GuideCategory): GuidePage[] {
  return getAllGuides().filter((guide) => guide.category === category);
}

export const GUIDES_HUB = {
  path: "/guides",
  title: "LitBuy Finds Guides",
  metaDescription:
    "Premium guides for LitBuy, shopping agents, QC photos, shipping hauls, sneaker finds, and budget browsing on LitBuy Finds.",
  h1: "Guides",
  intro:
    "Clear, practical guides for browsing finds and buying through LitBuy. Start with the basics or jump straight to sneakers, fashion, brands, or budget picks.",
};
