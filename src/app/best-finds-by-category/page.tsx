import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getCategories } from "@/lib/products";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Best Finds by Category",
  description:
    "Browse the best LitBuy finds by category — shoes, hoodies, jackets, accessories, and more with verified agent links.",
  path: "/best-finds-by-category",
});

const TOP_LIST_LINKS = [
  { href: "/top-rep-sneakers", label: "Top rep sneakers" },
  { href: "/top-streetwear-finds", label: "Top streetwear" },
  { href: "/top-designer-bags", label: "Designer bags" },
  { href: "/best-qc-approved-finds", label: "QC approved" },
  { href: "/most-popular-finds-now", label: "Popular now" },
  { href: "/top-litbuy-finds-this-month", label: "Top this month" },
];

export default function BestFindsByCategoryPage() {
  const categories = getCategories().filter((category) => category.group === "category");

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Best finds by category" },
        ]}
        currentPath="/best-finds-by-category"
      />

      <section className="px-4 pb-6 pt-4 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
            Category hub
          </p>
          <h1 className="mt-2 text-3xl font-black sm:text-4xl">Best finds by category</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
            Jump into the strongest lanes of the catalog — sneakers, layers, accessories,
            and more. Each category page includes filters, brands, and related guides.
          </p>
        </div>
      </section>

      <section className="px-4 pb-8 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={category.href}
              className="panel-shell rounded-2xl border border-border p-5 transition hover:border-accent/35"
            >
              <h2 className="text-lg font-black">{category.name}</h2>
              <p className="mt-1 text-sm text-muted">
                {category.count.toLocaleString()} finds indexed
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6">
        <div className="mx-auto max-w-7xl rounded-2xl border border-border bg-surface/35 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">
            Curated top lists
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {TOP_LIST_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full border border-border px-3 py-1.5 text-xs font-bold text-muted hover:border-accent/40 hover:text-accent"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
