"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ControlButton from "@/components/ui/ControlButton";
import TextInput from "@/components/ui/TextInput";
import { POPULAR_SEARCHES } from "@/lib/constants";
import { getClientSearchIndex } from "@/lib/search-suggestions-client";
import { scrollToCatalogResults } from "@/lib/scroll-to-catalog";

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

type GlobalSearchProps = {
  className?: string;
  variant?: "header" | "dock";
};

export default function GlobalSearch({
  className = "",
  variant = "header",
}: GlobalSearchProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchIndex = useMemo(() => getClientSearchIndex(), []);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return searchIndex
        .filter((item) => item.priority >= 88)
        .slice(0, 8);
    }
    return searchIndex
      .filter(
        (item) =>
          item.keywords.includes(q) || item.label.toLowerCase().includes(q)
      )
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 8);
  }, [query, searchIndex]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/?q=${encodeURIComponent(trimmed)}`, { scroll: false });
    scrollToCatalogResults();
    setOpen(false);
    setQuery("");
  }

  const triggerClass =
    variant === "dock"
      ? "mobile-dock__search"
      : "control-btn control-btn-ghost !min-h-0 !p-2";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search finds"
        className={`${triggerClass} ${className}`.trim()}
      >
        <SearchIcon className={variant === "dock" ? "h-4 w-4" : "h-5 w-5"} />
        {variant === "dock" ? (
          <span className="mobile-dock__label">Find</span>
        ) : null}
      </button>

      {open && (
        <div className="fixed inset-0 z-[180] flex items-start justify-center p-4 pt-[max(1rem,env(safe-area-inset-top))] sm:pt-24">
          <button
            type="button"
            aria-label="Close search"
            className="absolute inset-0 bg-black/75 backdrop-blur-md"
            onClick={() => setOpen(false)}
          />

          <form
            onSubmit={handleSubmit}
            className="modal-enter panel-shell relative mt-12 w-full max-w-xl rounded-3xl border border-border-strong p-4 sm:mt-0 sm:p-5"
          >
            <p className="mb-3 text-sm font-bold text-foreground">Search finds</p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <TextInput
                id="global-search"
                value={query}
                onChange={setQuery}
                placeholder="Search sneakers, brands, categories..."
                type="search"
                icon={<SearchIcon />}
              />
              <ControlButton type="submit" variant="primary" className="w-full sm:w-auto">
                Search
              </ControlButton>
            </div>

            {suggestions.length > 0 ? (
              <ul className="mt-4 max-h-56 space-y-1 overflow-y-auto border-t border-border pt-3">
                {suggestions.map((item) => (
                  <li key={`${item.type}-${item.href}-${item.label}`}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-xl px-3 py-2 text-sm font-semibold text-foreground/85 hover:bg-surface/60 hover:text-accent"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : query.trim() ? (
              <div className="mt-4 border-t border-border pt-3">
                <p className="text-xs text-muted">Try popular searches:</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {POPULAR_SEARCHES.slice(0, 5).map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => setQuery(term)}
                      className="rounded-full border border-border px-2.5 py-1 text-xs font-bold text-foreground/80"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </form>
        </div>
      )}
    </>
  );
}
