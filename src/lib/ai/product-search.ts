import popularRankData from "@/data/popular-rank.json";
import type { Product } from "@/lib/types";
import { getAllProducts, getCategories, getProductById } from "@/lib/products";
import { productMatchesBrand } from "@/lib/brands";
import { getDisplayBrand } from "@/lib/product-validation";
import { aiConfig } from "@/lib/ai/config";
import { buildSearchableText, toPublicProduct } from "@/lib/ai/normalize";
import type { PublicProduct, SearchIntent } from "@/lib/ai/schemas";
import { COLOR_ALIASES, expandSynonyms } from "@/lib/ai/synonyms";
import { getProductBySlug } from "@/lib/slugs";
import { getTrendingProducts } from "@/lib/products";

export type SearchResult = {
  products: PublicProduct[];
  total: number;
  filtersApplied: Partial<SearchIntent>;
  relaxedFilters: string[];
};

function getPopularRankMap(): Map<string, number> {
  return new Map(popularRankData.ids.map((id, index) => [id, index]));
}

function tokenScore(haystack: string, query: string): number {
  const tokens = expandSynonyms(query)
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 1);
  if (tokens.length === 0) return 0;
  let score = 0;
  for (const token of tokens) {
    if (haystack.includes(token)) score += 3;
    else if (
      token.length >= 4 &&
      token.endsWith("s") &&
      haystack.includes(token.slice(0, -1))
    ) {
      score += 2;
    }
  }
  return score;
}

function matchesColor(product: Product, colors: string[]): boolean {
  if (colors.length === 0) return true;
  const hay = product.product_name.toLowerCase();
  return colors.some((color) => {
    const aliases = COLOR_ALIASES[color] ?? [color];
    return aliases.some((a) => hay.includes(a));
  });
}

function applyHardFilters(
  products: Product[],
  intent: SearchIntent,
  options: { ignoreColors?: boolean; ignoreCategories?: boolean } = {}
): Product[] {
  const exclude = new Set(intent.excludeProductIds);

  return products.filter((product) => {
    if (exclude.has(product.id)) return false;
    if (intent.requireQc && !product.qc_link) return false;

    if (intent.minPrice != null) {
      if (product.price === null || product.price < intent.minPrice) return false;
    }
    if (intent.maxPrice != null) {
      if (product.price === null || product.price > intent.maxPrice) return false;
    }

    if (!options.ignoreCategories && intent.categories.length > 0) {
      if (!intent.categories.includes(product.category_slug)) return false;
    }

    if (intent.brands.length > 0) {
      const ok = intent.brands.some((b) => productMatchesBrand(product, b));
      if (!ok) return false;
    }

    if (!options.ignoreColors && intent.colors.length > 0) {
      if (!matchesColor(product, intent.colors)) return false;
    }

    return true;
  });
}

function rankProducts(products: Product[], intent: SearchIntent): Product[] {
  const ranks = getPopularRankMap();
  const scored = products.map((product) => {
    const hay = buildSearchableText(product);
    let score = tokenScore(hay, intent.query);

    if (intent.colors.length && matchesColor(product, intent.colors)) score += 4;
    if (
      intent.categories.length &&
      intent.categories.includes(product.category_slug)
    ) {
      score += 3;
    }
    if (intent.brands.some((b) => productMatchesBrand(product, b))) score += 5;
    if (product.qc_link) score += 1;

    const popularIdx = ranks.get(product.id);
    if (popularIdx != null) score += Math.max(0, 3 - popularIdx / 500);

    if (intent.maxPrice != null && product.price != null) {
      const room = intent.maxPrice - product.price;
      if (room >= 0) score += Math.min(3, room / Math.max(intent.maxPrice, 1));
    }

    return { product, score };
  });

  scored.sort((a, b) => {
    if (intent.sort === "price-asc") {
      return (a.product.price ?? Infinity) - (b.product.price ?? Infinity);
    }
    if (intent.sort === "price-desc") {
      return (b.product.price ?? 0) - (a.product.price ?? 0);
    }
    if (intent.sort === "newest") {
      return Number(b.product.id) - Number(a.product.id);
    }
    if (intent.sort === "popular") {
      return (ranks.get(a.product.id) ?? 9999) - (ranks.get(b.product.id) ?? 9999);
    }
    if (b.score !== a.score) return b.score - a.score;
    return (a.product.price ?? Infinity) - (b.product.price ?? Infinity);
  });

  return scored.map((s) => s.product);
}

