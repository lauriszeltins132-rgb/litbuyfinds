import { getProductById } from "@/lib/products";
import { toPublicProduct } from "@/lib/ai/normalize";
import type { PublicProduct } from "@/lib/ai/schemas";
import { aiConfig } from "@/lib/ai/config";

/**
 * Re-hydrate product cards exclusively from the live catalogue.
 * Any ID that is missing, invented, or non-catalog is discarded.
 * Prices, URLs, and affiliate links always come from catalog records.
 */
export function rehydratePublicProducts(
  candidates: Array<{ id?: string; matchReason?: string } | PublicProduct | null | undefined>,
  options: { limit?: number; matchReasonFallback?: string } = {}
): PublicProduct[] {
  const limit = Math.min(
    options.limit ?? aiConfig.maxProductsReturned,
    aiConfig.maxProductsReturned
  );
  const seen = new Set<string>();
  const out: PublicProduct[] = [];

  for (const candidate of candidates) {
    if (!candidate || typeof candidate !== "object") continue;
    const id = "id" in candidate ? candidate.id : undefined;
    if (!id || typeof id !== "string" || seen.has(id)) continue;

    const catalog = getProductById(id);
    if (!catalog) continue;

    seen.add(id);
    const reason =
      "matchReason" in candidate && typeof candidate.matchReason === "string"
        ? candidate.matchReason.slice(0, 240)
        : options.matchReasonFallback;

    out.push(toPublicProduct(catalog, reason));
    if (out.length >= limit) break;
  }

  return out;
}

/** Accept only known catalogue IDs — drop everything else. */
export function filterValidCatalogIds(ids: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const id of ids) {
    if (!id || seen.has(id)) continue;
    if (!getProductById(id)) continue;
    seen.add(id);
    out.push(id);
  }
  return out;
}

/**
 * Recalculate haul money fields from catalogue prices only.
 */
export function recalculateHaulTotals(
  products: PublicProduct[],
  budget: number
): {
  products: PublicProduct[];
  subtotal: number;
  remainingBudget: number;
  currency: "USD";
  shippingExcluded: true;
} {
  const grounded = rehydratePublicProducts(products);
  const subtotal = Number(
    grounded.reduce((sum, p) => sum + (p.price ?? 0), 0).toFixed(2)
  );
  return {
    products: grounded,
    subtotal,
    remainingBudget: Number((budget - subtotal).toFixed(2)),
    currency: "USD",
    shippingExcluded: true,
  };
}
