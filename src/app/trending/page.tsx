import type { Metadata } from "next";
import { Suspense } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CatalogPanel from "@/components/CatalogPanel";
import { getBrandsFromProducts } from "@/lib/brands";
import { getCategories, getTrendingProducts } from "@/lib/products";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Trending This Week",
  description:
    "Trending LitBuy finds this week — the most popular sneakers, fashion, and accessories with verified links and QC.",
  path: "/trending",
});

export default function TrendingPage() {
  const products = getTrendingProducts();
  const brands = getBrandsFromProducts(products);

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Trending" },
        ]}
      />
      <section className="px-4 pb-6 pt-4 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
            Trending now
          </p>
          <h1 className="mt-3 text-3xl font-black sm:text-4xl">Trending This Week</h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted">
            What people are browsing right now across the LitBuy Finds catalog —
            hand-picked from the trending sheet with photos, QC references, and buy links.
          </p>
        </div>
      </section>
      <Suspense fallback={<div className="py-24 text-center text-muted">Loading...</div>}>
        <CatalogPanel
          products={products}
          categories={getCategories()}
          brands={brands}
          basePath="/trending"
        />
      </Suspense>
    </>
  );
}
