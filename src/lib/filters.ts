import type { Product } from "./types";
import { productMatchesBrand } from "./brands";
import { getMarketplaceSource } from "./agents";

export type FilterState = {
  search: string;
  category: string;
  brand: string;
  minPrice: string;
  maxPrice: string;
  sort: string;
};

export const defaultFilters: FilterState = {
  search: "",
  category: "",
  brand: "",
  minPrice: "",
  maxPrice: "",
  sort: "featured",
};

export function filterProducts(
  products: Product[],
  filters: FilterState
): Product[] {
  const search = filters.search.toLowerCase().trim();
  const min = filters.minPrice ? parseFloat(filters.minPrice) : null;
  const max = filters.maxPrice ? parseFloat(filters.maxPrice) : null;

  let result = products.filter((product) => {
    if (search) {
      const haystack =
        `${product.product_name} ${product.category}`.toLowerCase();
      if (!haystack.includes(search)) return false;
    }

    if (filters.category && product.category_slug !== filters.category) {
      return false;
    }

    if (filters.brand && !productMatchesBrand(product, filters.brand)) {
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
    default:
      break;
  }

  return result;
}

export function getProductSource(affiliateLink: string): string {
  return getMarketplaceSource(affiliateLink);
}
