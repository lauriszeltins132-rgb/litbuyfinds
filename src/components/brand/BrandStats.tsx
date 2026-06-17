import type { BrandPageRails } from "@/lib/brand-page-rails";

type BrandStatsProps = {
  brandName: string;
  rails: BrandPageRails;
};

export default function BrandStats({ brandName, rails }: BrandStatsProps) {
  const { stats } = rails;
  const items = [
    { label: "Top finds", count: stats.topCount },
    { label: "Trending", count: stats.trendingCount },
    { label: "Recently added", count: stats.recentlyAddedCount },
    { label: "Best QC", count: stats.bestQcCount },
    { label: "Under $50", count: stats.budgetCount },
  ].filter((item) => item.count > 0);

  return (
    <section className="px-4 pb-4 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-semibold text-foreground">
          {stats.totalIndexed.toLocaleString()} {brandName} finds indexed
        </p>
        {items.length > 0 ? (
          <ul className="mt-3 flex flex-wrap gap-2">
            {items.map((item) => (
              <li
                key={item.label}
                className="rounded-full border border-border bg-surface/40 px-3 py-1 text-xs font-bold text-muted"
              >
                {item.label}{" "}
                <span className="text-accent">({item.count})</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
