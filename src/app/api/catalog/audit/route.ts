import { NextResponse } from "next/server";
import { runSiteAudit } from "@/lib/catalog-audit";
import {
  assertAdminAuthorized,
  unauthorizedResponse,
} from "@/lib/security/admin-auth";
import {
  checkRouteRateLimit,
  getClientKeyFromRequest,
  rateLimitResponse,
} from "@/lib/security/rate-limit";
import { logSecurityEvent } from "@/lib/security/log";

export const dynamic = "force-dynamic";

/**
 * Admin/diagnostic catalog audit. Not public in production.
 * Auth: Authorization: Bearer $CRON_SECRET
 */
export async function GET(request: Request) {
  if (!assertAdminAuthorized(request)) {
    logSecurityEvent("admin_unauthorized", { route: "catalog/audit" });
    return unauthorizedResponse();
  }

  const limit = checkRouteRateLimit(
    "catalog-audit",
    getClientKeyFromRequest(request),
    { max: 10, windowMs: 60_000 }
  );
  if (!limit.ok) {
    logSecurityEvent("rate_limited", { route: "catalog/audit" });
    return rateLimitResponse(limit.retryAfterSec);
  }

  const report = runSiteAudit();
  return NextResponse.json(report);
}
