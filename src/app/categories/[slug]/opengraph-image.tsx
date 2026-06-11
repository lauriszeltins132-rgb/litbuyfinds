import {
  getResolvedCategorySeo,
  resolveCategorySlug,
} from "@/lib/category-aliases";
import { OG_SIZE, renderOgImage } from "@/components/seo/OgImageTemplate";

export const size = OG_SIZE;
export const contentType = "image/png";

type OgProps = {
  params: Promise<{ slug: string }>;
};

export default async function CategoryOgImage({ params }: OgProps) {
  const { slug } = await params;
  const resolved = resolveCategorySlug(slug);
  const title = resolved
    ? getResolvedCategorySeo(resolved).title
    : "Category Finds";

  return renderOgImage(title, "Category finds · LitBuy Finds");
}
