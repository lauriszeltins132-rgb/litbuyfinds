import { NextResponse } from "next/server";
import { getDailyDrop, getUtcDayIndex } from "@/lib/discovery";
import {
  checkRouteRateLimit,
  getClientKeyFromRequest,
  rateLimitResponse,
} from "@/lib/security/rate-limit";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const limit = checkRouteRateLimit(
    "daily-drop",
    getClientKeyFromRequest(request),
    { max: 120, windowMs: 60_000 }
  );
  if (!limit.ok) {
    return rateLimitResponse(limit.retryAfterSec);
  }

  const product = getDailyDrop();
  return NextResponse.json({
    product,
    dayIndex: getUtcDayIndex(),
  });
}
