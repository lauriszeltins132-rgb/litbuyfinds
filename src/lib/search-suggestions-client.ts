import searchIndexData from "@/data/search-index.json";

export type SearchSuggestionType =
  | "brand"
  | "category"
  | "guide"
  | "best-of"
  | "landing"
  | "collection"
  | "query"
  | "product-type";

export type SearchSuggestion = {
  label: string;
  href: string;
  type: SearchSuggestionType;
  keywords: string;
  priority: number;
};

/** Pre-built search index for client components — no catalog bundle. */
export function getClientSearchIndex(): SearchSuggestion[] {
  return (searchIndexData as { items: SearchSuggestion[] }).items;
}

export type SearchSuggestionGroup = {
  id: string;
  label: string;
  icon: string;
  items: SearchSuggestion[];
};

function getDefaultSuggestionGroups(index: SearchSuggestion[]): SearchSuggestionGroup[] {
  const popular = index.filter((i) => i.priority >= 95).slice(0, 6);
  const trending = index
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

export function getSearchSuggestions(query: string, limit = 12): SearchSuggestionGroup[] {
  const index = getClientSearchIndex();
  const q = query.trim().toLowerCase();
  if (!q) {
    return getDefaultSuggestionGroups(index);
  }

  const matches = index
    .filter((item) => item.keywords.includes(q) || item.label.toLowerCase().includes(q))
    .sort((a, b) => b.priority - a.priority)
    .slice(0, limit * 2);

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
    else if (item.type === "category" && groups.categories.length < 4) groups.categories.push(item);
    else if (item.type === "collection" && groups.collections.length < 4)
      groups.collections.push(item);
    else if (item.type === "best-of" && groups["best-of"].length < 4) groups["best-of"].push(item);
    else if ((item.type === "guide" || item.type === "landing") && groups.guides.length < 4)
      groups.guides.push(item);
    else if (groups.trending.length < 4) groups.trending.push(item);
  }

  const result: SearchSuggestionGroup[] = [];
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

  return result.slice(0, 5);
}
