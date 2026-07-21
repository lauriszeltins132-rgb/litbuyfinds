import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CatalogPanel from "@/components/CatalogPanel";
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
  return buildPageMetadata({
    title: copy.title,
    description: copy.description,
    path: `/categories/${slug}`,
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

      <section className="px-4 pb-6 pt-4 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
            Category
          </p>
          <h1 className="mt-3 text-3xl font-black sm:text-4xl">{copy.title}</h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted">
            {copy.intro}
          </p>
          <p className="mt-3 text-sm text-muted">
            {resolved.count.toLocaleString()} products indexed
          </p>
        </div>
      </section>

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
    </>
  );
}
