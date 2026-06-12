import type { Metadata } from "next";
import { Suspense } from "react";
import CatalogPanel from "@/components/CatalogPanel";
import DataFreshness from "@/components/DataFreshness";
import DiscoveryHero from "@/components/DiscoveryHero";
import DiscoveryRail from "@/components/DiscoveryRail";
import HomepageBrands from "@/components/HomepageBrands";
import HomepageCategories from "@/components/HomepageCategories";
import NewToLitBuy from "@/components/NewToLitBuy";
import RecentlyAddedPreview from "@/components/RecentlyAddedPreview";
import RecentlyViewedRail from "@/components/RecentlyViewedRail";
import SignupCard from "@/components/SignupCard";
import StatsStrip from "@/components/StatsStrip";
import TrustStrip from "@/components/TrustStrip";
import { getBudgetFinds } from "@/lib/discovery";
import { getHomepageRails } from "@/lib/homepage-rails";
import { getBrandsFromProducts } from "@/lib/brands";
import { getAllProducts, getCategories } from "@/lib/products";
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
      <TrustStrip compact />

      <DiscoveryRail
        title="🔥 Popular Today"
        subtitle="Top clicked and viewed finds — refreshes daily"
        href="/most-popular-finds-now"
        products={rails.popularToday}
        showTrendingScore
      />

      <SignupCard location="homepage_signup_card" variant="intro" />

      <DiscoveryRail
        title="Trending This Week"
        subtitle="Featured momentum picks from the trending sheet"
        href="/trending"
        products={rails.trending}
        showTrendingScore
      />

      <RecentlyAddedPreview />

      <HomepageCategories categories={categories} />
      <HomepageBrands />

      <DiscoveryRail
        title="Best Under $30"
        subtitle="Budget-friendly finds that still look premium"
        href="/deals"
        products={getBudgetFinds()}
      />

      <RecentlyViewedRail />
      <NewToLitBuy />

      <StatsStrip />
      <section className="px-4 pb-2 sm:px-6">
        <div className="mx-auto max-w-7xl text-center">
          <DataFreshness variant="block" label="Catalog synced" />
        </div>
      </section>

      <section id="browse" className="scroll-mt-24 px-4 pt-4 sm:px-6">
        <div className="mx-auto max-w-7xl pb-4">
          <h2 className="text-2xl font-black">Browse All Finds</h2>
          <p className="mt-1 text-sm text-muted">
            Search, filter, and explore the full LitBuy Finds catalog.
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
