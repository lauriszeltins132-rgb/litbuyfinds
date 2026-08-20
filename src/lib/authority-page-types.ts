import type { StaticPageSection } from "./static-pages";

export type AuthorityPage = {
  slug: string;
  path: string;
  title: string;
  metaDescription: string;
  badge: string;
  h1: string;
  /** 40–70 word direct answer under H1 */
  directAnswer: string;
  /** Concise summary box content */
  summary: string;
  sections: StaticPageSection[];
  faqs?: { question: string; answer: string }[];
  relatedLinks?: { href: string; label: string }[];
  parentCrumb?: { label: string; href: string };
  /** Override default Home > H1 breadcrumbs (e.g. Homepage > LitBuy Discord). */
  breadcrumbItems?: { label: string; href?: string }[];
  primaryCta?: { href: string; label: string };
  publishedTime: string;
  modifiedTime: string;
};
