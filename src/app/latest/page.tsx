import type { Metadata } from "next";
import { Suspense } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CatalogPanel from "@/components/CatalogPanel";
import { getBrandsFromProducts } from "@/lib/brands";
import { getCategories, getLatestProducts } from "@/lib/products";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "New Finds",
  description:
    "Fresh LitBuy finds added recently — sneakers, streetwear, accessories, and more with verified buy links.",
  path: "/latest",
});

export default function LatestPage() {
  const products = getLatestProducts();
  const brands = getBrandsFromProducts(products);

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "New Finds" },
        ]}
      />
      <section className="px-4 pb-6 pt-4 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
            Fresh drops
          </p>
          <h1 className="mt-3 text-3xl font-black sm:text-4xl">New Finds</h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted">
            The newest additions from the LitBuy Finds catalog — updated from the
            latest spreadsheet drops with photos, pricing, and verified purchase links.
          </p>
        </div>
      </section>
      <Suspense fallback={<div className="py-24 text-center text-muted">Loading...</div>}>
        <CatalogPanel
          products={products}
          categories={getCategories()}
          brands={brands}
          basePath="/latest"
        />
      </Suspense>
    </>
  );
}
