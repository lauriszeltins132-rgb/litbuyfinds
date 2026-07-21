import { aiConfig, chatRequestSchema } from "@/lib/ai/config";
import { createAiChatResponse } from "@/lib/ai/chat";
import {
  checkAiRateLimit,
  getClientKeyFromRequest,
  readJsonBodyLimited,
} from "@/lib/ai/rate-limit";
import { latencyBucket, trackAiEventServer } from "@/lib/ai/telemetry";
import type { UIMessage } from "ai";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  const started = Date.now();
  const clientKey = getClientKeyFromRequest(request);
  const limit = checkAiRateLimit(clientKey);

  if (!limit.ok) {
    await trackAiEventServer("ai_error", { reason: limit.reason });
    return Response.json(
      {
        error:
          limit.reason === "budget"
            ? "LitBuy AI has reached today’s usage limit. Catalogue search on the homepage still works."
            : "Too many AI requests. Please wait a moment and try again.",
        retryAfterSec: limit.retryAfterSec,
      },
      {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfterSec) },
      }
    );
  }

  const bodyResult = await readJsonBodyLimited(request);
  if (!bodyResult.ok) {
    return Response.json({ error: bodyResult.error }, { status: 400 });
  }

  // Clients must not select models/tools/providers
  if (
    bodyResult.body &&
    typeof bodyResult.body === "object" &&
    ("model" in bodyResult.body ||
      "tools" in bodyResult.body ||
      "provider" in bodyResult.body ||
      "system" in bodyResult.body)
  ) {
    return Response.json({ error: "Invalid chat payload" }, { status: 400 });
  }

  const parsed = chatRequestSchema.safeParse(bodyResult.body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid chat payload" }, { status: 400 });
  }

  const messages = parsed.data.messages as UIMessage[];
  await trackAiEventServer("ai_query_submitted", {
    entryPoint: parsed.data.entryPoint,
  });

  try {
    const response = await createAiChatResponse(messages);
    await trackAiEventServer("ai_results_returned", {
      entryPoint: parsed.data.entryPoint,
      latencyBucket: latencyBucket(Date.now() - started),
    });
    // Hint for UI: whether LLM mode is active (no secrets)
    response.headers.set(
      "X-LitBuy-AI-Mode",
      aiConfig.gatewayApiKey ? "llm" : "catalogue"
    );
    return response;
  } catch {
    await trackAiEventServer("ai_error", {
      entryPoint: parsed.data.entryPoint,
      reason: "provider",
    });
    return Response.json(
      { error: "LitBuy AI is temporarily unavailable." },
      { status: 503 }
    );
  }
}
