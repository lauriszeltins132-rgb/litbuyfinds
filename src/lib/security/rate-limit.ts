/**
 * Lightweight in-memory rate limiter for public API routes.
 * Per serverless instance only — blunts obvious abuse without new deps.
 */
import {
  getClientKeyFromRequest,
  hashClientKey,
} from "@/lib/ai/rate-limit";

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export { getClientKeyFromRequest, hashClientKey };

export type SimpleRateLimitResult =
  | { ok: true; remaining: number }
  | { ok: false; retryAfterSec: number };

export function checkRouteRateLimit(
  scope: string,
  clientKey: string,
  { max, windowMs }: { max: number; windowMs: number }
): SimpleRateLimitResult {
  if (!clientKey || clientKey.length > 64) {
    return { ok: false, retryAfterSec: Math.ceil(windowMs / 1000) };
  }

  const key = `${scope}:${clientKey}`;
  const now = Date.now();
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: max - 1 };
  }

  current.count += 1;
  if (current.count > max) {
    return {
      ok: false,
      retryAfterSec: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }

  return { ok: true, remaining: Math.max(0, max - current.count) };
}

export function rateLimitResponse(retryAfterSec: number): Response {
  return Response.json(
    { error: "Too many requests" },
    {
      status: 429,
      headers: { "Retry-After": String(retryAfterSec) },
    }
  );
}
