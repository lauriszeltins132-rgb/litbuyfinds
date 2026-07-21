import { z } from "zod";

export const publicProductSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  imageUrl: z.string(),
  price: z.number().nullable(),
  currency: z.literal("USD"),
  category: z.string(),
  categorySlug: z.string(),
  brand: z.string().nullable(),
  colors: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  source: z.string().nullable(),
  hasQc: z.boolean(),
  productUrl: z.string(),
  affiliateUrl: z.string(),
  matchReason: z.string().optional(),
});

export type PublicProduct = z.infer<typeof publicProductSchema>;

export const searchIntentSchema = z.object({
  query: z.string().max(200).default(""),
  categories: z.array(z.string().max(64)).max(8).default([]),
  brands: z.array(z.string().max(64)).max(8).default([]),
  colors: z.array(z.string().max(32)).max(8).default([]),
  minPrice: z.number().nonnegative().max(10000).nullable().default(null),
  maxPrice: z.number().nonnegative().max(10000).nullable().default(null),
  tags: z.array(z.string().max(48)).max(12).default([]),
  requireQc: z.boolean().default(false),
  sort: z
    .enum(["relevance", "price-asc", "price-desc", "popular", "newest"])
    .default("relevance"),
  limit: z.number().int().min(1).max(24).default(8),
  excludeProductIds: z.array(z.string().max(64)).max(48).default([]),
  useCase: z.string().max(64).optional(),
  season: z.string().max(32).optional(),
  style: z.string().max(64).optional(),
});

export type SearchIntent = z.infer<typeof searchIntentSchema>;

export const searchProductsInputSchema = searchIntentSchema;

export const getProductDetailsInputSchema = z.object({
  productId: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
});

export const findSimilarInputSchema = z.object({
  productId: z.string().min(1),
  maxPrice: z.number().nonnegative().optional(),
  category: z.string().optional(),
  limit: z.number().int().min(1).max(12).default(6),
  cheaperOnly: z.boolean().default(false),
  sameColor: z.boolean().default(false),
});

export const compareProductsInputSchema = z.object({
  productIds: z.array(z.string()).min(2).max(4),
});

export const buildHaulInputSchema = z.object({
  budget: z.number().positive().max(5000),
  requestedCategories: z.array(z.string().max(64)).max(8).default([]),
  style: z.string().max(64).optional(),
  colors: z.array(z.string().max(32)).max(8).default([]),
  season: z.string().max(32).optional(),
  useCase: z.string().max(64).optional(),
  maximumItems: z.number().int().min(1).max(8).default(5),
  query: z.string().max(200).optional(),
});

export const getTrendingInputSchema = z.object({
  category: z.string().optional(),
  limit: z.number().int().min(1).max(24).default(8),
});

export const getPriceRangeInputSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
});

export const feedbackSchema = z.object({
  helpful: z.boolean(),
  reason: z
    .enum([
      "irrelevant",
      "wrong_price",
      "broken_link",
      "too_few",
      "missing_category",
      "slow",
      "other",
    ])
    .optional(),
  responseId: z.string().max(128).optional(),
  productIds: z.array(z.string().max(64)).max(24).optional(),
  entryPoint: z.string().max(40).optional(),
  toolPath: z.string().max(40).optional(),
});
