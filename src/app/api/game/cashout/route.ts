import { NextResponse } from "next/server";
import { cashOut } from "@/lib/game/round-engine";
import { validateCashout } from "@/lib/game/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = validateCashout(body);

    if (!parsed) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const result = cashOut(parsed.roundId, parsed.balance);

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
