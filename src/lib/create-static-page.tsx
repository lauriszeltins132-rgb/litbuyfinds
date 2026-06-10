import type { Metadata } from "next";
import ContentPageLayout from "@/components/ContentPageLayout";
import { buildPageMetadata } from "@/lib/seo";
import { getStaticPage, type StaticPage } from "@/lib/static-pages";

export function createStaticPageMetadata(page: StaticPage): Metadata {
  return buildPageMetadata({
    title: page.title,
    description: page.metaDescription,
    path: page.path,
  });
}

export function StaticPageView({ slug }: { slug: string }) {
  const page = getStaticPage(slug);
  if (!page) return null;

  return (
    <ContentPageLayout
      path={page.path}
      badge={page.badge}
      h1={page.h1}
      intro={page.intro}
      sections={page.sections}
      faqs={page.faqs}
      relatedLinks={page.relatedLinks}
    />
  );
}

export function getStaticPageMetadata(slug: string): Metadata | null {
  const page = getStaticPage(slug);
  if (!page) return null;
  return createStaticPageMetadata(page);
}
