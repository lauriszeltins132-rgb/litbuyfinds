import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CatalogPanel from "@/components/CatalogPanel";
import DiscoveryRail from "@/components/DiscoveryRail";
import RelatedGuides from "@/components/RelatedGuides";
import SignupCard from "@/components/SignupCard";
import BestOfLinks from "@/components/BestOfLinks";
import RelatedPages from "@/components/RelatedPages";
import RelatedSeoLinks from "@/components/RelatedSeoLinks";
import { getRelatedGuidesForCategory } from "@/lib/related-guides";
import CategorySeoBlock from "@/components/seo/CategorySeoBlock";
import CollectionAiRefine from "@/components/ai/CollectionAiRefine";
import SchemaScript from "@/components/SchemaScript";
import { buildCollectionPageSchema } from "@/lib/schema";
import { getBrandsFromProducts } from "@/lib/brands";
import {
  CATEGORY_ALIAS_SLUGS,
  getResolvedCategorySeo,
  resolveCategorySlug,
} from "@/lib/category-aliases";
import { getCategories } from "@/lib/products";
import { buildPageMetadata } from "@/lib/seo";
import { sortByProductQuality } from "@/lib/product-quality-score";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const canonical = getCategories()
    .filter((category) => category.group === "category")
    .map((category) => ({ slug: category.slug }));

  const aliases = CATEGORY_ALIAS_SLUGS.map((slug) => ({ slug }));
  return [...canonical, ...aliases];
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const resolved = resolveCategorySlug(slug);
  if (!resolved) return {};

  const copy = getResolvedCategorySeo(resolved);
  const pagePath = `/categories/${slug}`;
  const canonicalPath =
    resolved.slug !== resolved.canonicalSlug
      ? `/categories/${resolved.canonicalSlug}`
      : pagePath;

  return buildPageMetadata({
    title: copy.title,
    description: copy.description,
    path: pagePath,
    canonicalPath,
  });
}

export default async function CategoryLandingPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const resolved = resolveCategorySlug(slug);

  if (!resolved) {
    notFound();
  }

  const copy = getResolvedCategorySeo(resolved);
  const brands = getBrandsFromProducts(resolved.products);
  const allCategories = getCategories();
  const relatedCategories = allCategories
    .filter((c) => c.slug !== resolved.slug && c.group === "category")
    .slice(0, 6);
  const pagePath = `/categories/${slug}`;
  const featuredProducts = sortByProductQuality(resolved.products).slice(0, 12);

  return (
    <>
      <SchemaScript
        data={buildCollectionPageSchema({
          name: copy.title,
          description: copy.description,
          path: pagePath,
          numberOfItems: resolved.count,
        })}
      />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Categories", href: "/categories" },
          { label: resolved.name },
        ]}
        currentPath={pagePath}
      />

      <section className="px-4 pb-4 pt-4 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
            Category
          </p>
          <h1 className="mt-3 text-3xl font-black sm:text-4xl">{copy.title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
            {copy.intro.split(/(?<=[.!?])\s+/).slice(0, 2).join(" ")}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              href="/latest-finds"
              className="rounded-full border border-border px-3 py-1 text-xs font-bold hover:border-accent/40 hover:text-accent"
            >
              Latest finds →
            </Link>
            <Link
              href="/litbuy-spreadsheet"
              className="rounded-full border border-border px-3 py-1 text-xs font-bold hover:border-accent/40 hover:text-accent"
            >
              LitBuy spreadsheet →
            </Link>
            <Link
              href="/guides/litbuy-spreadsheet-guide"
              className="rounded-full border border-border px-3 py-1 text-xs font-bold hover:border-accent/40 hover:text-accent"
            >
              Spreadsheet guide →
            </Link>
            <Link
              href="/litbuy-qc"
              className="rounded-full border border-border px-3 py-1 text-xs font-bold hover:border-accent/40 hover:text-accent"
            >
              QC database →
            </Link>
          </div>
          <p className="mt-3 text-sm font-semibold text-muted">
            {resolved.count.toLocaleString()} products indexed · QC photos on select listings
          </p>
        </div>
      </section>

      {featuredProducts.length > 0 ? (
        <DiscoveryRail
          title={`Featured ${resolved.name} finds`}
          subtitle="Top picks with photos and verified buy links"
          href={pagePath}
          products={featuredProducts}
          preloadImages
          tight
        />
      ) : null}

      <Suspense fallback={<div className="py-24 text-center text-muted">Loading...</div>}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <CollectionAiRefine
            categoryName={resolved.name}
            categorySlug={resolved.slug}
          />
        </div>
        <CatalogPanel
          products={resolved.products}
          categories={allCategories}
          brands={brands}
          basePath={resolved.href}
        />
      </Suspense>

      <CategorySeoBlock
        categorySlug={slug}
        categoryName={resolved.name}
        intro={copy.intro}
        brands={brands}
        relatedCategories={relatedCategories}
      />

      <RelatedGuides links={getRelatedGuidesForCategory(slug)} />
      <BestOfLinks categorySlug={resolved.slug} />
      <SignupCard location={`category_signup_${slug}`} variant="compact" />
      <RelatedSeoLinks />
      <RelatedPages currentPath={pagePath} categorySlug={resolved.slug} />
    </>
  );
}
