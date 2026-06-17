import Link from "next/link";
import DiscoveryRail from "@/components/DiscoveryRail";
import type { BrandPageRails } from "@/lib/brand-page-rails";

type BrandProductRailsProps = {
  brandSlug: string;
  brandName: string;
  rails: BrandPageRails;
};

export default function BrandProductRails({
  brandSlug,
  brandName,
  rails,
}: BrandProductRailsProps) {
  const pageHref = `/brands/${brandSlug}`;

  return (
    <>
      {rails.topProducts.length > 0 ? (
        <DiscoveryRail
          title={`Top ${brandName} Finds (${rails.stats.topCount})`}
          subtitle="Highest-ranked picks with photos and QC"
          href={pageHref}
          products={rails.topProducts}
        />
      ) : null}

      {rails.trendingProducts.length > 0 ? (
        <DiscoveryRail
          title={`Trending ${brandName} Finds (${rails.stats.trendingCount})`}
          subtitle="Popular picks this week"
          href={pageHref}
          products={rails.trendingProducts}
          showTrendingScore
        />
      ) : null}

      {rails.recentlyAdded.length > 0 ? (
        <DiscoveryRail
          title={`Recently Added ${brandName} (${rails.stats.recentlyAddedCount})`}
          subtitle="Fresh listings in the catalog"
          href="/recently-added"
          products={rails.recentlyAdded}
        />
      ) : null}

      {rails.bestQcProducts.length > 0 ? (
        <DiscoveryRail
          title={`Best QC ${brandName} Finds (${rails.stats.bestQcCount})`}
          subtitle="Listings with QC reference photos"
          href="/best-qc-approved-finds"
          products={rails.bestQcProducts}
        />
      ) : null}

      {rails.bestUnder50.length > 0 ? (
        <DiscoveryRail
          title={`Budget ${brandName} Finds (${rails.stats.budgetCount})`}
          subtitle="Under $50 — great for haul fillers"
          href="/best-under-50"
          products={rails.bestUnder50}
        />
      ) : null}

      {rails.relatedCategories.length > 0 ? (
        <section className="px-4 pb-4 sm:px-6">
          <div className="mx-auto max-w-7xl rounded-2xl border border-border bg-surface/30 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">
              Related categories
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {rails.relatedCategories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={cat.href}
                    className="rounded-full border border-border px-3 py-1.5 text-xs font-bold hover:border-accent/40 hover:text-accent"
                  >
                    {cat.name} ({cat.count})
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {rails.relatedBrands.length > 0 ? (
        <section className="px-4 pb-4 sm:px-6">
          <div className="mx-auto max-w-7xl rounded-2xl border border-border bg-surface/30 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">
              Related brands
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {rails.relatedBrands.map((brand) => (
                <li key={brand.slug}>
                  <Link
                    href={`/brands/${brand.slug}`}
                    className="rounded-full border border-border px-3 py-1.5 text-xs font-bold hover:border-accent/40 hover:text-accent"
                  >
                    {brand.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {rails.bestOfLinks.length > 0 ? (
        <section className="px-4 pb-4 sm:px-6">
          <div className="mx-auto max-w-7xl rounded-2xl border border-border bg-surface/30 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">
              Best-of collections
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {rails.bestOfLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="rounded-full border border-border px-3 py-1.5 text-xs font-bold hover:border-accent/40 hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </>
  );
}
