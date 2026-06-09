"use client";

import GlobalSearch from "./GlobalSearch";

export default function MobileSearchBar() {
  return (
    <div className="mobile-search-bar sm:hidden">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        <p className="text-sm font-bold text-foreground">Search finds</p>
        <GlobalSearch />
      </div>
    </div>
  );
}
