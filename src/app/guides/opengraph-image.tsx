import { OG_SIZE, renderOgImage } from "@/components/seo/OgImageTemplate";

export const size = OG_SIZE;
export const contentType = "image/png";

export default function GuidesHubOgImage() {
  return renderOgImage("LitBuy Finds Guides", "Learn agents, QC, and ordering");
}
