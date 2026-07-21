import { feedbackSchema } from "@/lib/ai/schemas";
import {
  checkAiRateLimit,
  getClientKeyFromRequest,
  readJsonBodyLimited,
} from "@/lib/ai/rate-limit";
import { trackAiEventServer } from "@/lib/ai/telemetry";

export const runtime = "nodejs";
export const maxDuration = 15;

export async function POST(request: Request) {
  const limit = checkAiRateLimit(getClientKeyFromRequest(request));
  if (!limit.ok) {
    return Response.json({ error: "Rate limited" }, { status: 429 });
  }

  const bodyResult = await readJsonBodyLimited(request, 8_000);
  if (!bodyResult.ok) {
    return Response.json({ error: bodyResult.error }, { status: 400 });
  }

  const parsed = feedbackSchema.safeParse(bodyResult.body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid feedback" }, { status: 400 });
  }

  await trackAiEventServer(
    parsed.data.helpful ? "ai_feedback_positive" : "ai_feedback_negative",
    {
      reason: parsed.data.reason,
      entryPoint: parsed.data.entryPoint?.slice(0, 40),
      tool: parsed.data.toolPath?.slice(0, 40),
      resultCount: parsed.data.productIds?.length,
    }
  );

  return Response.json({ ok: true });
}
