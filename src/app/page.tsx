import type { Metadata } from "next";
import { Suspense } from "react";
import CatalogPanel from "@/components/CatalogPanel";
import DataFreshness from "@/components/DataFreshness";
import DiscoveryHero from "@/components/DiscoveryHero";
import DiscoveryRail from "@/components/DiscoveryRail";
import HomepageBrands from "@/components/HomepageBrands";
import HomepageCategories from "@/components/HomepageCategories";
import HomepageCollections from "@/components/HomepageCollections";
import HomepageFaq from "@/components/HomepageFaq";
import RecentlyViewedRail from "@/components/RecentlyViewedRail";
import ProductGridSkeleton from "@/components/ProductGridSkeleton";
import SchemaScript from "@/components/SchemaScript";
import TrustStrip from "@/components/TrustStrip";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/constants";
import { getHomepageRails } from "@/lib/homepage-rails";
import { getBrandsFromProducts } from "@/lib/brands";
import { getAllProducts, getCategories } from "@/lib/products";
import { buildWebPageSchema } from "@/lib/schema";
import { buildHomepageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildHomepageMetadata();

export default function HomePage() {
  const products = getAllProducts();
  const categories = getCategories();
  const brands = getBrandsFromProducts(products);
  const rails = getHomepageRails(12);

  return (
    <>
      <SchemaScript
        data={buildWebPageSchema({
          name: SITE_NAME,
          description: SITE_DESCRIPTION,
          path: "/",
          aboutOrganization: true,
        })}
      />

      <DiscoveryHero />

      <DiscoveryRail
        title="Trending Today"
        subtitle="Most viewed and clicked in the last 24 hours"
        href="/most-popular-finds-now"
        products={rails.popularToday}
        showTrendingScore
      />

      <DiscoveryRail
        title="Just Added"
        subtitle="Fresh listings from the latest catalog sync"
        href="/recently-added"
        products={rails.addedToday}
      />

      {rails.editorsPicks.length > 0 ? (
        <DiscoveryRail
          title="Editor's Picks"
          subtitle="QC-linked standouts with strong presentation"
          href="/editors-picks"
          products={rails.editorsPicks}
        />
      ) : null}

      {rails.bestUnder20.length > 0 ? (
        <DiscoveryRail
          title="Best Under $20"
          subtitle="Budget-friendly finds that still look premium"
          href="/best-under-30"
          products={rails.bestUnder20}
        />
      ) : null}

      <DiscoveryRail
        title="Most Viewed This Week"
        subtitle="Trending sneakers, jackets and streetwear"
        href="/trending"
        products={rails.popularWeek}
        showTrendingScore
      />

      <TrustStrip compact />

      <HomepageCategories categories={categories} />
      <HomepageCollections />
      <HomepageBrands hideSpotlight />

      <RecentlyViewedRail />

      <HomepageFaq />

      <section className="px-4 pb-2 sm:px-6">
        <div className="mx-auto max-w-7xl text-center">
          <DataFreshness variant="block" label="Catalog synced" />
        </div>
      </section>

      <section id="browse" className="scroll-mt-24 px-4 pt-4 sm:px-6">
        <div className="mx-auto max-w-7xl pb-4">
          <h2 className="text-2xl font-black">Browse All Finds</h2>
          <p className="mt-1 text-sm text-muted">
            Search, filter, and explore the full catalog.
          </p>
        </div>
      </section>

      <Suspense
        fallback={
          <section className="px-4 pb-16 sm:px-6">
            <div className="panel-shell mx-auto max-w-7xl rounded-[32px] border border-border-strong bg-panel p-5 sm:p-7">
              <ProductGridSkeleton count={12} />
            </div>
          </section>
        }
      >
        <CatalogPanel
          products={products}
          categories={categories}
          brands={brands}
          basePath="/"
        />
      </Suspense>
    </>
  );
}
