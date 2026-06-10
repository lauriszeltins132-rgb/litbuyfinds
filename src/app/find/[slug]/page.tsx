import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductDetailView from "@/components/ProductDetailView";
import ProductGrid from "@/components/ProductGrid";
import { extractBrand } from "@/lib/brands";
import { getRelatedProducts, getYouMayAlsoLike } from "@/lib/discovery";
import {
  getProductDescription,
  getProductHighlights,
  getProductSeoDescription,
  getProductSeoTitle,
} from "@/lib/product-details";
import { getAllProductSlugs, getProductBySlug, slugify } from "@/lib/slugs";
import { buildPageMetadata } from "@/lib/seo";
import ProductJsonLd from "@/components/ProductJsonLd";
import RecordRecentlyViewed from "@/components/RecordRecentlyViewed";
import TrackProductView from "@/components/TrackProductView";

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

  const brand = extractBrand(product.product_name);
  const related = getRelatedProducts(product);
  const alsoLike = getYouMayAlsoLike(product);
  const categoryHref =
    product.group === "featured"
      ? product.category_slug === "trending-now"
        ? "/trending"
        : "/latest"
      : `/categories/${product.category_slug}`;

  return (
    <>
      <ProductJsonLd product={product} slug={slug} />
      <TrackProductView product={product} />
      <RecordRecentlyViewed productId={product.id} />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: product.category, href: categoryHref },
          { label: product.product_name },
        ]}
        currentPath={`/find/${slug}`}
      />

      <ProductDetailView
        product={product}
        description={getProductDescription(product)}
        highlights={getProductHighlights(product)}
        brand={brand}
        categoryHref={categoryHref}
      />

      {related.length > 0 ? (
        <section className="px-4 pt-4 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-xl font-black">Similar finds</h2>
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
        <section className="px-4 py-10 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-xl font-black">You may also like</h2>
            <p className="mt-1 text-sm text-muted">
              Other picks in a similar price range and style.
            </p>
            <div className="mt-6">
              <ProductGrid products={alsoLike} />
            </div>
          </div>
        </section>
      ) : null}

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
          <Link href="/how-to-buy" className="text-sm font-bold text-muted hover:text-accent">
            How to buy →
          </Link>
        </div>
      </section>
    </>
  );
}
