import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import GuidesHubGrid from "@/components/guides/GuidesHubGrid";
import SchemaScript from "@/components/SchemaScript";
import { GUIDES_HUB, getAllGuides } from "@/lib/guides";
import { buildCollectionPageSchema } from "@/lib/schema";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: GUIDES_HUB.title,
  description: GUIDES_HUB.metaDescription,
  path: GUIDES_HUB.path,
});

export default function GuidesHubPage() {
  const guides = getAllGuides();

  return (
    <>
      <SchemaScript
        data={buildCollectionPageSchema({
          name: GUIDES_HUB.h1,
          description: GUIDES_HUB.metaDescription,
          path: GUIDES_HUB.path,
          numberOfItems: guides.length,
        })}
      />

      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Guides" },
        ]}
        currentPath={GUIDES_HUB.path}
      />

      <section className="px-4 pb-6 pt-4 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
            Learn
          </p>
          <h1 className="mt-3 text-3xl font-black sm:text-4xl">{GUIDES_HUB.h1}</h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted">
            {GUIDES_HUB.intro}
          </p>
          <p className="mt-3 text-sm text-muted">
            Written by the LitBuy Finds Team ·{" "}
            <Link href="/about" className="font-bold text-accent hover:underline">
              Our mission
            </Link>
            {" · "}
            <Link href="/litbuy-coupons" className="font-bold text-accent hover:underline">
              LitBuy coupons
            </Link>
          </p>
        </div>
      </section>

      <GuidesHubGrid guides={guides} />
    </>
  );
}