function reasonFor(product: Product, intent: SearchIntent): string {
  const bits: string[] = [];
  const brand = getDisplayBrand(product);
  if (brand && intent.brands.length) bits.push(`${brand} match`);
  if (intent.maxPrice != null && product.price != null) {
    bits.push(`$${product.price} within $${intent.maxPrice} budget`);
  }
  if (intent.colors.length && matchesColor(product, intent.colors)) {
    bits.push(`${intent.colors.join("/")} color cues`);
  }
  if (intent.categories.includes(product.category_slug)) {
    bits.push(`${product.category} category`);
  }
  if (product.qc_link) bits.push("QC reference available");
  if (bits.length === 0) bits.push("catalog keyword relevance");
  return bits.join(" · ");
}

/**
 * Hybrid catalog search grounded in real products only.
 * Relaxes soft filters (color → category) when needed for nearest alternatives.
 */
export function searchCatalog(intent: SearchIntent): SearchResult {
  const limit = Math.min(intent.limit, aiConfig.maxProductsReturned);
  const pool = getAllProducts();
  const relaxedFilters: string[] = [];

  let filtered = applyHardFilters(pool, intent);
  if (intent.query.trim()) {
    const withText = filtered.filter(
      (p) => tokenScore(buildSearchableText(p), intent.query) > 0
    );
    // Keep brand/category hard filters when the leftover query is too weak
    // (e.g. "jordan 4" → brand jordan + query "4").
    if (
      withText.length > 0 ||
      (intent.brands.length === 0 && intent.categories.length === 0)
    ) {
      filtered = withText;
    }
  }

  if (filtered.length === 0 && intent.colors.length > 0) {
    relaxedFilters.push("color");
    filtered = applyHardFilters(pool, intent, { ignoreColors: true });
    if (intent.query.trim()) {
      const withText = filtered.filter(
        (p) => tokenScore(buildSearchableText(p), intent.query) > 0
      );
      if (
        withText.length > 0 ||
        (intent.brands.length === 0 && intent.categories.length === 0)
      ) {
        filtered = withText;
      }
    }
  }

  if (filtered.length === 0 && intent.categories.length > 0) {
    relaxedFilters.push("category");
    filtered = applyHardFilters(pool, intent, {
      ignoreColors: true,
      ignoreCategories: true,
    });
    if (intent.query.trim()) {
      const withText = filtered.filter(
        (p) => tokenScore(buildSearchableText(p), intent.query) > 0
      );
      if (withText.length > 0 || intent.brands.length === 0) {
        filtered = withText;
      }
    }
  }

  if (filtered.length === 0 && intent.query.trim()) {
    relaxedFilters.push("structured filters");
    filtered = applyHardFilters(
      pool.filter((p) => tokenScore(buildSearchableText(p), intent.query) > 0),
      {
        ...intent,
        categories: [],
        colors: [],
        brands: intent.brands,
      }
    );
  }

  const ranked = rankProducts(filtered, intent);
  const slice = ranked.slice(0, limit);

  return {
    products: slice.map((p) => toPublicProduct(p, reasonFor(p, intent))),
    total: ranked.length,
    filtersApplied: {
      query: intent.query,
      categories: intent.categories,
      brands: intent.brands,
      colors: intent.colors,
      minPrice: intent.minPrice,
      maxPrice: intent.maxPrice,
      sort: intent.sort,
      requireQc: intent.requireQc,
    },
    relaxedFilters,
  };
}

