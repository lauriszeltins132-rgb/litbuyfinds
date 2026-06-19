/** Client-safe engagement reads — no Node fs imports. */

type ProductClicks = {
  name: string;
  brand: string;
  clicks: number;
  saves: number;
};

type EngagementStore = {
  products: Record<string, ProductClicks>;
};

function readMemoryStore(): EngagementStore | undefined {
  const store = globalThis.__litbuyAnalyticsStore as EngagementStore | undefined;
  return store?.products ? store : undefined;
}

export function getProductEngagementScore(productId: string): number {
  return readMemoryStore()?.products[productId]?.clicks ?? 0;
}

export function getProductSaveScore(productId: string): number {
  return readMemoryStore()?.products[productId]?.saves ?? 0;
}

export function getProductCombinedEngagement(productId: string): number {
  return getProductEngagementScore(productId) + getProductSaveScore(productId);
}

export function getTopProductIdsFromMemory(limit = 12): string[] {
  const products = readMemoryStore()?.products ?? {};
  return Object.entries(products)
    .sort(([, a], [, b]) => b.clicks - a.clicks)
    .slice(0, limit)
    .map(([id]) => id);
}
