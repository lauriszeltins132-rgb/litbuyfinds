import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CatalogPanel from "@/components/CatalogPanel";
import RelatedSeoLinks from "@/components/RelatedSeoLinks";
import {
  getBrandBySlug,
  getBrandsFromProducts,
  getProductsByBrandSlug,
} from "@/lib/brands";
import { getAllProducts, getCategories } from "@/lib/products";
import { getBrandSeo } from "@/lib/seo-content";
import { buildPageMetadata } from "@/lib/seo";

type BrandPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getBrandsFromProducts(getAllProducts()).map((brand) => ({
    slug: brand.slug,
  }));
}

export async function generateMetadata({
  params,
}: BrandPageProps): Promise<Metadata> {
  const { slug } = await params;
  const brand = getBrandBySlug(getAllProducts(), slug);
  if (!brand) return {};

  const copy = getBrandSeo(slug, brand.name, brand.count);
  return buildPageMetadata({
    title: copy.title,
    description: copy.description,
    path: `/brands/${slug}`,
  });
}

export default async function BrandLandingPage({ params }: BrandPageProps) {
  const { slug } = await params;
  const allProducts = getAllProducts();
  const brand = getBrandBySlug(allProducts, slug);

  if (!brand) {
    notFound();
  }

  const products = getProductsByBrandSlug(allProducts, slug);
  const copy = getBrandSeo(slug, brand.name, brand.count);
  const relatedBrands = getBrandsFromProducts(allProducts)
    .filter((item) => item.slug !== slug)
    .slice(0, 6);

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Brands", href: "/brands" },
          { label: brand.name },
        ]}
      />

      <section className="px-4 pb-6 pt-4 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
            Brand
          </p>
          <h1 className="mt-3 text-3xl font-black sm:text-4xl">{copy.title}</h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted">
            {copy.intro}
          </p>
          <p className="mt-3 text-sm text-muted">
            {brand.count.toLocaleString()} {brand.name} finds indexed
          </p>

          {relatedBrands.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {relatedBrands.map((item) => (
                <Link
                  key={item.slug}
                  href={`/brands/${item.slug}`}
                  className="rounded-full border border-border px-3 py-1.5 text-xs font-bold text-muted hover:border-accent/40 hover:text-accent"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <RelatedSeoLinks />

      <Suspense fallback={<div className="py-24 text-center text-muted">Loading...</div>}>
        <CatalogPanel
          products={products}
          categories={getCategories()}
          brands={getBrandsFromProducts(allProducts)}
          basePath={`/brands/${slug}`}
        />
      </Suspense>
    </>
  );
}
