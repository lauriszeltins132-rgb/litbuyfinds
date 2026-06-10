import { permanentRedirect } from "next/navigation";

type LegacyCategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function LegacyCategoryPage({
  params,
}: LegacyCategoryPageProps) {
  const { slug } = await params;
  permanentRedirect(`/categories/${slug}`);
}
