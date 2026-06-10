import type { Metadata } from "next";
import Link from "next/link";
import CatalogHero from "@/components/CatalogHero";
import { getBrandsFromProducts } from "@/lib/brands";
import { getAllProducts } from "@/lib/products";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Shop by Brand",
  description: "Browse finds organized by brand — Nike, Jordan, Balenciaga and more.",
  path: "/brands",
});

export default function BrandsPage() {
  const brands = getBrandsFromProducts(getAllProducts());

  return (
    <>
      <CatalogHero
        badge="Brand index"
        title="Shop by Brand"
        subtitle="Jump straight to the labels people search for most."
      />
      <section className="px-4 pb-16 sm:px-6">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {brands.map((brand) => (
            <Link
              key={brand.slug}
              href={`/brands/${brand.slug}`}
              className="panel-shell rounded-2xl border border-border p-5 transition-colors hover:border-accent/35"
            >
              <h2 className="font-bold text-foreground hover:text-accent">
                {brand.name}
              </h2>
              <p className="mt-1 text-sm text-muted">
                {brand.count} finds
              </p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
