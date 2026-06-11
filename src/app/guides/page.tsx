import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import HowItWorks from "@/components/HowItWorks";
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
        </div>
      </section>

      <HowItWorks />

      <section className="px-4 pb-16 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {guides.map((guide) => (
              <Link
                key={guide.slug}
                href={guide.path}
                className="panel-shell group flex flex-col rounded-2xl border border-border p-6 transition hover:-translate-y-0.5 hover:border-accent/30"
              >
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-accent">
                  {guide.badge}
                </p>
                <h2 className="mt-3 text-lg font-black text-foreground group-hover:text-accent">
                  {guide.h1}
                </h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                  {guide.cardDescription}
                </p>
                <span className="mt-4 text-xs font-bold text-accent">
                  Read guide →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
