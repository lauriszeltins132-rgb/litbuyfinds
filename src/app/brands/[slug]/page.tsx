import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CatalogPanel from "@/components/CatalogPanel";
import RelatedGuides from "@/components/RelatedGuides";
import SignupCard from "@/components/SignupCard";
import RelatedSeoLinks from "@/components/RelatedSeoLinks";
import { getRelatedGuidesForBrand } from "@/lib/related-guides";
import BrandProductRails from "@/components/brand/BrandProductRails";
import BrandSeoCollapsible from "@/components/brand/BrandSeoCollapsible";
import BrandStats from "@/components/brand/BrandStats";
import BestOfLinks from "@/components/BestOfLinks";
import LastUpdated from "@/components/LastUpdated";
import RelatedPages from "@/components/RelatedPages";
import SchemaScript from "@/components/SchemaScript";
import { buildCollectionPageSchema } from "@/lib/schema";
import {
  getBrandBySlug,
  getBrandsFromProducts,
  getProductsByBrandSlug,
} from "@/lib/brands";
import { getAllProducts, getCategories } from "@/lib/products";
import { getBrandPageRails } from "@/lib/brand-page-rails";
import { getBrandSeo } from "@/lib/seo-content";
import { getBrandCollectionHref } from "@/lib/brand-collections";
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
  const collectionHref = getBrandCollectionHref(slug);
  const pagePath = `/brands/${slug}`;
  const rails = getBrandPageRails(slug, brand.name, products);

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

      <section className="px-4 pb-2 pt-4 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
            Brand finds
          </p>
          <h1 className="mt-3 text-3xl font-black sm:text-4xl">{copy.title}</h1>
          <p className="mt-3 max-w-2xl text-sm text-muted">
            Browse {brand.name} products with photos, QC references, source links,
            and your preferred buying agent.
          </p>
          <LastUpdated className="mt-3" />
          {collectionHref ? (
            <p className="mt-3">
              <Link
                href={collectionHref}
                className="text-sm font-bold text-accent hover:underline"
              >
                View {brand.name} collection →
              </Link>
            </p>
          ) : null}
        </div>
      </section>

      <BrandProductRails brandSlug={slug} brandName={brand.name} rails={rails} />

      <BrandStats brandName={brand.name} rails={rails} />

      <section className="px-4 pb-2 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-xl font-black">Browse all {brand.name} finds</h2>
          <p className="mt-1 text-sm text-muted">
            Filter by category and price in the full catalog below.
          </p>
        </div>
      </section>

      <Suspense fallback={<div className="py-24 text-center text-muted">Loading...</div>}>
        <CatalogPanel
          products={products}
          categories={getCategories()}
          brands={getBrandsFromProducts(allProducts)}
          basePath={pagePath}
        />
      </Suspense>

      <BrandSeoCollapsible brandSlug={slug} brandName={brand.name} intro={copy.intro} />

      <RelatedGuides links={getRelatedGuidesForBrand(slug)} />
      <BestOfLinks brandSlug={slug} />
      <SignupCard location={`brand_signup_${slug}`} variant="compact" />
      <RelatedSeoLinks />
      <RelatedPages currentPath={pagePath} brandSlug={slug} />
    </>
  );
}
