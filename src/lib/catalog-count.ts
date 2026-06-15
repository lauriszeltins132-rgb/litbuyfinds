import productsData from "@/data/products.json";

export function formatCatalogCountForSeo(
  total = (productsData as unknown[]).length
): string {
  if (total >= 10_000) return `${Math.floor(total / 1000) * 1000}+`;
  if (total >= 1000) return `${Math.floor(total / 100) * 100}+`;
  return `${total}+`;
}
