import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import RelatedPages from "@/components/RelatedPages";
import SchemaScript from "@/components/SchemaScript";
import { BrandGroupGrid } from "@/components/brand/BrandGroupGrid";
import BrandsHubSeo from "@/components/brand/BrandsHubSeo";
import { getBrandsFromProducts } from "@/lib/brands";
import {
  BRANDS_HUB_FAQS,
  getBrandsHubGroups,
  getBrandsHubItemList,
  getBrandsHubStats,
} from "@/lib/brands-hub";
import { getAllProducts } from "@/lib/products";
import {
  buildBreadcrumbSchema,
  buildCollectionPageSchema,
  buildFaqSchema,
  buildItemListSchema,
} from "@/lib/schema";
import { buildPageMetadata } from "@/lib/seo";

const HUB_DESCRIPTION =
  "Discover Nike, Moncler, Chrome Hearts, Stussy, Balenciaga, Stone Island and hundreds of other LitBuy brands with QC photos, verified links and daily updates.";

export const metadata: Metadata = buildPageMetadata({
  title: "Browse All LitBuy Brands",
  description: HUB_DESCRIPTION,
  path: "/brands",
});

export default function BrandsPage() {
  const brands = getBrandsFromProducts(getAllProducts());
  const groups = getBrandsHubGroups(brands);
  const stats = getBrandsHubStats();
  const pagePath = "/brands";

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Brands" },
  ];

  return (
    <>
      <SchemaScript data={buildBreadcrumbSchema(breadcrumbs, pagePath)} />
      <SchemaScript data={buildFaqSchema([...BRANDS_HUB_FAQS])} />
      <SchemaScript
        data={buildCollectionPageSchema({
          name: "Browse All LitBuy Brands",
          description: HUB_DESCRIPTION,
          path: pagePath,
          numberOfItems: brands.length,
        })}
      />
      <SchemaScript
        data={buildItemListSchema({
          name: "Top LitBuy Brands",
          description: "Most popular brand pages on LitBuy Finds",
          path: pagePath,
          items: getBrandsHubItemList(brands, 24),
        })}
      />

      <Breadcrumbs items={breadcrumbs} currentPath={pagePath} />

      <section className="border-b border-border/50 px-4 pb-8 pt-4 sm:px-6 sm:pb-10 sm:pt-6">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
            Brand directory
          </p>
          <h1 className="mt-3 text-3xl font-black sm:text-4xl">Browse All LitBuy Brands</h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted">
            {HUB_DESCRIPTION}
          </p>
          <p className="mt-3 text-sm text-muted">
            {stats.totalBrands.toLocaleString()} brands ·{" "}
            {stats.totalProducts.toLocaleString()} finds indexed · Updated daily
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/collections/best-nike-finds"
              className="rounded-full border border-border px-3 py-1.5 text-xs font-bold hover:border-accent/40 hover:text-accent"
            >
              Best Nike finds
            </Link>
            <Link
              href="/collections/best-moncler-finds"
              className="rounded-full border border-border px-3 py-1.5 text-xs font-bold hover:border-accent/40 hover:text-accent"
            >
              Best Moncler finds
            </Link>
            <Link
              href="/collections/best-qc-approved-finds"
              className="rounded-full border border-border px-3 py-1.5 text-xs font-bold hover:border-accent/40 hover:text-accent"
            >
              QC-approved finds
            </Link>
            <Link
              href="/guides/beginner-guide-to-litbuy"
              className="rounded-full border border-border px-3 py-1.5 text-xs font-bold hover:border-accent/40 hover:text-accent"
            >
              How to buy guide
            </Link>
          </div>
        </div>
      </section>

      {groups.map((group) => (
        <BrandGroupGrid
          key={group.id}
          title={group.title}
          description={group.description}
          brands={group.brands}
        />
      ))}

      <section className="px-4 pb-8 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-xl font-black sm:text-2xl">All brands A–Z</h2>
          <p className="mt-2 text-sm text-muted">
            Complete directory — {brands.length.toLocaleString()} indexed brand pages
          </p>
          <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {brands.map((brand) => (
              <li key={brand.slug}>
                <Link
                  href={`/brands/${brand.slug}`}
                  className="panel-shell block rounded-xl border border-border px-3 py-2.5 text-sm transition-colors hover:border-accent/35"
                >
                  <span className="font-semibold text-foreground">{brand.name}</span>
                  <span className="mt-0.5 block text-xs text-muted">
                    {brand.count} finds
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <BrandsHubSeo brands={brands} />
      <RelatedPages currentPath={pagePath} />
    </>
  );
}
