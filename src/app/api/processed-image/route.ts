import { NextRequest, NextResponse } from "next/server";
import { validateImageUrl } from "@/lib/image-url";
import { removeWhiteBackgroundFromBuffer } from "@/lib/remove-white-bg.server";

export const runtime = "nodejs";
export const maxDuration = 30;

const CACHE = "public, max-age=31536000, immutable";

export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get("url");
  if (!raw) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  const { valid, normalized } = validateImageUrl(raw);
  if (!valid) {
    return NextResponse.json({ error: "Invalid image url" }, { status: 400 });
  }

  try {
    const upstream = await fetch(normalized, {
      headers: { "User-Agent": "LitBuyFinds-ImageProxy/1.0" },
      signal: AbortSignal.timeout(18_000),
    });

    if (!upstream.ok) {
      return NextResponse.redirect(normalized, 302);
    }

    const input = Buffer.from(await upstream.arrayBuffer());
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
