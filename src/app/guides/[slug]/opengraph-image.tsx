import { OG_SIZE, renderOgImage } from "@/components/seo/OgImageTemplate";
import { getGuide } from "@/lib/guides";

export const size = OG_SIZE;
export const contentType = "image/png";

type OgProps = {
  params: Promise<{ slug: string }>;
};

export default async function GuideOgImage({ params }: OgProps) {
  const { slug } = await params;
  const guide = getGuide(slug);
  const title = guide?.h1 ?? "LitBuy Finds Guide";

  return renderOgImage(title, "Guides · LitBuy Finds");
}
