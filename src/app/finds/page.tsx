import type { Metadata } from "next";
import FindsHubPage from "@/components/FindsHubPage";
import { FINDS_HUB_METADATA, FINDS_HUB_PATH } from "@/lib/finds-hub";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: FINDS_HUB_METADATA.title,
  description: FINDS_HUB_METADATA.description,
  path: FINDS_HUB_PATH,
});

export default function FindsPage() {
  return <FindsHubPage />;
}