export function getPublicProductByIdOrSlug(
  productId?: string,
  slug?: string
): PublicProduct | null {
  let product: Product | undefined;
  if (productId) product = getProductById(productId);
  if (!product && slug) product = getProductBySlug(slug);
  if (!product) return null;
  return toPublicProduct(product);
}

export function findSimilarProducts(input: {
  productId: string;
  maxPrice?: number;
  category?: string;
  limit?: number;
  cheaperOnly?: boolean;
  sameColor?: boolean;
}): SearchResult {
  const seed = getProductById(input.productId);
  if (!seed) {
    return { products: [], total: 0, filtersApplied: {}, relaxedFilters: [] };
  }

  const brand = getDisplayBrand(seed);
  const colors = input.sameColor
    ? Object.keys(
        // reuse detect via name
        Object.fromEntries(
          (seed.product_name.toLowerCase().match(
            /\b(black|white|red|blue|green|brown|grey|gray|pink|purple|yellow|orange|navy|beige)\b/g
          ) ?? []).map((c) => [c === "gray" ? "grey" : c, true])
        )
      )
    : [];

  const intent: SearchIntent = {
    query: seed.product_name.split(/\s+/).slice(0, 4).join(" "),
    categories: input.category
      ? [input.category]
      : seed.category_slug
        ? [seed.category_slug]
        : [],
    brands: brand ? [brand.toLowerCase().replace(/\s+/g, "-")] : [],
    colors,
    minPrice: null,
    maxPrice:
      input.maxPrice ??
      (input.cheaperOnly && seed.price != null ? seed.price : null),
    tags: [],
    requireQc: false,
    sort: input.cheaperOnly ? "price-asc" : "relevance",
    limit: input.limit ?? 6,
    excludeProductIds: [seed.id],
  };

  return searchCatalog(intent);
}

export function compareCatalogProducts(productIds: string[]) {
  const products = productIds
    .map((id) => getPublicProductByIdOrSlug(id))
    .filter(Boolean) as PublicProduct[];

  const fields = [
    "name",
    "price",
    "category",
    "brand",
    "source",
    "hasQc",
    "colors",
  ] as const;

  const comparison = products.map((p) => ({
    id: p.id,
    name: p.name,
    imageUrl: p.imageUrl,
    price: p.price,
    category: p.category,
    brand: p.brand,
    source: p.source,
    hasQc: p.hasQc,
    colors: p.colors,
    productUrl: p.productUrl,
    affiliateUrl: p.affiliateUrl,
    missing: fields.filter((f) => {
      const v = p[f];
      return v == null || v === "" || (Array.isArray(v) && v.length === 0);
    }),
  }));

  const priced = products.filter((p) => p.price != null);
  const cheapest =
    priced.length > 0
      ? priced.reduce((a, b) => ((a.price ?? 0) <= (b.price ?? 0) ? a : b))
      : null;

  return {
    products: comparison,
    summary: {
      cheapestId: cheapest?.id ?? null,
      withQc: products.filter((p) => p.hasQc).map((p) => p.id),
      unavailableFieldsNote:
        "Material quality and authenticity cannot be inferred from price alone. Missing fields are marked unavailable.",
    },
  };
}

