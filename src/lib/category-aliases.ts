import type { Product } from "./types";
import { getCategoryBySlug, getProductsByCategorySlug } from "./products";
import { getCategorySeo } from "./seo-content";

export type ResolvedCategory = {
  slug: string;
  canonicalSlug: string;
  name: string;
  count: number;
  products: Product[];
  href: string;
};

type AliasConfig = {
  canonicalSlug: string;
  name: string;
  filter?: (product: Product) => boolean;
};

export const CATEGORY_ALIASES: Record<string, AliasConfig> = {
  hoodies: {
    canonicalSlug: "hoodies-and-pants",
    name: "Hoodies",
    filter: (p) => /hoodie|sweatshirt|crewneck|sweater/i.test(p.product_name),
  },
  jackets: {
    canonicalSlug: "coats-and-jackets",
    name: "Jackets",
  },
  tshirts: {
    canonicalSlug: "tshirts-and-shorts",
    name: "T-Shirts",
    filter: (p) =>
      /tee|t-shirt|tshirt|shirt/i.test(p.product_name) &&
      !/short/i.test(p.product_name),
  },
  bags: {
    canonicalSlug: "accessories",
    name: "Bags",
    filter: (p) =>
      /bag|backpack|tote|duffle|crossbody|shoulder bag/i.test(p.product_name),
  },
  pants: {
    canonicalSlug: "hoodies-and-pants",
    name: "Pants",
    filter: (p) =>
      /pant|jogger|sweatpant|trouser|cargo/i.test(p.product_name) &&
      !/hoodie|sweatshirt/i.test(p.product_name),
  },
};

export const CATEGORY_ALIAS_SLUGS = Object.keys(CATEGORY_ALIASES);

export function resolveCategorySlug(slug: string): ResolvedCategory | null {
  const alias = CATEGORY_ALIASES[slug];
  if (alias) {
    const category = getCategoryBySlug(alias.canonicalSlug);
    if (!category) return null;

    let products = getProductsByCategorySlug(alias.canonicalSlug);
    if (alias.filter) {
      products = products.filter(alias.filter);
    }

    return {
      slug,
      canonicalSlug: alias.canonicalSlug,
      name: alias.name,
      count: products.length,
      products,
      href: `/categories/${slug}`,
    };
  }

  const category = getCategoryBySlug(slug);
  if (!category || category.group !== "category") return null;

  return {
    slug,
    canonicalSlug: slug,
    name: category.name,
    count: category.count,
    products: getProductsByCategorySlug(slug),
    href: `/categories/${slug}`,
  };
}

export function getResolvedCategorySeo(resolved: ResolvedCategory) {
  return getCategorySeo(resolved.slug, resolved.name, resolved.count);
}
