import type { StaticPageSection } from "../static-pages";

export type GuideCategory =
  | "beginner"
  | "buying"
  | "qc"
  | "sneakers"
  | "fashion"
  | "brands"
  | "budget";

export type GuidePage = {
  slug: string;
  path: string;
  category: GuideCategory;
  title: string;
  metaDescription: string;
  badge: string;
  h1: string;
  intro: string;
  cardDescription: string;
  sections: StaticPageSection[];
  faqs?: { question: string; answer: string }[];
  relatedLinks?: { href: string; label: string }[];
};

export type GuideCategoryMeta = {
  id: GuideCategory;
  title: string;
  description: string;
};
