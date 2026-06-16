import Link from "next/link";
import DiscoveryRail from "@/components/DiscoveryRail";
import type { BrandPageRails } from "@/lib/brand-page-rails";

type BrandAuthoritySectionsProps = {
  brandSlug: string;
  brandName: string;
  rails: BrandPageRails;
};

export default function BrandAuthoritySections({
  brandSlug,
  brandName,
  rails,
}: BrandAuthoritySectionsProps) {
  return (
    <>
      {rails.trendingProducts.length > 0 ? (
        <DiscoveryRail
          title={`Trending ${brandName}`}
          subtitle="Popular picks this week"
          href={`/brands/${brandSlug}`}
          products={rails.trendingProducts}
          showTrendingScore
        />
      ) : null}

      {rails.mostEngaged.length > 0 ? (
        <DiscoveryRail
          title="Most saved & clicked"
          subtitle="High engagement from visitors"
          href="/most-popular-finds-now"
          products={rails.mostEngaged}
        />
      ) : null}

      {rails.bestUnder50.length > 0 ? (
        <DiscoveryRail
          title={`Best ${brandName} under $50`}
          subtitle="Budget-friendly picks"
          href="/best-under-50"
          products={rails.bestUnder50}
        />
      ) : null}

      {rails.recentlyAdded.length > 0 ? (
        <DiscoveryRail
          title={`Recently added ${brandName}`}
          subtitle="Fresh listings in the catalog"
          href="/recently-added"
          products={rails.recentlyAdded}
        />
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
