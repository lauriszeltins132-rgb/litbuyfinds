import { tool } from "ai";
import { z } from "zod";
import {
  buildHaulInputSchema,
  compareProductsInputSchema,
  findSimilarInputSchema,
  getPriceRangeInputSchema,
  getProductDetailsInputSchema,
  getTrendingInputSchema,
  searchProductsInputSchema,
} from "@/lib/ai/schemas";
import {
  buildHaulFromCatalog,
  compareCatalogProducts,
  findSimilarProducts,
  getCatalogCategoryStats,
  getObservedPriceRange,
  getPublicProductByIdOrSlug,
  getTrendingPublicProducts,
  searchCatalog,
} from "@/lib/ai/product-search";
import {
  filterValidCatalogIds,
  recalculateHaulTotals,
  rehydratePublicProducts,
} from "@/lib/ai/grounding";
import { aiConfig } from "@/lib/ai/config";

/**
 * Server-only tools. Clients cannot register tools or choose models.
 * Every product payload is re-hydrated from getProductById / catalogue search.
 */
export function createLitBuyAiTools() {
  return {
    searchProducts: tool({
      description:
        "Search the LitBuy Finds catalogue with filters. Returns only real products.",
      inputSchema: searchProductsInputSchema,
      execute: async (input) => {
        const result = searchCatalog({
          ...input,
          limit: Math.min(input.limit, aiConfig.maxProductsReturned),
        });
        return {
          ...result,
          products: rehydratePublicProducts(result.products),
        };
      },
    }),

    getProductDetails: tool({
      description: "Get one verified product by id or slug.",
      inputSchema: getProductDetailsInputSchema,
      execute: async ({ productId, slug }) => {
        const product = getPublicProductByIdOrSlug(productId, slug);
        if (!product) return { found: false as const, product: null };
        const [grounded] = rehydratePublicProducts([product]);
        if (!grounded) return { found: false as const, product: null };
        return { found: true as const, product: grounded };
      },
    }),

    findSimilarProducts: tool({
      description:
        "Find similar or cheaper catalogue alternatives to a product id.",
      inputSchema: findSimilarInputSchema,
      execute: async (input) => {
        const result = findSimilarProducts(input);
        return {
          ...result,
          products: rehydratePublicProducts(result.products),
        };
      },
    }),

    compareProducts: tool({
      description:
        "Compare 2–4 real catalogue products using available fields only.",
      inputSchema: compareProductsInputSchema,
      execute: async ({ productIds }) => {
        const validIds = filterValidCatalogIds(productIds).slice(0, 4);
        if (validIds.length < 2) {
          return {
            products: [],
            summary: {
              cheapestId: null,
              withQc: [],
              unavailableFieldsNote:
                "Need at least two valid catalogue product IDs to compare.",
            },
          };
        }
        return compareCatalogProducts(validIds);
      },
    }),

    buildHaul: tool({
      description:
        "Build a budget haul/outfit from real catalogue products. Totals are calculated in code.",
      inputSchema: buildHaulInputSchema,
      execute: async (input) => {
        const haul = buildHaulFromCatalog({
          ...input,
          budget: Math.min(input.budget, 5000),
          maximumItems: Math.min(input.maximumItems ?? 5, 8),
        });
        const money = recalculateHaulTotals(haul.products, input.budget);
        return {
          ...haul,
          ...money,
          explanation: haul.explanation,
        };
      },
    }),

    getTrendingProducts: tool({
      description: "Return trending catalogue products.",
      inputSchema: getTrendingInputSchema,
      execute: async ({ category, limit }) => ({
        products: rehydratePublicProducts(
          getTrendingPublicProducts(
            category,
            Math.min(limit, aiConfig.maxProductsReturned)
          )
        ),
      }),
    }),

    getCategories: tool({
      description: "List valid categories with counts and price ranges.",
      inputSchema: z.object({}),
      execute: async () => ({ categories: getCatalogCategoryStats() }),
    }),

    getPriceRange: tool({
      description: "Observed catalogue price range for a query or category.",
      inputSchema: getPriceRangeInputSchema,
      execute: async ({ query, category }) =>
        getObservedPriceRange(query, category),
    }),
  };
}

export type LitBuyAiTools = ReturnType<typeof createLitBuyAiTools>;
