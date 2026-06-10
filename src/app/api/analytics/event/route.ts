import { recordEvent } from "@/lib/analytics-store";
import type { ConversionEvent } from "@/lib/analytics-events";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      event: ConversionEvent;
      location?: string;
      productId?: string;
      productName?: string;
      brand?: string;
      category?: string;
    };

    if (!body?.event) {
      return Response.json({ ok: false, error: "Missing event" }, { status: 400 });
    }

    recordEvent(body);
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }
}
