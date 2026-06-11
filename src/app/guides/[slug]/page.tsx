import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ContentPageLayout from "@/components/ContentPageLayout";
import { GUIDE_SLUGS, getGuide } from "@/lib/guides";
import { buildPageMetadata } from "@/lib/seo";

type GuidePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return GUIDE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};

  return buildPageMetadata({
    title: guide.title,
    description: guide.metaDescription,
    path: guide.path,
  });
}

export default async function GuideDetailPage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = getGuide(slug);

  if (!guide) {
    notFound();
  }

  return (
    <ContentPageLayout
      path={guide.path}
      badge={guide.badge}
      h1={guide.h1}
      intro={guide.intro}
      sections={guide.sections}
      faqs={guide.faqs}
      relatedLinks={guide.relatedLinks}
      parentCrumb={{ label: "Guides", href: "/guides" }}
    />
  );
}
