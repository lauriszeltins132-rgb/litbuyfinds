import type { Metadata } from "next";
import { Suspense } from "react";
import HomepageCatalogSection from "@/components/HomepageCatalogSection";
import ContentFreshness from "@/components/ContentFreshness";
import DiscoveryHero from "@/components/DiscoveryHero";
import DiscoveryRail from "@/components/DiscoveryRail";
import HomepageDiscoveryTools from "@/components/HomepageDiscoveryTools";
import HomepageFindsDatabaseHub from "@/components/HomepageFindsDatabaseHub";
import RevealOnScroll from "@/components/RevealOnScroll";
import HomepageAuthorityHub from "@/components/HomepageAuthorityHub";
import HomepageBrands from "@/components/HomepageBrands";
import HomepageCategories from "@/components/HomepageCategories";
import HomepageCollections from "@/components/HomepageCollections";
import HomepageConversion from "@/components/HomepageConversion";
import HomepageFaq from "@/components/HomepageFaq";
import HomepageInternalLinks from "@/components/HomepageInternalLinks";
import HomepageSeoContent from "@/components/HomepageSeoContent";
import RecentlyViewedRail from "@/components/RecentlyViewedRail";
import ProductGridSkeleton from "@/components/ProductGridSkeleton";
import SchemaScript from "@/components/SchemaScript";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/constants";
import { getHomepageRails } from "@/lib/homepage-rails";
import {
  getDailyFindsTitle,
  getWeeklyFindsTitle,
} from "@/lib/freshness-dates";
import { getCategories } from "@/lib/products";
import { buildWebPageSchema } from "@/lib/schema";
import { buildHomepageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildHomepageMetadata();

/** Refresh discovery rails hourly so rotation and dedupe stay current. */
export const revalidate = 3600;

export default async function HomePage() {
  const categories = getCategories();
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

      <DiscoveryHero compact />

      <DiscoveryRail
        title={getDailyFindsTitle()}
        subtitle="Most viewed and clicked in the last 24 hours"
        href="/trending-today"
        products={rails.popularToday}
        showTrendingScore
        preloadImages
        freshness="updated-daily"
        tight
      />

      <HomepageFindsDatabaseHub />

      <RevealOnScroll>
        <DiscoveryRail
          title="Latest Finds"
          subtitle="Newest drops from the LitBuy spreadsheet sync"
          href="/latest-finds"
          products={rails.latestFinds}
          freshness="latest-updated"
        />
      </RevealOnScroll>

      <HomepageDiscoveryTools />

      {rails.editorsPicks.length > 0 ? (
        <RevealOnScroll>
          <DiscoveryRail
            title="Editor's Picks"
            subtitle="QC-linked standouts with strong presentation"
            href="/editors-picks"
            products={rails.editorsPicks}
          />
        </RevealOnScroll>
      ) : null}

      {rails.bestUnder20.length > 0 ? (
        <RevealOnScroll>
          <DiscoveryRail
            title="Best Under $20"
            subtitle="Budget-friendly finds that still look premium"
            href="/best-under-20"
            products={rails.bestUnder20}
          />
        </RevealOnScroll>
      ) : null}

      <RevealOnScroll>
        <DiscoveryRail
          title={getWeeklyFindsTitle()}
          subtitle="Trending sneakers, jackets and streetwear"
          href="/trending-this-week"
          products={rails.popularWeek}
          showTrendingScore
          freshness="updated-weekly"
        />
      </RevealOnScroll>

      <HomepageCategories categories={categories} />
      <HomepageCollections />
      <HomepageBrands hideSpotlight />

      <RecentlyViewedRail />

      <HomepageConversion />
      <HomepageAuthorityHub />
      <HomepageInternalLinks />
      <HomepageSeoContent />
      <HomepageFaq />

      <section className="px-4 pb-2 sm:px-6">
        <div className="mx-auto max-w-7xl text-center">
          <ContentFreshness variant="catalog-sync" display="block" />
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
        <HomepageCatalogSection />
      </Suspense>
    </>
  );
}
