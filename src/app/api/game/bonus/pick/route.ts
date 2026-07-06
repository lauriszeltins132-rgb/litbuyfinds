import { NextResponse } from "next/server";
import { pickBonusChest } from "@/lib/game/round-engine";
import { validateBonusPick } from "@/lib/game/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = validateBonusPick(body);

    if (!parsed) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const result = pickBonusChest(parsed.roundId, parsed.chestIndex);

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
