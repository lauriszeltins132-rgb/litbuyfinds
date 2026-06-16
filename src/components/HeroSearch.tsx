"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { POPULAR_SEARCHES } from "@/lib/constants";
import { trackSearchChipClick, trackSearchSubmit } from "@/lib/analytics-events";

function SearchIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  );
}

export default function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      router.push("/#browse");
      return;
    }
    trackSearchSubmit(trimmed, "hero_search");
    router.push(`/?q=${encodeURIComponent(trimmed)}#browse`);
  }

  function searchBrand(brand: string) {
    trackSearchChipClick(brand, "hero_search");
    router.push(`/?q=${encodeURIComponent(brand)}#browse`);
  }

  return (
    <div className="mx-auto w-full max-w-[700px]">
      <form onSubmit={handleSubmit} className="hero-search">
        <div className="hero-search__row">
          <div className="hero-search__input-wrap">
            <SearchIcon className="hero-search__icon" />
            <input
              id="hero-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search Nike, Moncler, Jordan, bags, jackets..."
              className="hero-search__input"
            />
          </div>
          <button type="submit" className="hero-search__submit">
            Search
          </button>
        </div>
      </form>

      <div className="mt-4">
        <p className="text-center text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
          Popular searches
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-2 px-1">
          {POPULAR_SEARCHES.map((brand) => (
            <button
              key={brand}
              type="button"
              onClick={() => searchBrand(brand)}
              className="rounded-full border border-border bg-surface/50 px-3 py-1.5 text-xs font-bold text-foreground transition hover:border-accent/40 hover:text-accent"
            >
              {brand}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
