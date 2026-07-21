import { timingSafeEqual } from "node:crypto";
import { createHash } from "node:crypto";
import { aiConfig } from "@/lib/ai/config";

type Bucket = { count: number; resetAt: number };

const minuteBuckets = new Map<string, Bucket>();
const dayBuckets = new Map<string, Bucket>();
const dailyGlobal = { count: 0, dayKey: "" };

function dayKey(now = Date.now()): string {
  return new Date(now).toISOString().slice(0, 10);
}

function touch(map: Map<string, Bucket>, key: string, windowMs: number): number {
  const now = Date.now();
  const current = map.get(key);
  if (!current || current.resetAt <= now) {
    map.set(key, { count: 1, resetAt: now + windowMs });
    return 1;
  }
  current.count += 1;
  return current.count;
}

/** Hash IP / identifier — do not store raw IPs. */
export function hashClientKey(raw: string): string {
  return createHash("sha256").update(raw).digest("hex").slice(0, 32);
}

export function getClientKeyFromRequest(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "unknown";
  const ua = request.headers.get("user-agent") ?? "";
  return hashClientKey(`${ip}|${ua.slice(0, 64)}`);
}

export type RateLimitResult =
  | { ok: true; remainingMinute: number; remainingDay: number }
  | { ok: false; reason: "minute" | "day" | "budget"; retryAfterSec: number };

/**
 * In-memory rate limiter (per serverless instance).
 *
 * TODO(distributed-rate-limit): Replace with Redis / Vercel KV for globally
 * consistent limits across Vercel instances. Current limits still blunt
 * obvious abuse within a single warm instance.
 */
export function checkAiRateLimit(clientKey: string): RateLimitResult {
  if (!clientKey || clientKey.length > 64) {
    return { ok: false, reason: "minute", retryAfterSec: 60 };
  }

  const minuteCount = touch(minuteBuckets, clientKey, 60_000);
  const dayCount = touch(dayBuckets, `d:${clientKey}`, 86_400_000);

  const today = dayKey();
  if (dailyGlobal.dayKey !== today) {
    dailyGlobal.dayKey = today;
    dailyGlobal.count = 0;
  }
  dailyGlobal.count += 1;

  if (minuteCount > aiConfig.perIpPerMinute) {
    return { ok: false, reason: "minute", retryAfterSec: 60 };
  }
  if (dayCount > aiConfig.perIpPerDay) {
    return { ok: false, reason: "day", retryAfterSec: 3600 };
  }
  if (dailyGlobal.count > aiConfig.dailyRequestLimit) {
    return { ok: false, reason: "budget", retryAfterSec: 3600 };
  }

  return {
    ok: true,
    remainingMinute: Math.max(0, aiConfig.perIpPerMinute - minuteCount),
    remainingDay: Math.max(0, aiConfig.perIpPerDay - dayCount),
  };
}

function safeEqualString(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

/**
 * Cron auth. In production, CRON_SECRET is mandatory.
 * Local/dev without a secret: allow only when not production (documented).
 */
export function assertCronAuthorized(request: Request): boolean {
  const secret = aiConfig.cronSecret;
  if (!secret) {
    return !aiConfig.isProduction;
  }
  const header = request.headers.get("authorization") ?? "";
  const expected = `Bearer ${secret}`;
  return safeEqualString(header, expected);
}

/** Reject oversized request bodies early. */
export async function readJsonBodyLimited(
  request: Request,
  maxBytes = aiConfig.maxRequestBodyBytes
): Promise<{ ok: true; body: unknown } | { ok: false; error: string }> {
  const contentLength = request.headers.get("content-length");
  if (contentLength && Number(contentLength) > maxBytes) {
    return { ok: false, error: "Payload too large" };
  }

  const text = await request.text();
  if (text.length > maxBytes) {
    return { ok: false, error: "Payload too large" };
  }

  try {
    return { ok: true, body: text ? JSON.parse(text) : {} };
  } catch {
    return { ok: false, error: "Invalid JSON body" };
  }
}
