import { permanentRedirect } from "next/navigation";
import { SEO_LIST_SLUGS } from "@/lib/seo-list-routes";

type LegacyListPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return SEO_LIST_SLUGS.map((slug) => ({ slug }));
}

export default async function LegacyListPage({ params }: LegacyListPageProps) {
  const { slug } = await params;
  permanentRedirect(`/${slug}`);
}
