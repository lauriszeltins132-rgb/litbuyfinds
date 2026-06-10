import Link from "next/link";
import { Suspense } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CatalogPanel from "@/components/CatalogPanel";
import RelatedSeoLinks from "@/components/RelatedSeoLinks";
import { getBrandsFromProducts } from "@/lib/brands";
import type { CollectionConfig } from "@/lib/collections";
import { getCategories } from "@/lib/products";

type CollectionLandingProps = {
  collection: CollectionConfig;
};

export default function CollectionLanding({ collection }: CollectionLandingProps) {
  const products = collection.getProducts();
  const brands = getBrandsFromProducts(products);

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: collection.title },
        ]}
        currentPath={collection.href}
      />

      <section className="px-4 pb-6 pt-4 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
            {collection.badge}
          </p>
          <h1 className="mt-3 text-3xl font-black sm:text-4xl">{collection.title}</h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted">
            {collection.intro}
          </p>
          <p className="mt-3 text-sm text-muted">
            {products.length.toLocaleString()} products in this collection
          </p>
        </div>
      </section>

      <RelatedSeoLinks />

      <Suspense fallback={<div className="py-24 text-center text-muted">Loading...</div>}>
        <CatalogPanel
          products={products}
          categories={getCategories()}
          brands={brands}
          basePath={collection.href}
        />
      </Suspense>

      <section className="px-4 pb-10 sm:px-6">
        <div className="mx-auto max-w-7xl text-center">
          <Link href="/" className="text-sm font-bold text-accent hover:underline">
            ← Back to all finds
          </Link>
        </div>
      </section>
    </>
  );
}
