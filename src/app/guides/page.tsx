import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import GuidesHubCategoryNav from "@/components/guides/GuidesHubCategoryNav";
import GuidesHubGrid from "@/components/guides/GuidesHubGrid";
import SchemaScript from "@/components/SchemaScript";
import { GUIDES_HUB, getAllGuides } from "@/lib/guides";
import { GUIDES_HUB_FAQS } from "@/lib/guides/hub-sections";
import {
  buildBreadcrumbSchema,
  buildCollectionPageSchema,
  buildFaqSchema,
  buildWebPageSchema,
} from "@/lib/schema";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "LitBuy Guides – Rep Finds, QC Photos, Agents & Shipping",
  description:
    "Authority guides for rep finds, QC photos, Chinese shopping agents, spreadsheets, and shipping savings on LitBuy Finds.",
  path: GUIDES_HUB.path,
});

export default function GuidesHubPage() {
  const guides = getAllGuides();

  return (
    <>
      <SchemaScript
        data={buildWebPageSchema({
          name: GUIDES_HUB.h1,
          description: GUIDES_HUB.metaDescription,
          path: GUIDES_HUB.path,
        })}
      />
      <SchemaScript
        data={buildBreadcrumbSchema(
          [{ label: "Home", href: "/" }, { label: "Guides" }],
          GUIDES_HUB.path
        )}
      />
      <SchemaScript data={buildFaqSchema([...GUIDES_HUB_FAQS])} />
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
          <div className="mt-8">
            <GuidesHubCategoryNav />
          </div>
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
