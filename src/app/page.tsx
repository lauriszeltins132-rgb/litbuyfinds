import type { Metadata } from "next";
import { Suspense } from "react";
import CatalogPanel from "@/components/CatalogPanel";
import DataFreshness from "@/components/DataFreshness";
import DiscoveryHero from "@/components/DiscoveryHero";
import DiscoveryRail from "@/components/DiscoveryRail";
import HomepageBrands from "@/components/HomepageBrands";
import HomepageCategories from "@/components/HomepageCategories";
import HomepageFaq from "@/components/HomepageFaq";
import HomepageLitBuyResources from "@/components/HomepageLitBuyResources";
import HomepageWhyLitBuy from "@/components/HomepageWhyLitBuy";
import RecentlyViewedRail from "@/components/RecentlyViewedRail";
import TrustStrip from "@/components/TrustStrip";
import { getHomepageRails } from "@/lib/homepage-rails";
import { getBrandsFromProducts } from "@/lib/brands";
import { getAllProducts, getCategories } from "@/lib/products";
import { slugify } from "@/lib/slugs";
import { buildHomepageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildHomepageMetadata();

export default function HomePage() {
  const products = getAllProducts();
  const categories = getCategories();
  const brands = getBrandsFromProducts(products);
  const rails = getHomepageRails(12);

  return (
    <>
      <DiscoveryHero />

      <DiscoveryRail
        title="Popular Today"
        subtitle="Most viewed and clicked in the last 24 hours"
        href="/most-popular-finds-now"
        products={rails.popularToday}
        showTrendingScore
      />

      <HomepageWhyLitBuy location="homepage_after_popular" />

      <DiscoveryRail
        title="Popular This Week"
        subtitle="Trending sneakers, jackets and streetwear from the last 7 days"
        href="/trending"
        products={rails.popularWeek}
        showTrendingScore
      />

      <DiscoveryRail
        title="Recently Added"
        subtitle="Fresh Weidian, Taobao and LitBuy listings"
        href="/recently-added"
        products={rails.recentlyAdded}
      />

      <TrustStrip compact />

      <DiscoveryRail
        title="Top QC Finds"
        subtitle="QC-approved products with warehouse photo references"
        href="/best-qc-approved-finds"
        products={rails.topQcFinds}
      />

      <DiscoveryRail
        title="Most Saved This Week"
        subtitle="Products with the most clicks and saves"
        href="/most-popular-finds-now"
        products={rails.mostSavedWeek}
      />

      <DiscoveryRail
        title="Highest QC Rated"
        subtitle="QC-linked finds with strong engagement"
        href="/best-qc-items"
        products={rails.highestQcRated}
      />

      <DiscoveryRail
        title="Best Under $30"
        subtitle="Affordable picks that still look premium"
        href="/best-under-30"
        products={rails.budgetFinds}
      />

      <DiscoveryRail
        title="Rising This Week"
        subtitle="Gaining momentum across the catalog"
        href="/best-finds-this-week"
        products={rails.risingWeek}
      />

      <HomepageCategories categories={categories} />

      <HomepageLitBuyResources />

      {rails.trendingBrand ? (
        <DiscoveryRail
          title={`Trending: ${rails.trendingBrand.brand}`}
          subtitle="Popular finds from this brand right now"
          href={`/brands/${slugify(rails.trendingBrand.brand)}`}
          products={rails.trendingBrand.products}
        />
      ) : null}

      <HomepageBrands hideSpotlight />

      <DiscoveryRail
        title="Popular This Month"
        subtitle="Standout finds from the last 30 days"
        href="/top-litbuy-finds-this-month"
        products={rails.popularMonth}
      />

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
          <div className="py-24 text-center text-muted">Loading catalog...</div>
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
