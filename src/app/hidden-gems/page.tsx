import type { Metadata } from "next";
import CollectionLanding from "@/components/CollectionLanding";
import { COLLECTIONS } from "@/lib/collections";
import { buildPageMetadata } from "@/lib/seo";

const collection = COLLECTIONS["hidden-gems"];

export const metadata: Metadata = buildPageMetadata({
  title: collection.title,
  description: collection.description,
  path: collection.href,
});

export default function HiddenGemsPage() {
  return <CollectionLanding collection={collection} />;
}
