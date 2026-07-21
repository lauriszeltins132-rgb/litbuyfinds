import { z } from "zod";
import { aiConfig } from "@/lib/ai/config";
import { parseSearchIntent } from "@/lib/ai/query-parser";
import { searchCatalog } from "@/lib/ai/product-search";
import { rehydratePublicProducts } from "@/lib/ai/grounding";
import {
  checkAiRateLimit,
  getClientKeyFromRequest,
  readJsonBodyLimited,
} from "@/lib/ai/rate-limit";
import { searchProductsInputSchema } from "@/lib/ai/schemas";
import { trackAiEventServer } from "@/lib/ai/telemetry";

export const runtime = "nodejs";
export const maxDuration = 30;

const bodySchema = z.object({
  query: z.string().min(1).max(aiConfig.maxPromptChars).optional(),
  intent: searchProductsInputSchema.optional(),
});

export async function POST(request: Request) {
  const limit = checkAiRateLimit(getClientKeyFromRequest(request));
  if (!limit.ok) {
    return Response.json({ error: "Rate limited" }, { status: 429 });
  }

  const bodyResult = await readJsonBodyLimited(request);
  if (!bodyResult.ok) {
    return Response.json({ error: bodyResult.error }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(bodyResult.body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid search payload" }, { status: 400 });
  }

  const intent =
    parsed.data.intent ??
    parseSearchIntent(parsed.data.query ?? "", aiConfig.maxProductsReturned);

  const result = searchCatalog({
    ...intent,
    limit: Math.min(intent.limit, aiConfig.maxProductsReturned),
  });
  const products = rehydratePublicProducts(result.products);

  await trackAiEventServer(
    products.length === 0 ? "ai_no_results" : "ai_results_returned",
    {
      resultCount: products.length,
      tool: "searchProducts",
      category: intent.categories[0],
    }
  );

  return Response.json(
    { ...result, products },
    {
      headers: {
        "Cache-Control": "private, no-store",
      },
    }
  );
}
