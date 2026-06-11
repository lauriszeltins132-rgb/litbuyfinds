import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ContentPageLayout from "@/components/ContentPageLayout";
import SchemaScript from "@/components/SchemaScript";
import { getGuideContentDates } from "@/lib/content-dates";
import { GUIDE_SLUGS, getGuide } from "@/lib/guides";
import { buildArticleSchema } from "@/lib/schema";
import { buildArticlePageMetadata } from "@/lib/seo";

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

  const dates = getGuideContentDates(slug);

  return buildArticlePageMetadata({
    title: guide.title,
    description: guide.metaDescription,
    path: guide.path,
    publishedTime: dates.publishedIso,
    modifiedTime: dates.updatedIso,
  });
}

export default async function GuideDetailPage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = getGuide(slug);

  if (!guide) {
    notFound();
  }

  const dates = getGuideContentDates(slug);

  return (
    <>
      <SchemaScript
        data={buildArticleSchema({
          title: guide.title,
          description: guide.metaDescription,
          path: guide.path,
          datePublished: dates.publishedIso,
          dateModified: dates.updatedIso,
        })}
      />
      <ContentPageLayout
        path={guide.path}
        badge={guide.badge}
        h1={guide.h1}
        intro={guide.intro}
        sections={guide.sections}
        faqs={guide.faqs}
        relatedLinks={[
          ...(guide.relatedLinks ?? []),
          { href: "/about", label: "About LitBuy Finds" },
          { href: "/contact", label: "Contact" },
        ]}
        parentCrumb={{ label: "Guides", href: "/guides" }}
        contentDates={dates}
        showAuthorMeta
        showSignupCta
      />
    </>
  );
}
