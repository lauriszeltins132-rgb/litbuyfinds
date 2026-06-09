import { NextResponse } from "next/server";
import { getDailyDrop, getUtcDayIndex } from "@/lib/discovery";

export const dynamic = "force-dynamic";

export async function GET() {
  const product = getDailyDrop();
  return NextResponse.json({
    product,
    dayIndex: getUtcDayIndex(),
  });
}
