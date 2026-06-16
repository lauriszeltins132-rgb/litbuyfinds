import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductDetailView from "@/components/ProductDetailView";
import ProductGrid from "@/components/ProductGrid";
import { getDisplayBrand } from "@/lib/product-validation";
import {
  getMoreFromBrand,
  getPopularInCategory,
  getRelatedProducts,
  getYouMayAlsoLike,
} from "@/lib/discovery";
import {
  getProductDescription,
  getProductFacts,
  getProductHighlights,
  getProductSeoDescription,
  getProductSeoTitle,
} from "@/lib/product-details";
import { getAllProductSlugs, getProductBySlug, slugify } from "@/lib/slugs";
import { buildPageMetadata } from "@/lib/seo";
import FloatingBackButton from "@/components/FloatingBackButton";
import ProductJsonLd from "@/components/ProductJsonLd";
import BestOfLinks from "@/components/BestOfLinks";
import RelatedGuides from "@/components/RelatedGuides";
import RecordRecentlyViewed from "@/components/RecordRecentlyViewed";
import RecentlyViewedRail from "@/components/RecentlyViewedRail";
import TrackProductView from "@/components/TrackProductView";
import { getRelatedGuidesForProduct } from "@/lib/related-guides";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllProductSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};

  return buildPageMetadata({
    title: getProductSeoTitle(product),
    description: getProductSeoDescription(product),
    path: `/find/${slug}`,
    image: product.image || undefined,
  });
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const brand = getDisplayBrand(product);
  const related = getRelatedProducts(product);
  const alsoLike = getYouMayAlsoLike(product);
  const moreFromBrand = brand ? getMoreFromBrand(product, brand) : [];
  const popularInCategory = getPopularInCategory(product);
  const categoryHref =
    product.group === "featured"
      ? product.category_slug === "trending-now"
        ? "/trending"
        : "/latest"
      : `/categories/${product.category_slug}`;
  const facts = getProductFacts(product, categoryHref);

  return (
    <>
      <ProductJsonLd product={product} slug={slug} />
      <FloatingBackButton />
      <TrackProductView product={product} />
      <RecordRecentlyViewed productId={product.id} />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: product.category, href: categoryHref },
          { label: facts.displayName },
        ]}
        currentPath={`/find/${slug}`}
      />

      <ProductDetailView
        product={product}
        facts={facts}
        description={getProductDescription(product)}
        highlights={getProductHighlights(product)}
        brand={brand}
        categoryHref={categoryHref}
      />

      {related.length > 0 ? (
        <section className="px-4 pt-4 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-xl font-black">Related LitBuy Finds</h2>
            <p className="mt-1 text-sm text-muted">
              More in {product.category}
              {brand ? ` and ${brand}` : ""}.
            </p>
            <div className="mt-6">
              <ProductGrid products={related} />
            </div>
          </div>
        </section>
      ) : null}

      {alsoLike.length > 0 ? (
        <section className="px-4 pt-4 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-xl font-black">Related Products</h2>
            <p className="mt-1 text-sm text-muted">
              Other picks in a similar price range and style.
            </p>
            <div className="mt-6">
              <ProductGrid products={alsoLike} />
            </div>
          </div>
        </section>
      ) : null}

      {moreFromBrand.length > 0 ? (
        <section className="px-4 pt-4 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-xl font-black">More From This Brand</h2>
            <p className="mt-1 text-sm text-muted">
              Popular {brand} finds in the catalog.
            </p>
            <div className="mt-6">
              <ProductGrid products={moreFromBrand} />
            </div>
          </div>
        </section>
      ) : null}

      {popularInCategory.length > 0 ? (
        <section className="px-4 pt-4 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-xl font-black">Popular in {product.category}</h2>
            <p className="mt-1 text-sm text-muted">
              Trending picks from this category.
            </p>
            <div className="mt-6">
              <ProductGrid products={popularInCategory} />
            </div>
          </div>
        </section>
      ) : null}

      <RelatedGuides links={getRelatedGuidesForProduct(product)} />

      <BestOfLinks
        categorySlug={product.category_slug}
        brandSlug={brand ? slugify(brand) : undefined}
        maxPrice={product.price ?? undefined}
      />

      <RecentlyViewedRail excludeProductId={product.id} title="Your recently viewed" />

      <section className="px-4 pb-16 pt-4 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-4 text-center">
          <Link href={categoryHref} className="text-sm font-bold text-accent hover:underline">
            Browse more in {product.category} →
          </Link>
          {brand ? (
            <Link
              href={`/brands/${slugify(brand)}`}
              className="text-sm font-bold text-accent hover:underline"
            >
              More {brand} finds →
            </Link>
          ) : null}
          <Link href="/recently-added" className="text-sm font-bold text-muted hover:text-accent">
            Recently added →
          </Link>
          <Link href="/guides/beginner-guide-to-litbuy" className="text-sm font-bold text-muted hover:text-accent">
            New to LitBuy? Beginner guide →
          </Link>
          <Link href="/guides/how-to-check-qc-photos" className="text-sm font-bold text-muted hover:text-accent">
            How to check QC →
          </Link>
          <Link href="/how-to-buy" className="text-sm font-bold text-muted hover:text-accent">
            How to buy →
          </Link>
        </div>
      </section>
    </>
  );
}
