"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { GUIDE_CATEGORIES } from "@/lib/guides/categories";
import type { GuidePage } from "@/lib/guides/types";

type GuidesHubGridProps = {
  guides: GuidePage[];
};

export default function GuidesHubGrid({ guides }: GuidesHubGridProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return guides;
    return guides.filter(
      (guide) =>
        guide.h1.toLowerCase().includes(normalized) ||
        guide.cardDescription.toLowerCase().includes(normalized) ||
        guide.badge.toLowerCase().includes(normalized)
    );
  }, [guides, query]);

  const grouped = useMemo(() => {
    return GUIDE_CATEGORIES.map((category) => ({
      ...category,
      guides: filtered.filter((guide) => guide.category === category.id),
    })).filter((group) => group.guides.length > 0);
  }, [filtered]);

  return (
    <>
      <section className="px-4 pb-6 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <label className="block">
            <span className="sr-only">Search guides</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search guides…"
              className="w-full max-w-md rounded-xl border border-border bg-surface/50 px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/30"
            />
          </label>
          {query.trim() ? (
            <p className="mt-2 text-sm text-muted">
              {filtered.length} guide{filtered.length === 1 ? "" : "s"} matching &ldquo;{query.trim()}&rdquo;
            </p>
          ) : null}
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6">
        <div className="mx-auto max-w-7xl space-y-12">
          {grouped.map((group) => (
            <div key={group.id}>
              <div className="mb-5 max-w-2xl">
                <h2 className="text-xl font-black text-foreground">{group.title}</h2>
                <p className="mt-1 text-sm text-muted">{group.description}</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.guides.map((guide) => (
                  <Link
                    key={guide.slug}
                    href={guide.path}
                    className="panel-shell group flex flex-col rounded-2xl border border-border p-6 transition hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-[0_0_24px_rgba(34,197,94,0.08)]"
                  >
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-accent">
                      {guide.badge}
                    </p>
                    <h3 className="mt-3 text-lg font-black text-foreground group-hover:text-accent">
                      {guide.h1}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                      {guide.cardDescription}
                    </p>
                    <span className="mt-4 text-xs font-bold text-accent">
                      Read guide →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
