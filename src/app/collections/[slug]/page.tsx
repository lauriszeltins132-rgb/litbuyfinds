import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SeoListLanding from "@/components/SeoListLanding";
import {
  SHARE_COLLECTION_SLUGS,
  getShareCollection,
} from "@/lib/share-collections";
import { buildPageMetadata } from "@/lib/seo";

type CollectionPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return SHARE_COLLECTION_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const config = getShareCollection(slug);
  if (!config) return {};

  return buildPageMetadata({
    title: config.title,
    description: config.metaDescription,
    path: config.path,
  });
}

export default async function ShareCollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  const config = getShareCollection(slug);

  if (!config) {
    notFound();
  }

  return <SeoListLanding config={config} />;
}
