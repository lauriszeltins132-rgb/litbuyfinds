import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CatalogPanel from "@/components/CatalogPanel";
import RelatedGuides from "@/components/RelatedGuides";
import SignupCard from "@/components/SignupCard";
import RelatedSeoLinks from "@/components/RelatedSeoLinks";
import { getRelatedGuidesForBrand } from "@/lib/related-guides";
import BrandSeoBlock from "@/components/seo/BrandSeoBlock";
import SchemaScript from "@/components/SchemaScript";
import { buildCollectionPageSchema } from "@/lib/schema";
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
    .slice(0, 8);
  const pagePath = `/brands/${slug}`;

  return (
    <>
      <SchemaScript
        data={buildCollectionPageSchema({
          name: copy.title,
          description: copy.description,
          path: pagePath,
          numberOfItems: brand.count,
        })}
      />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Brands", href: "/brands" },
          { label: brand.name },
        ]}
        currentPath={pagePath}
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

        </div>
      </section>

      <BrandSeoBlock
        brandSlug={slug}
        brandName={brand.name}
        intro={copy.intro}
        topProducts={products.slice(0, 5)}
        relatedBrands={relatedBrands}
      />

      <RelatedGuides links={getRelatedGuidesForBrand(slug)} />
      <SignupCard location={`brand_signup_${slug}`} variant="compact" />
      <RelatedSeoLinks />

      <Suspense fallback={<div className="py-24 text-center text-muted">Loading...</div>}>
        <CatalogPanel
          products={products}
          categories={getCategories()}
          brands={getBrandsFromProducts(allProducts)}
          basePath={pagePath}
        />
      </Suspense>
    </>
  );
}
