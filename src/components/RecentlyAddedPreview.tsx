import Link from "next/link";
import {
  getNewThisMonth,
  getNewThisWeek,
  getNewToday,
} from "@/lib/recency";
import ProductGrid from "./ProductGrid";

const BUCKETS = [
  {
    title: "New Today",
    subtitle: "Fresh picks rotating daily from the latest sheet",
    getProducts: () => getNewToday(4),
  },
  {
    title: "New This Week",
    subtitle: "Recent arrivals buyers are adding to hauls",
    getProducts: () => getNewThisWeek(4),
  },
  {
    title: "New This Month",
    subtitle: "Latest finds across sneakers, streetwear, and more",
    getProducts: () => getNewThisMonth(4),
  },
] as const;

export default function RecentlyAddedPreview() {
  return (
    <section className="px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
              Fresh drops
            </p>
            <h2 className="mt-2 text-2xl font-black sm:text-3xl">Recently Added</h2>
            <p className="mt-2 max-w-2xl text-sm text-muted">
              Newest listings from the catalog — updated automatically whenever
              the dataset changes. No manual curation needed.
            </p>
          </div>
          <Link
            href="/recently-added"
            className="rounded-full border border-accent/30 bg-accent/10 px-5 py-2.5 text-sm font-bold text-accent hover:bg-accent/15"
          >
            View all new finds →
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {BUCKETS.map((bucket) => {
            const products = bucket.getProducts();
            if (products.length === 0) return null;

            return (
              <div
                key={bucket.title}
                className="rounded-2xl border border-border bg-surface/35 p-5"
              >
                <h3 className="text-lg font-black">{bucket.title}</h3>
                <p className="mt-1 text-xs text-muted">{bucket.subtitle}</p>
                <div className="mt-4">
                  <ProductGrid products={products} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
