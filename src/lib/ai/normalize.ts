import type { Product } from "@/lib/types";
import { getDisplayBrand, getDisplayProductName } from "@/lib/product-validation";
import { getProductSource } from "@/lib/filters";
import { getProductHref, getProductSlug } from "@/lib/slugs";
import { detectColors } from "@/lib/ai/synonyms";
import type { PublicProduct } from "@/lib/ai/schemas";
import { SITE_URL } from "@/lib/site";
import { withCurrentLitBuyInvite } from "@/lib/agents";

/**
 * Normalize catalog Product → public AI-safe record.
 * Affiliate URLs pass through existing invite rewrite helpers — never invent links.
 */
export function toPublicProduct(
  product: Product,
  matchReason?: string
): PublicProduct {
  const brand = getDisplayBrand(product);
  const name = getDisplayProductName(product);
  const colors = detectColors(product.product_name);
  const tags: string[] = [];
  if (product.qc_link) tags.push("qc");
  if (product.group === "featured") tags.push("featured");
  if (product.sheet) tags.push(product.sheet);

  const affiliateRaw = product.affiliate_link || "";
  const affiliateUrl = affiliateRaw
    ? withCurrentLitBuyInvite(affiliateRaw)
    : "";

  return {
    id: product.id,
    slug: getProductSlug(product),
    name,
    imageUrl: product.image || "",
    price: product.price,
    currency: "USD",
    category: product.category,
    categorySlug: product.category_slug,
    brand,
    colors,
    tags,
    source: getProductSource(product.affiliate_link),
    hasQc: Boolean(product.qc_link),
    productUrl: `${SITE_URL}${getProductHref(product)}`,
    affiliateUrl,
    ...(matchReason ? { matchReason } : {}),
  };
}

export function buildSearchableText(product: Product): string {
  const brand = getDisplayBrand(product) ?? "";
  return [
    product.product_name,
    product.category,
    brand,
    product.sheet,
    product.category_slug,
  ]
    .join(" ")
    .toLowerCase();
}
