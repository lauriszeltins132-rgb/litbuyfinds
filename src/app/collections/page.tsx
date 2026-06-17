import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import SchemaScript from "@/components/SchemaScript";
import { SHARE_COLLECTION_SLUGS, SHARE_COLLECTIONS } from "@/lib/share-collections";
import { buildCollectionPageSchema } from "@/lib/schema";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "LitBuy Find Collections",
  description:
    "Browse curated LitBuy find collections — Nike, Jordan, Moncler, sneakers, jackets, QC finds, budget picks, and trending lists.",
  path: "/collections",
});

export default function CollectionsHubPage() {
  const collections = SHARE_COLLECTION_SLUGS.map((slug) => SHARE_COLLECTIONS[slug]);

  return (
    <>
      <SchemaScript
        data={buildCollectionPageSchema({
          name: "LitBuy Find Collections",
          description: "Curated collections of LitBuy finds by brand, category, and budget.",
          path: "/collections",
          numberOfItems: collections.length,
        })}
      />
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Collections" }]}
        currentPath="/collections"
      />

      <section className="px-4 pb-12 pt-4 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
            Collections
          </p>
          <h1 className="mt-3 text-3xl font-black sm:text-4xl">LitBuy find collections</h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted">
            Curated, shareable lists of LitBuy finds — organized by brand, category, QC status,
            budget, and trending momentum. Updated with daily catalog sync.
          </p>

          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {collections.map((item) => (
              <li key={item.slug}>
                <Link
                  href={item.path}
                  className="block rounded-2xl border border-border bg-surface/40 p-5 transition hover:border-accent/35"
                >
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">
                    {item.badge}
                  </p>
                  <h2 className="mt-2 text-lg font-black">{item.h1}</h2>
                  <p className="mt-2 line-clamp-2 text-sm text-muted">{item.intro}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
