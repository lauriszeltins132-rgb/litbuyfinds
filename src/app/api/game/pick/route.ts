import { NextResponse } from "next/server";
import { pickChest } from "@/lib/game/round-engine";
import { validatePick } from "@/lib/game/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = validatePick(body);

    if (!parsed) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const result = pickChest(parsed.roundId, parsed.chestIndex);

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
