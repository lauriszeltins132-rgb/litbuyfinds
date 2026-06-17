import Link from "next/link";
import { SHARE_COLLECTION_SLUGS, SHARE_COLLECTIONS } from "@/lib/share-collections";

const FEATURED_COLLECTION_SLUGS = [
  "best-nike-finds",
  "best-jordan-finds",
  "best-moncler-finds",
  "best-stussy-finds",
  "best-sneakers",
  "best-jackets",
  "best-hoodies",
  "best-bags",
  "best-qc-approved-finds",
  "trending-this-week",
  "most-saved-finds",
  "best-under-50",
];

export default function HomepageCollections() {
  const collections = FEATURED_COLLECTION_SLUGS.map((slug) => SHARE_COLLECTIONS[slug]).filter(
    Boolean
  );

  return (
    <section className="px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-7xl rounded-2xl border border-border bg-surface/30 p-5 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">
              Collections
            </p>
            <h2 className="mt-2 text-xl font-black sm:text-2xl">Curated find collections</h2>
            <p className="mt-1 text-sm text-muted">
              Shareable SEO pages — brand picks, QC finds, budget hauls, and trending lists.
            </p>
          </div>
          <Link
            href="/collections"
            className="text-sm font-bold text-accent hover:underline"
          >
            All collections →
          </Link>
        </div>
        <ul className="mt-5 flex flex-wrap gap-2">
          {collections.map((item) => (
            <li key={item.slug}>
              <Link
                href={item.path}
                className="rounded-full border border-border px-3 py-1.5 text-xs font-bold text-foreground/85 hover:border-accent/40 hover:text-accent"
              >
                {item.h1}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
