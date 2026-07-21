import { assertCronAuthorized } from "@/lib/ai/rate-limit";
import { getAllProducts, getCatalogStats } from "@/lib/products";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * Lightweight health cron for AI index readiness.
 * Auth: Authorization: Bearer $CRON_SECRET
 */
export async function GET(request: Request) {
  if (!assertCronAuthorized(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const products = getAllProducts();
  const stats = getCatalogStats();
  const missingImage = products.filter((p) => !p.image).length;
  const missingPrice = products.filter((p) => p.price == null).length;

  return Response.json({
    ok: true,
    job: "ai-index-health",
    checkedAt: new Date().toISOString(),
    totalProducts: products.length,
    missingImage,
    missingPrice,
    categoryCount: stats.categories,
    note: "Embeddings/pgvector not enabled in v1 — lexical hybrid search only.",
  });
}
