import { NextResponse } from "next/server";
import { startRound } from "@/lib/game/round-engine";
import { validateStartRound } from "@/lib/game/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = validateStartRound(body);

    if (!parsed) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const result = startRound(parsed.bet, parsed.balance);

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result.data);
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
