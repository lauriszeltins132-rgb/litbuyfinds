"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { POPULAR_SEARCHES } from "@/lib/constants";
import { trackSearchChipClick, trackSearchSubmit } from "@/lib/analytics-events";
import { scrollToCatalogResults } from "@/lib/scroll-to-catalog";
import type { SearchSuggestion } from "@/lib/search-suggestions-client";

type HeroSearchProps = {
  searchIndex: SearchSuggestion[];
};

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

function filterSuggestions(index: SearchSuggestion[], query: string) {
  const q = query.trim().toLowerCase();
  if (!q) {
    const popular = index.filter((i) => i.priority >= 95).slice(0, 6);
    const trending = [...index]
      .filter((i) => i.type === "best-of" || i.type === "brand")
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 6);
    const brands = index.filter((i) => i.type === "brand" && !i.label.includes(" ")).slice(0, 8);
    const categories = index.filter((i) => i.type === "category").slice(0, 6);
    return [
      { id: "popular", label: "Popular searches", icon: "🔥", items: popular },
      { id: "trending", label: "Trending searches", icon: "⭐", items: trending },
      { id: "brands", label: "Brands", icon: "🏷", items: brands },
      { id: "categories", label: "Categories", icon: "📂", items: categories },
    ].filter((g) => g.items.length > 0);
  }

  const matches = index
    .filter((item) => item.keywords.includes(q) || item.label.toLowerCase().includes(q))
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 24);

  const groups: Record<string, SearchSuggestion[]> = {
    brands: [],
    categories: [],
    collections: [],
    "best-of": [],
    guides: [],
    trending: [],
  };

  for (const item of matches) {
    if (item.type === "brand" && groups.brands.length < 5) groups.brands.push(item);
    else if (item.type === "category" && groups.categories.length < 4)
      groups.categories.push(item);
    else if (item.type === "collection" && groups.collections.length < 4)
      groups.collections.push(item);
    else if (item.type === "best-of" && groups["best-of"].length < 4)
      groups["best-of"].push(item);
    else if (
      (item.type === "guide" || item.type === "landing") &&
      groups.guides.length < 4
    )
      groups.guides.push(item);
    else if (groups.trending.length < 4) groups.trending.push(item);
  }

  const result = [];
  if (groups.brands.length)
    result.push({ id: "brands", label: "Brands", icon: "🏷", items: groups.brands });
  if (groups.categories.length)
    result.push({ id: "categories", label: "Categories", icon: "📂", items: groups.categories });
  if (groups.collections.length)
    result.push({ id: "collections", label: "Collections", icon: "📁", items: groups.collections });
  if (groups["best-of"].length)
    result.push({ id: "best-of", label: "Best of", icon: "⭐", items: groups["best-of"] });
  if (groups.guides.length)
    result.push({ id: "guides", label: "Guides", icon: "📖", items: groups.guides });
  if (groups.trending.length)
    result.push({ id: "trending", label: "Trending", icon: "🔥", items: groups.trending });

  return result;
}

export default function HeroSearch({ searchIndex }: HeroSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const groups = useMemo(() => filterSuggestions(searchIndex, query), [searchIndex, query]);

  useEffect(() => {
    function onClickOutside(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function pushCatalogSearch(term: string) {
    const trimmed = term.trim();
    if (!trimmed) {
      router.push("/", { scroll: false });
      scrollToCatalogResults();
      return;
    }
    router.push(`/?q=${encodeURIComponent(trimmed)}`, { scroll: false });
    scrollToCatalogResults();
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = query.trim();
    setOpen(false);
    if (!trimmed) {
      pushCatalogSearch("");
      return;
    }
    trackSearchSubmit(trimmed, "hero_search");
    pushCatalogSearch(trimmed);
  }

  function navigate(href: string, label: string) {
    trackSearchChipClick(label, "hero_search_autocomplete");
    setOpen(false);
    setQuery("");
    router.push(href);
  }

  function searchBrand(brand: string) {
    trackSearchChipClick(brand, "hero_search");
    pushCatalogSearch(brand);
  }

  return (
    <div ref={rootRef} className="relative mx-auto w-full max-w-[700px]">
      <form onSubmit={handleSubmit} className="hero-search">
        <div className="hero-search__row">
          <div className="hero-search__input-wrap">
            <SearchIcon className="hero-search__icon" />
            <input
              id="hero-search"
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              placeholder="Search Nike, Moncler, Jordan, bags, jackets..."
              className="hero-search__input"
              autoComplete="off"
              aria-expanded={open}
              aria-controls="hero-search-suggestions"
            />
          </div>
          <button type="submit" className="hero-search__submit">
            Search
          </button>
        </div>
      </form>

      {open && groups.length > 0 ? (
        <div
          id="hero-search-suggestions"
          className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 max-h-[min(70vh,420px)] overflow-y-auto rounded-2xl border border-border bg-surface shadow-xl"
        >
          {groups.map((group) => (
            <div key={group.id} className="border-b border-border/60 px-4 py-3 last:border-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
                {group.icon} {group.label}
              </p>
              <ul className="mt-2 space-y-1">
                {group.items.map((item) => (
                  <li key={`${group.id}-${item.href}-${item.label}`}>
                    <button
                      type="button"
                      onClick={() => navigate(item.href, item.label)}
                      className="w-full rounded-lg px-2 py-2 text-left text-sm font-semibold text-foreground hover:bg-surface/80 hover:text-accent"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {query.trim() ? (
            <div className="border-t border-border/60 px-4 py-3">
              <button
                type="button"
                onClick={() => {
                  trackSearchSubmit(query.trim(), "hero_search");
                  pushCatalogSearch(query.trim());
                  setOpen(false);
                }}
                className="text-sm font-bold text-accent hover:underline"
              >
                Search catalog for &ldquo;{query.trim()}&rdquo; →
              </button>
            </div>
          ) : null}
        </div>
      ) : null}

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
