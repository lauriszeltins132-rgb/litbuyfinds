import { redirect } from "next/navigation";

type LegacyCategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function LegacyCategoryPage({
  params,
}: LegacyCategoryPageProps) {
  const { slug } = await params;
  redirect(`/categories/${slug}`);
}
