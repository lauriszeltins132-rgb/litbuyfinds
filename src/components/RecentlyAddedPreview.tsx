import Link from "next/link";
import DataFreshness from "@/components/DataFreshness";
import { getRecencyCounts } from "@/lib/recency";

const BUCKETS = [
  {
    id: "today",
    label: "New Today",
    description: "New finds added in the last 24 hours.",
    cta: "Browse New Finds",
    href: "/recently-added#today",
    icon: (
      <svg
        className="h-11 w-11"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
        />
      </svg>
    ),
    countKey: "today" as const,
  },
  {
    id: "week",
    label: "New This Week",
    description: "Fresh products added this week.",
    cta: "View Weekly Finds",
    href: "/recently-added#week",
    icon: (
      <svg
        className="h-11 w-11"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
        />
      </svg>
    ),
    countKey: "week" as const,
  },
  {
    id: "month",
    label: "New This Month",
    description: "Products added this month.",
    cta: "Explore Monthly Finds",
    href: "/recently-added#month",
    icon: (
      <svg
        className="h-11 w-11"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
        />
      </svg>
    ),
    countKey: "month" as const,
  },
] as const;

export default function RecentlyAddedPreview() {
  const counts = getRecencyCounts();

  return (
    <section className="px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
              Fresh drops
            </p>
            <h2 className="mt-2 text-2xl font-black sm:text-3xl">Recently Added</h2>
            <p className="mt-2 max-w-2xl text-sm text-muted">
              Newest listings from the catalog — updated automatically whenever
              the dataset changes.
            </p>
            <p className="mt-2">
              <DataFreshness label="Last synced" />
            </p>
          </div>
          <Link
            href="/recently-added"
            className="rounded-full border border-accent/30 bg-accent/10 px-5 py-2.5 text-sm font-bold text-accent hover:bg-accent/15"
          >
            View all new finds →
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {BUCKETS.map((bucket) => {
            const count = counts[bucket.countKey];
            if (count === 0) return null;

            return (
              <article
                key={bucket.id}
                className="panel-shell flex min-h-[280px] flex-col rounded-3xl border border-border bg-gradient-to-br from-surface/90 via-surface/60 to-accent/5 p-7 sm:p-8"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-accent/25 bg-accent/10 text-accent shadow-[0_0_40px_-12px_rgba(var(--accent-rgb),0.45)]">
                  {bucket.icon}
                </div>

                <p className="mt-7 text-xs font-bold uppercase tracking-[0.2em] text-accent">
                  {bucket.label}
                </p>

                <p className="mt-3 text-5xl font-black leading-none tracking-tight text-foreground">
                  {count.toLocaleString()}
                </p>

                <p className="mt-4 flex-1 text-sm leading-relaxed text-muted">
                  {bucket.description}
                </p>

                <Link
                  href={bucket.href}
                  className="mt-7 inline-flex w-full items-center justify-center rounded-full bg-accent px-6 py-3.5 text-sm font-black text-background transition hover:bg-accent-hover"
                >
                  {bucket.cta}
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
