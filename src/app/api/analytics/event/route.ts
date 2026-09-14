import { recordEvent } from "@/lib/analytics-store";
import type { ConversionEvent } from "@/lib/analytics-events";
import { readJsonBodyLimited } from "@/lib/ai/rate-limit";
import {
  checkRouteRateLimit,
  getClientKeyFromRequest,
  rateLimitResponse,
} from "@/lib/security/rate-limit";
import { logSecurityEvent } from "@/lib/security/log";

const ALLOWED_EVENTS = new Set<ConversionEvent>([
  "page_view",
  "product_view",
  "register_impression",
  "register_click",
  "buy_click",
  "qc_click",
  "discord_click",
  "telegram_click",
  "broken_image",
  "search_submit",
  "search_chip_click",
  "save_click",
  "category_click",
  "brand_click",
  "collection_click",
  "popup_impression",
  "popup_close",
]);

const MAX_STRING = 160;
const MAX_BODY_BYTES = 4_096;

function clip(value: unknown, max = MAX_STRING): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return trimmed.slice(0, max);
}

export async function POST(request: Request) {
  const limit = checkRouteRateLimit(
    "analytics-event",
    getClientKeyFromRequest(request),
    { max: 120, windowMs: 60_000 }
  );
  if (!limit.ok) {
    logSecurityEvent("rate_limited", { route: "analytics/event" });
    return rateLimitResponse(limit.retryAfterSec);
  }

  const bodyResult = await readJsonBodyLimited(request, MAX_BODY_BYTES);
  if (!bodyResult.ok) {
    logSecurityEvent("malformed_api_request", {
      route: "analytics/event",
      reason: bodyResult.error,
    });
    return Response.json({ ok: false, error: bodyResult.error }, { status: 400 });
  }

  const body = bodyResult.body;
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return Response.json({ ok: false, error: "Invalid payload" }, { status: 400 });
  }

  const record = body as Record<string, unknown>;
  const event = record.event;
  if (typeof event !== "string" || !ALLOWED_EVENTS.has(event as ConversionEvent)) {
    logSecurityEvent("malformed_api_request", {
      route: "analytics/event",
      reason: "event",
    });
    return Response.json({ ok: false, error: "Invalid event" }, { status: 400 });
  }

  // Reject unexpected property explosion
  const allowedKeys = new Set([
    "event",
    "location",
    "productId",
    "productName",
    "brand",
    "category",
    "query",
    "href",
    "variant",
    "ts",
  ]);
  for (const key of Object.keys(record)) {
    if (!allowedKeys.has(key)) {
      logSecurityEvent("malformed_api_request", {
        route: "analytics/event",
        reason: "extra_key",
      });
      return Response.json({ ok: false, error: "Invalid payload" }, { status: 400 });
    }
  }

  try {
    recordEvent({
      event: event as ConversionEvent,
      location: clip(record.location, 80),
      productId: clip(record.productId, 64),
      productName: clip(record.productName, MAX_STRING),
      brand: clip(record.brand, 80),
      category: clip(record.category, 80),
    });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }
}
