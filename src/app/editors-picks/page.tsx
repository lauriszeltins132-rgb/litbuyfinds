import type { Metadata } from "next";
import CollectionLanding from "@/components/CollectionLanding";
import { COLLECTIONS } from "@/lib/collections";
import { buildPageMetadata } from "@/lib/seo";

const collection = COLLECTIONS["editors-picks"];

export const metadata: Metadata = buildPageMetadata({
  title: collection.title,
  description: collection.description,
  path: collection.href,
});

export default function EditorsPicksPage() {
  return <CollectionLanding collection={collection} />;
}
