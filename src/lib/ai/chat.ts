import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  stepCountIs,
  streamText,
  type UIMessage,
} from "ai";
import { gateway } from "@ai-sdk/gateway";
import { aiConfig, isAiChatConfigured } from "@/lib/ai/config";
import { parseSearchIntent, isHaulRequest, extractBudget } from "@/lib/ai/query-parser";
import {
  buildHaulFromCatalog,
  searchCatalog,
} from "@/lib/ai/product-search";
import { recalculateHaulTotals, rehydratePublicProducts } from "@/lib/ai/grounding";
import { LITBUY_AI_SYSTEM_PROMPT } from "@/lib/ai/system-prompt";
import { createLitBuyAiTools } from "@/lib/ai/tools";

export function lastUserText(messages: UIMessage[]): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    const m = messages[i];
    if (m.role !== "user") continue;
    const parts = m.parts ?? [];
    const text = parts
      .filter((p): p is { type: "text"; text: string } => p.type === "text")
      .map((p) => p.text)
      .join("\n")
      .trim();
    if (text) return text.slice(0, aiConfig.maxPromptChars);
  }
  return "";
}

function catalogueModeDisclaimer(): string {
  return isAiChatConfigured()
    ? ""
    : " (Catalogue search mode — conversational LLM is offline; results still use the live product database.)";
}

/** Deterministic fallback when AI Gateway is not configured or provider fails. */
export function createSearchOnlyStreamResponse(userText: string) {
  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      const id = `asst_${Date.now()}`;
      writer.write({ type: "start", messageId: id });
      writer.write({ type: "start-step" });
      writer.write({ type: "text-start", id: `${id}_t` });

      let summary: string;
      let products = rehydratePublicProducts([]);

      const clipped = userText.slice(0, aiConfig.maxPromptChars);

      if (isHaulRequest(clipped)) {
        const budget = Math.min(extractBudget(clipped) ?? 100, 5000);
        const haul = buildHaulFromCatalog({
          budget,
          query: clipped,
          maximumItems: 5,
        });
        const money = recalculateHaulTotals(haul.products, budget);
        products = money.products;
        summary = `${haul.explanation} Prices and availability may change at LitBuy checkout. Shipping is not included.${catalogueModeDisclaimer()}`;
      } else {
        const intent = parseSearchIntent(clipped, 8);
        const result = searchCatalog(intent);
        products = rehydratePublicProducts(result.products);
        if (products.length === 0) {
          summary =
            "I couldn’t find a strong match in the LitBuy Finds catalogue. Try a broader category, a higher budget, or fewer color constraints." +
            catalogueModeDisclaimer();
        } else if (result.relaxedFilters.length > 0) {
          summary = `No exact match for every constraint — relaxed ${result.relaxedFilters.join(
            ", "
          )}. Showing ${products.length} of ${result.total} real catalogue finds. Prices may change at checkout.${catalogueModeDisclaimer()}`;
        } else {
          summary = `I found ${result.total} matching finds. Here are the top ${products.length} based on your request. Prices and availability may change on LitBuy.${catalogueModeDisclaimer()}`;
        }
      }

      writer.write({ type: "text-delta", id: `${id}_t`, delta: summary });
      writer.write({ type: "text-end", id: `${id}_t` });

      if (products.length > 0) {
        writer.write({
          type: "data-products",
          data: { products },
        });
      }

      writer.write({ type: "finish-step" });
      writer.write({ type: "finish", finishReason: "stop" });
    },
  });

  return createUIMessageStreamResponse({ stream });
}

export async function createAiChatResponse(messages: UIMessage[]) {
  const clipped = messages.slice(-aiConfig.maxHistoryMessages);
  const userText = lastUserText(clipped);

  if (!userText) {
    return createSearchOnlyStreamResponse("");
  }

  if (!isAiChatConfigured()) {
    return createSearchOnlyStreamResponse(userText);
  }

  try {
    const result = streamText({
      model: gateway(aiConfig.primaryModel),
      system: LITBUY_AI_SYSTEM_PROMPT,
      messages: await convertToModelMessages(clipped),
      tools: createLitBuyAiTools(),
      stopWhen: stepCountIs(aiConfig.maxToolCalls),
      maxOutputTokens: aiConfig.maxOutputTokens,
      temperature: 0.3,
      // Provider/stream failures fall back without leaking internals
      onError: () => {
        // Swallow — UI message stream onError below returns safe copy
      },
    });

    return result.toUIMessageStreamResponse({
      originalMessages: clipped,
      onError: () =>
        "LitBuy AI is temporarily unavailable. Try catalogue search on the homepage, or ask again in a moment.",
    });
  } catch {
    return createSearchOnlyStreamResponse(userText);
  }
}
