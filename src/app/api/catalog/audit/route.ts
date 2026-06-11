import { NextResponse } from "next/server";
import { runSiteAudit } from "@/lib/catalog-audit";

export const dynamic = "force-dynamic";

export async function GET() {
  const report = runSiteAudit();
  return NextResponse.json(report);
}
