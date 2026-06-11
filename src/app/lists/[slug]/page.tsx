import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SeoListLanding from "@/components/SeoListLanding";
import { SEO_LIST_SLUGS, getSeoListRoute } from "@/lib/seo-list-routes";
import { buildPageMetadata } from "@/lib/seo";

type ListPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return SEO_LIST_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ListPageProps): Promise<Metadata> {
  const { slug } = await params;
  const config = getSeoListRoute(slug);
  if (!config) return {};

  return buildPageMetadata({
    title: config.title,
    description: config.metaDescription,
    path: config.path,
  });
}

export default async function SeoListPage({ params }: ListPageProps) {
  const { slug } = await params;
  const config = getSeoListRoute(slug);

  if (!config) {
    notFound();
  }

  return <SeoListLanding config={config} />;
}
