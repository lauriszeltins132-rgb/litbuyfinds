import popularRankData from "@/data/popular-rank.json";
import type { Product } from "./types";
import { productMatchesBrand } from "./brands";
import { getDisplayBrand } from "./product-validation";
import { getProductSource } from "./affiliate-source";

export { getProductSource } from "./affiliate-source";

export type FilterState = {
  search: string;
  category: string;
  brand: string;
  minPrice: string;
  maxPrice: string;
  sort: string;
  qcOnly?: boolean;
  savedOnly?: boolean;
  savedIds?: Set<string>;
};

export const defaultFilters: FilterState = {
  search: "",
  category: "",
  brand: "",
  minPrice: "",
  maxPrice: "",
  sort: "featured",
  qcOnly: false,
  savedOnly: false,
};

function normalizeSearchText(value: string): string {
  return value.toLowerCase().trim().replace(/\s+/g, " ");
}

function matchesSearch(product: Product, search: string): boolean {
  const haystack = normalizeSearchText(
    `${product.product_name} ${product.category} ${getDisplayBrand(product) ?? ""}`
  );
  const tokens = normalizeSearchText(search).split(" ").filter(Boolean);
  if (tokens.length === 0) return true;

  return tokens.every((token) => {
    if (haystack.includes(token)) return true;
    if (token.length >= 4 && token.endsWith("s") && haystack.includes(token.slice(0, -1))) {
      return true;
    }
    return false;
  });
}

let popularRankMap: Map<string, number> | null = null;

function getPopularRankMap(): Map<string, number> {
  if (!popularRankMap) {
    popularRankMap = new Map(
      popularRankData.ids.map((id, index) => [id, index])
    );
  }
  return popularRankMap;
}

export function filterProducts(
  products: Product[],
  filters: FilterState
): Product[] {
  const search = filters.search.trim();
  const min = filters.minPrice ? parseFloat(filters.minPrice) : null;
  const max = filters.maxPrice ? parseFloat(filters.maxPrice) : null;

  let result = products.filter((product) => {
    if (search && !matchesSearch(product, search)) return false;

    if (filters.category && product.category_slug !== filters.category) {
      return false;
    }

    if (filters.brand && !productMatchesBrand(product, filters.brand)) {
      return false;
    }

    if (filters.qcOnly && !product.qc_link) return false;

    if (filters.savedOnly && filters.savedIds && !filters.savedIds.has(product.id)) {
      return false;
    }

    if (min !== null && !isNaN(min)) {
      if (product.price === null || product.price < min) return false;
    }

    if (max !== null && !isNaN(max)) {
      if (product.price === null || product.price > max) return false;
    }

    return true;
  });

  const ranks = getPopularRankMap();

  switch (filters.sort) {
    case "price-asc":
      result = [...result].sort(
        (a, b) => (a.price ?? Infinity) - (b.price ?? Infinity)
      );
      break;
    case "price-desc":
      result = [...result].sort(
        (a, b) => (b.price ?? 0) - (a.price ?? 0)
      );
      break;
    case "name":
      result = [...result].sort((a, b) =>
        a.product_name.localeCompare(b.product_name)
      );
      break;
    case "newest":
      result = [...result].sort(
        (a, b) => Number(b.id) - Number(a.id)
      );
      break;
    case "popular":
      result = [...result].sort((a, b) => {
        const aRank = ranks.get(a.id) ?? 999;
        const bRank = ranks.get(b.id) ?? 999;
        if (aRank !== bRank) return aRank - bRank;
        return Number(b.id) - Number(a.id);
      });
      break;
    case "qc":
      result = [...result].sort((a, b) => {
        const qcDiff = Number(Boolean(b.qc_link)) - Number(Boolean(a.qc_link));
        if (qcDiff !== 0) return qcDiff;
        return Number(b.id) - Number(a.id);
      });
      break;
    default:
      break;
  }

  return result;
}
