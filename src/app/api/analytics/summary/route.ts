import { getAnalyticsSummary } from "@/lib/analytics-store";
import {
  checkRouteRateLimit,
  getClientKeyFromRequest,
  rateLimitResponse,
} from "@/lib/security/rate-limit";
import { logSecurityEvent } from "@/lib/security/log";

export const dynamic = "force-dynamic";

/**
 * Public aggregate conversion summary for /stats.
 * Rate-limited; returns aggregates only (no secrets / raw event payloads).
 * For stricter internal access later, prefer CRON_SECRET on a separate admin route.
 */
export async function GET(request: Request) {
  const limit = checkRouteRateLimit(
    "analytics-summary",
    getClientKeyFromRequest(request),
    { max: 30, windowMs: 60_000 }
  );
  if (!limit.ok) {
    logSecurityEvent("rate_limited", { route: "analytics/summary" });
    return rateLimitResponse(limit.retryAfterSec);
  }

  const summary = getAnalyticsSummary();
  // Minimize: drop oversized brand/product tails already sliced in store;
  // keep shape required by StatsDashboard.
  return Response.json({
    totals: summary.totals,
    topProducts: summary.topProducts,
    topBrands: summary.topBrands,
    registerCtr: summary.registerCtr,
    buyCtr: summary.buyCtr,
    topSignupPlacements: summary.topSignupPlacements,
    updatedAt: summary.updatedAt,
  });
}
