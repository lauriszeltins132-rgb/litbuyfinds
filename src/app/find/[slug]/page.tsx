import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductDetailView from "@/components/ProductDetailView";
import ProductGrid from "@/components/ProductGrid";
import { getDisplayBrand } from "@/lib/product-validation";
import {
  getMoreFromBrand,
  getPopularInCategory,
  getSimilarFinds,
} from "@/lib/discovery";
import {
  getProductDescription,
  getProductFacts,
  getProductHighlights,
  getProductSeoDescription,
  getProductSeoTitle,
} from "@/lib/product-details";
import {
  getProductEngagementStats,
  isProductTrending,
} from "@/lib/analytics-store";
import { getAllProductSlugs, getProductBySlug, getProductSlug, slugify } from "@/lib/slugs";
import { getLatestProducts, getTrendingProducts } from "@/lib/products";
import { buildPageMetadata } from "@/lib/seo";
import FloatingBackButton from "@/components/FloatingBackButton";
import ProductJsonLd from "@/components/ProductJsonLd";
import SchemaScript from "@/components/SchemaScript";
import BestOfLinks from "@/components/BestOfLinks";
import RelatedGuides from "@/components/RelatedGuides";
import RecordRecentlyViewed from "@/components/RecordRecentlyViewed";
import RecentlyViewedRail from "@/components/RecentlyViewedRail";
import TrackProductView from "@/components/TrackProductView";
import RelatedPages from "@/components/RelatedPages";
import TelegramDailyFindsCta from "@/components/TelegramDailyFindsCta";
import { getRelatedGuidesForProduct } from "@/lib/related-guides";
import { buildBreadcrumbSchema } from "@/lib/schema";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = true;

/** Pre-render a capped set at build time; remaining PDPs generate on first visit. */
export async function generateStaticParams() {
  const priority = [
    ...getTrendingProducts(),
    ...getLatestProducts(),
  ];
  const seen = new Set<string>();
  const slugs: string[] = [];

  for (const product of priority) {
    const slug = getProductSlug(product);
    if (seen.has(slug)) continue;
    seen.add(slug);
    slugs.push(slug);
    if (slugs.length >= 200) break;
  }

  if (slugs.length < 200) {
    for (const slug of getAllProductSlugs()) {
      if (seen.has(slug)) continue;
      seen.add(slug);
      slugs.push(slug);
      if (slugs.length >= 200) break;
    }
  }

  return slugs.map((slug) => ({ slug }));
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
    path: `/find/${getProductSlug(product)}`,
    image: product.image || undefined,
  });
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const canonicalSlug = getProductSlug(product);
  if (slug !== canonicalSlug) {
    redirect(`/find/${canonicalSlug}`);
  }

  const brand = getDisplayBrand(product);
  const similar = getSimilarFinds(product, 8);
  const moreFromBrand = brand ? getMoreFromBrand(product, brand) : [];
  const popularInCategory = getPopularInCategory(product);
  const categoryHref =
    product.group === "featured"
      ? product.category_slug === "trending-now"
        ? "/trending"
        : "/latest"
      : `/categories/${product.category_slug}`;
  const facts = getProductFacts(product, categoryHref);
  const engagement = getProductEngagementStats(product.id);
  const showTrending = isProductTrending(product.id);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Finds", href: "/finds" },
    { label: product.category, href: categoryHref },
    { label: facts.displayName },
  ];

  return (
    <>
      <ProductJsonLd product={product} slug={slug} />
      <SchemaScript
        data={buildBreadcrumbSchema(breadcrumbItems, `/find/${slug}`)}
      />
      <FloatingBackButton />
      <TrackProductView product={product} />
      <RecordRecentlyViewed product={product} />
      <Breadcrumbs
        items={breadcrumbItems}
        currentPath={`/find/${slug}`}
        compact
      />

      <ProductDetailView
        product={product}
        facts={facts}
        description={getProductDescription(product)}
        highlights={getProductHighlights(product)}
        brand={brand}
        categoryHref={categoryHref}
        engagementViews={engagement.views}
        engagementSaves={engagement.saves}
        engagementTrending={showTrending}
      />

      {similar.length > 0 ? (
        <section className="px-4 pt-4 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-xl font-black">Similar finds</h2>
            <p className="mt-1 text-sm text-muted">
              You might also like these picks in {product.category}
              {brand ? ` and ${brand}` : ""}.
            </p>
            <div className="mt-6">
              <ProductGrid products={similar} />
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
      <TelegramDailyFindsCta />
      <RelatedPages
        currentPath={`/find/${slug}`}
        brandSlug={brand ? slugify(brand) : undefined}
        categorySlug={product.category_slug}
      />

      <section className="px-4 pb-16 pt-4 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-4 text-center">
          <Link href="/finds" className="text-sm font-bold text-accent hover:underline">
            Finds hub →
          </Link>
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
          <Link href="/finds" className="text-sm font-bold text-muted hover:text-accent">
            Finds hub →
          </Link>
          <Link href="/litbuy-spreadsheet" className="text-sm font-bold text-muted hover:text-accent">
            Spreadsheet →
          </Link>
          <Link href="/litbuy-coupons" className="text-sm font-bold text-muted hover:text-accent">
            Coupons →
          </Link>
          <Link href="/litbuy-discord" className="text-sm font-bold text-muted hover:text-accent">
            Discord →
          </Link>
          <Link href="/trending" className="text-sm font-bold text-muted hover:text-accent">
            Trending finds →
          </Link>
          <Link href="/latest-finds" className="text-sm font-bold text-muted hover:text-accent">
            Latest finds →
          </Link>
          <Link href="/litbuy-qc" className="text-sm font-bold text-muted hover:text-accent">
            QC photos →
          </Link>
          <Link href="/guides/beginner-guide-to-litbuy" className="text-sm font-bold text-muted hover:text-accent">
            Beginner guide →
          </Link>
        </div>
      </section>
    </>
  );
}
