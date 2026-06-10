import type { Metadata } from "next";
import { Suspense } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CatalogPanel from "@/components/CatalogPanel";
import RelatedSeoLinks from "@/components/RelatedSeoLinks";
import DealSeoBlock from "@/components/seo/DealSeoBlock";
import SchemaScript from "@/components/SchemaScript";
import { getBrandsFromProducts } from "@/lib/brands";
import { getCategories, getDealProducts } from "@/lib/products";
import { buildCollectionPageSchema } from "@/lib/schema";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Deals Under $30",
  description:
    "Budget-friendly LitBuy finds under $30 — curated picks with verified buy links and QC references.",
  path: "/deals",
});

export default function DealsPage() {
  const products = getDealProducts(30);
  const brands = getBrandsFromProducts(products);

  return (
    <>
      <SchemaScript
        data={buildCollectionPageSchema({
          name: "Deals Under $30",
          description:
            "Budget-friendly LitBuy finds under $30 with verified buy links.",
          path: "/deals",
          numberOfItems: products.length,
        })}
      />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Deals Under $30" },
        ]}
        currentPath="/deals"
      />

      <section className="px-4 pb-6 pt-4 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
            Budget picks
          </p>
          <h1 className="mt-3 text-3xl font-black sm:text-4xl">Deals Under $30</h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted">
            Solid finds that won&apos;t break the bank — sorted with photos first.
            Perfect for first hauls, gift fillers, and everyday rotation pieces.
          </p>
          <p className="mt-3 text-sm text-muted">
            {products.length.toLocaleString()} deals indexed
          </p>
        </div>
      </section>

      <DealSeoBlock products={products} />
      <RelatedSeoLinks />

      <Suspense fallback={<div className="py-24 text-center text-muted">Loading...</div>}>
        <CatalogPanel
          products={products}
          categories={getCategories()}
          brands={brands}
          basePath="/deals"
        />
      </Suspense>
    </>
  );
}
