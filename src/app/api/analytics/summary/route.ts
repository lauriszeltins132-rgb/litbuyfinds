import { getAnalyticsSummary } from "@/lib/analytics-store";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json(getAnalyticsSummary());
}
