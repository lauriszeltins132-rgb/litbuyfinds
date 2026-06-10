import type { Metadata } from "next";
import { Suspense } from "react";
import { SITE_DESCRIPTION } from "@/lib/constants";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Premium LitBuy Product Discovery",
  description: SITE_DESCRIPTION,
  path: "/",
});
import BrandSpotlight from "@/components/BrandSpotlight";
import CatalogPanel from "@/components/CatalogPanel";
import DailyDrop from "@/components/DailyDrop";
import DiscoveryHero from "@/components/DiscoveryHero";
import DiscoveryRail from "@/components/DiscoveryRail";
import OfferCallout from "@/components/OfferCallout";
import PopularBrands from "@/components/PopularBrands";
import RecentlyViewedRail from "@/components/RecentlyViewedRail";
import StatsStrip from "@/components/StatsStrip";
import {
  getBudgetFinds,
  getEditorsPicks,
  getHiddenGems,
  getMostSavedPicks,
  getNewestFinds,
  getRecentlyAdded,
  getTrendingThisWeek,
} from "@/lib/discovery";
import { getBrandsFromProducts } from "@/lib/brands";
import { getAllProducts, getCategories } from "@/lib/products";

export default function HomePage() {
  const products = getAllProducts();
  const categories = getCategories();
  const brands = getBrandsFromProducts(products);

  return (
    <>
      <DiscoveryHero />
      <OfferCallout />
      <StatsStrip />
      <DailyDrop />
      <RecentlyViewedRail />

      <DiscoveryRail
        title="Trending This Week"
        subtitle="What people are browsing right now"
        href="/trending"
        products={getTrendingThisWeek()}
        showTrendingScore
      />

      <DiscoveryRail
        title="Newest Finds"
        subtitle="Fresh additions from the latest drops sheet"
        href="/latest"
        products={getNewestFinds()}
      />

      <DiscoveryRail
        title="Editor's Picks"
        subtitle="Hand-selected listings with photos and QC"
        href="/trending"
        products={getEditorsPicks()}
      />

      <DiscoveryRail
        title="Hidden Gems"
        subtitle="Strong quality picks outside the main spotlight"
        href="/categories/shoes"
        products={getHiddenGems()}
      />

      <DiscoveryRail
        title="Best Under $30"
        subtitle="Budget-friendly finds that still look premium"
        href="/deals"
        products={getBudgetFinds()}
      />

      <DiscoveryRail
        title="Most Saved"
        subtitle="High-quality picks people bookmark again and again"
        href="/trending"
        products={getMostSavedPicks()}
      />

      <BrandSpotlight />
      <PopularBrands />

      <DiscoveryRail
        title="Recently Added"
        subtitle="Latest arrivals across the catalog"
        href="/latest"
        products={getRecentlyAdded()}
      />

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
