import { getBrandBySlug } from "@/lib/brands";
import { getAllProducts } from "@/lib/products";
import { OG_SIZE, renderOgImage } from "@/components/seo/OgImageTemplate";

export const size = OG_SIZE;
export const contentType = "image/png";

type OgProps = {
  params: Promise<{ slug: string }>;
};

export default async function BrandOgImage({ params }: OgProps) {
  const { slug } = await params;
  const brand = getBrandBySlug(getAllProducts(), slug);
  const name = brand?.name ?? "Brand";

  return renderOgImage(`${name} Finds`, "Curated on LitBuy Finds");
}
