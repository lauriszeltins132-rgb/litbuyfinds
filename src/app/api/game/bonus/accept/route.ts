import { NextResponse } from "next/server";
import { acceptGoldenKey } from "@/lib/game/round-engine";
import { validateBonusSkip } from "@/lib/game/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = validateBonusSkip(body);

    if (!parsed) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const result = acceptGoldenKey(parsed.roundId);

    if (!result.ok) {
      return NextResponse.json(
        { error: result.error },
        { status: result.code }
      );
    }

    return NextResponse.json(result.data);
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
