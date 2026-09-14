import { NextRequest, NextResponse } from "next/server";
import { validateImageUrl } from "@/lib/image-url";
import { removeWhiteBackgroundFromBuffer } from "@/lib/remove-white-bg.server";
import {
  checkRouteRateLimit,
  getClientKeyFromRequest,
  rateLimitResponse,
} from "@/lib/security/rate-limit";
import { isPrivateOrBlockedHost } from "@/lib/security/url-policy";
import { logSecurityEvent } from "@/lib/security/log";

export const runtime = "nodejs";
export const maxDuration = 30;

const CACHE = "public, max-age=31536000, immutable";
const MAX_BYTES = 8 * 1024 * 1024;
const FETCH_TIMEOUT_MS = 12_000;
const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

function isSafeImageTarget(rawUrl: string): { ok: true; url: URL } | { ok: false } {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return { ok: false };
  }

  if (parsed.protocol !== "https:") return { ok: false };
  if (parsed.username || parsed.password) return { ok: false };
  if (parsed.port && parsed.port !== "443") return { ok: false };
  if (isPrivateOrBlockedHost(parsed.hostname)) return { ok: false };

  const validation = validateImageUrl(parsed.toString());
  if (!validation.valid) return { ok: false };

  return { ok: true, url: new URL(validation.normalized) };
}

async function fetchImageLimited(target: URL): Promise<Response | null> {
  // Do not follow redirects automatically — re-validate destination if present.
  const upstream = await fetch(target.toString(), {
    headers: {
      Accept: "image/avif,image/webp,image/*,*/*;q=0.8",
      "User-Agent": "LitBuyFinds-ImageProxy/1.1",
    },
    redirect: "manual",
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });

  if (upstream.status >= 300 && upstream.status < 400) {
    const location = upstream.headers.get("location");
    if (!location) return null;
    let next: URL;
    try {
      next = new URL(location, target);
    } catch {
      return null;
    }
    const safe = isSafeImageTarget(next.toString());
    if (!safe.ok) {
      logSecurityEvent("image_proxy_blocked", {
        reason: "redirect_host",
        host: next.hostname,
      });
      return null;
    }
    return fetch(safe.url.toString(), {
      headers: {
        Accept: "image/avif,image/webp,image/*,*/*;q=0.8",
        "User-Agent": "LitBuyFinds-ImageProxy/1.1",
      },
      redirect: "error",
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
  }

  return upstream;
}

function mimeAllowed(contentType: string | null): boolean {
  if (!contentType) return false;
  const mime = contentType.split(";")[0]?.trim().toLowerCase() ?? "";
  return ALLOWED_MIME.has(mime);
}

export async function GET(request: NextRequest) {
  const limit = checkRouteRateLimit(
    "processed-image",
    getClientKeyFromRequest(request),
    { max: 60, windowMs: 60_000 }
  );
  if (!limit.ok) {
    logSecurityEvent("rate_limited", { route: "processed-image" });
    return rateLimitResponse(limit.retryAfterSec);
  }

  const raw = request.nextUrl.searchParams.get("url");
  if (!raw) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  const safe = isSafeImageTarget(raw);
  if (!safe.ok) {
    logSecurityEvent("image_proxy_blocked", { reason: "allowlist" });
    return NextResponse.json({ error: "Invalid image url" }, { status: 400 });
  }

  const normalized = safe.url.toString();

  try {
    const upstream = await fetchImageLimited(safe.url);
    if (!upstream || !upstream.ok) {
      return NextResponse.redirect(normalized, 302);
    }

    if (!mimeAllowed(upstream.headers.get("content-type"))) {
      logSecurityEvent("image_proxy_blocked", { reason: "mime" });
      return NextResponse.redirect(normalized, 302);
    }

    const contentLength = upstream.headers.get("content-length");
    if (contentLength && Number(contentLength) > MAX_BYTES) {
      logSecurityEvent("image_proxy_blocked", { reason: "size_header" });
      return NextResponse.redirect(normalized, 302);
    }

    const reader = upstream.body?.getReader();
    if (!reader) {
      return NextResponse.redirect(normalized, 302);
    }

    const chunks: Uint8Array[] = [];
    let total = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > MAX_BYTES) {
        reader.cancel().catch(() => {});
        logSecurityEvent("image_proxy_blocked", { reason: "size_body" });
        return NextResponse.redirect(normalized, 302);
      }
      chunks.push(value);
    }

    const input = Buffer.concat(chunks.map((c) => Buffer.from(c)));
    const cutout = await removeWhiteBackgroundFromBuffer(input);

    return new NextResponse(new Uint8Array(cutout), {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": CACHE,
        "CDN-Cache-Control": CACHE,
        "Vercel-CDN-Cache-Control": CACHE,
      },
    });
  } catch {
    return NextResponse.redirect(normalized, 302);
  }
}