export function buildHaulFromCatalog(input: {
  budget: number;
  requestedCategories?: string[];
  colors?: string[];
  style?: string;
  season?: string;
  useCase?: string;
  maximumItems?: number;
  query?: string;
}) {
  const maxItems = Math.min(input.maximumItems ?? 5, 8);
  const categories =
    input.requestedCategories && input.requestedCategories.length > 0
      ? input.requestedCategories
      : ["shoes", "tshirts-and-shorts", "hoodies-and-pants", "accessories"];

  const selected: PublicProduct[] = [];
  let remaining = input.budget;
  const unmet: string[] = [];

  for (const category of categories) {
    if (selected.length >= maxItems) break;
    const result = searchCatalog({
      query: [input.query, input.style, input.useCase, input.season]
        .filter(Boolean)
        .join(" "),
      categories: [category],
      brands: [],
      colors: input.colors ?? [],
      minPrice: null,
      maxPrice: remaining,
      tags: [],
      requireQc: false,
      sort: "relevance",
      limit: 6,
      excludeProductIds: selected.map((p) => p.id),
    });

    const pick = result.products.find(
      (p) => p.price != null && p.price <= remaining
    );
    if (!pick) {
      unmet.push(category);
      continue;
    }
    selected.push({
      ...pick,
      matchReason: `Fits ${category} slot · $${pick.price} · remaining budget $${(
        remaining - (pick.price ?? 0)
      ).toFixed(2)}`,
    });
    remaining -= pick.price ?? 0;
  }

  // Fill remaining budget with bestsellers if slots left
  while (selected.length < maxItems && remaining > 5) {
    const filler = searchCatalog({
      query: input.style ?? input.useCase ?? "streetwear",
      categories: [],
      brands: [],
      colors: input.colors ?? [],
      minPrice: null,
      maxPrice: remaining,
      tags: [],
      requireQc: false,
      sort: "popular",
      limit: 8,
      excludeProductIds: selected.map((p) => p.id),
    });
    const pick = filler.products.find(
      (p) => p.price != null && p.price <= remaining
    );
    if (!pick) break;
    selected.push(pick);
    remaining -= pick.price ?? 0;
  }

  const subtotal = selected.reduce((sum, p) => sum + (p.price ?? 0), 0);

  return {
    products: selected,
    subtotal: Number(subtotal.toFixed(2)),
    remainingBudget: Number((input.budget - subtotal).toFixed(2)),
    currency: "USD" as const,
    shippingExcluded: true,
    unmetConstraints: unmet,
    explanation:
      unmet.length > 0
        ? `Built a ${selected.length}-item haul for $${subtotal.toFixed(2)} of $${input.budget}. Could not fill: ${unmet.join(", ")} within remaining budget.`
        : `Built a ${selected.length}-item haul totaling $${subtotal.toFixed(2)} of $${input.budget} (item prices only — shipping not included).`,
  };
}

export function getCatalogCategoryStats() {
  return getCategories().map((c) => {
    const products = getAllProducts().filter((p) => p.category_slug === c.slug);
    const prices = products
      .map((p) => p.price)
      .filter((p): p is number => p != null);
    return {
      name: c.name,
      slug: c.slug,
      count: c.count,
      minPrice: prices.length ? Math.min(...prices) : null,
      maxPrice: prices.length ? Math.max(...prices) : null,
    };
  });
}

export function getObservedPriceRange(query?: string, category?: string) {
  const result = searchCatalog({
    query: query ?? "",
    categories: category ? [category] : [],
    brands: [],
    colors: [],
    minPrice: null,
    maxPrice: null,
    tags: [],
    requireQc: false,
    sort: "price-asc",
    limit: 24,
    excludeProductIds: [],
  });
  const prices = result.products
    .map((p) => p.price)
    .filter((p): p is number => p != null);
  return {
    min: prices.length ? Math.min(...prices) : null,
    max: prices.length ? Math.max(...prices) : null,
    sampleSize: prices.length,
    currency: "USD" as const,
  };
}

export function getTrendingPublicProducts(category?: string, limit = 8) {
  let products = getTrendingProducts();
  if (products.length < limit) {
    // Fall back to popular catalogue slice when trending sheet is thin
    products = [...getAllProducts()];
  }
  if (category) {
    products = products.filter((p) => p.category_slug === category);
  }
  return products.slice(0, limit).map((p) =>
    toPublicProduct(p, "Trending in catalog engagement signals")
  );
}
