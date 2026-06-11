import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductGrid from "@/components/ProductGrid";
import SchemaScript from "@/components/SchemaScript";
import {
  getNewThisMonth,
  getNewThisWeek,
  getNewToday,
  getRecencyPool,
} from "@/lib/recency";
import { buildCollectionPageSchema } from "@/lib/schema";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Recently Added LitBuy Finds",
  description:
    "See the newest LitBuy finds added today, this week, and this month. Fresh sneakers, streetwear, and accessories from the latest catalog sync.",
  path: "/recently-added",
});

const SECTIONS = [
  {
    id: "today",
    title: "New Today",
    description:
      "A rotating selection from the latest sheet — refreshes daily so there is always something new at the top.",
    getProducts: () => getNewToday(24),
  },
  {
    id: "week",
    title: "New This Week",
    description:
      "Recent arrivals buyers are bookmarking and adding to hauls right now.",
    getProducts: () => getNewThisWeek(48),
  },
  {
    id: "month",
    title: "New This Month",
    description:
      "The full latest-finds window plus recent high-ID catalog additions.",
    getProducts: () => getNewThisMonth(96),
  },
] as const;

export default function RecentlyAddedPage() {
  const pool = getRecencyPool();

  return (
    <>
      <SchemaScript
        data={buildCollectionPageSchema({
          name: "Recently Added Finds",
          description:
            "Newest products added to the LitBuy Finds catalog.",
          path: "/recently-added",
          numberOfItems: pool.length,
        })}
      />

      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Recently Added" },
        ]}
        currentPath="/recently-added"
      />

      <section className="px-4 pb-6 pt-4 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
            Fresh catalog
          </p>
          <h1 className="mt-3 text-3xl font-black sm:text-4xl">Recently Added</h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted">
            The newest listings from the LitBuy Finds catalog — pulled from the
            Latest Finds sheet and recent catalog updates. This page updates
            automatically when the dataset changes.
          </p>
          <p className="mt-3 text-sm text-muted">
            {pool.length.toLocaleString()} items in the recency pool
          </p>
        </div>
      </section>

      {SECTIONS.map((section) => {
        const products = section.getProducts();
        if (products.length === 0) return null;

        return (
          <section
            key={section.id}
            id={section.id}
            className="scroll-mt-24 px-4 pb-12 sm:px-6"
          >
            <div className="mx-auto max-w-7xl">
              <h2 className="text-xl font-black sm:text-2xl">{section.title}</h2>
              <p className="mt-2 max-w-2xl text-sm text-muted">
                {section.description}
              </p>
              <p className="mt-1 text-xs text-muted">
                {products.length.toLocaleString()} finds shown
              </p>
              <div className="mt-6">
                <ProductGrid products={products} />
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}
