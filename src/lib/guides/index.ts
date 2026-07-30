import { BEGINNER_GUIDES } from "./beginner-guides";
import { BUYING_GUIDES } from "./buying-guides";
import { QC_GUIDES } from "./qc-guides";
import { SNEAKER_GUIDES } from "./sneaker-guides";
import { FASHION_GUIDES } from "./fashion-guides";
import { BRAND_GUIDES } from "./brand-guides";
import { BUDGET_GUIDES } from "./budget-guides";
import { LITBUY_SEO_GUIDES } from "./litbuy-seo-guides";
import { COMPARISON_GUIDES } from "./comparison-guides";
import type { GuideCategory, GuidePage } from "./types";

export type { GuideCategory, GuidePage } from "./types";
export { GUIDE_CATEGORIES, getGuideCategoryMeta } from "./categories";
export { GUIDE_HUB_SECTIONS, GUIDES_HUB_FAQS, getGuideHubSectionId } from "./hub-sections";
export { CORE_LINKS } from "./shared";

export const GUIDE_PAGES: Record<string, GuidePage> = {
  ...BEGINNER_GUIDES,
  ...BUYING_GUIDES,
  ...QC_GUIDES,
  ...SNEAKER_GUIDES,
  ...FASHION_GUIDES,
  ...BRAND_GUIDES,
  ...BUDGET_GUIDES,
  ...LITBUY_SEO_GUIDES,
  ...COMPARISON_GUIDES,
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
  title: "LitBuy Guides – Rep Finds, QC Photos, Agents & Shipping",
  metaDescription:
    "Authority guides for rep finds, QC photos, Chinese shopping agents, spreadsheets, and shipping savings on LitBuy Finds.",
  h1: "Guides",
  intro:
    "Practical guides for browsing rep finds, checking QC photos, using Chinese shopping agents, and saving on shipping. Start with beginner basics, agent workflows, find browsing tips, or shipping and QC checklists.",
};
