import { getPopularSpreadsheetIds } from "@/lib/analytics-store";
import { getProductById } from "@/lib/products";
import { spreadsheetMobileProductsNewestFirst } from "@/lib/spreadsheet-mobile-order";
import {
  checkRouteRateLimit,
  getClientKeyFromRequest,
  rateLimitResponse,
} from "@/lib/security/rate-limit";
import { logSecurityEvent } from "@/lib/security/log";

export const dynamic = "force-dynamic";

const MIN_RANKED = 4;

export async function GET(request: Request) {
  const limit = checkRouteRateLimit(
    "analytics-popular",
    getClientKeyFromRequest(request),
    { max: 30, windowMs: 60_000 }
  );
  if (!limit.ok) {
    logSecurityEvent("rate_limited", { route: "analytics/popular" });
    return rateLimitResponse(limit.retryAfterSec);
  }

  const ranked = getPopularSpreadsheetIds(12)
    .map((id) => getProductById(id))
    .filter((product) => product != null);

  const fallback = ranked.length < MIN_RANKED;
  const products = fallback
    ? spreadsheetMobileProductsNewestFirst().slice(0, 12)
    : ranked;

  return Response.json({ fallback, products });
}
