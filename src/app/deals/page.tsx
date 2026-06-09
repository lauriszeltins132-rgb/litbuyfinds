import type { Metadata } from "next";
import { Suspense } from "react";
import CatalogHero from "@/components/CatalogHero";
import CatalogPanel from "@/components/CatalogPanel";
import { getBrandsFromProducts } from "@/lib/brands";
import { getCategories, getDealProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Deals Under $30",
  description: "Budget-friendly LitBuy finds under $30 — curated picks with verified buy links.",
};

export default function DealsPage() {
  const products = getDealProducts(30);
  const brands = getBrandsFromProducts(products);

  return (
    <>
      <CatalogHero
        badge="Budget picks"
        title="Deals Under $30"
        subtitle="Solid finds that won't break the bank — sorted with photos first."
      />
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
