import { track } from "@vercel/analytics/server";

export type AiAnalyticsEvent =
  | "ai_opened"
  | "ai_query_submitted"
  | "ai_results_returned"
  | "ai_no_results"
  | "ai_product_clicked"
  | "ai_affiliate_link_clicked"
  | "ai_followup_clicked"
  | "ai_compare_started"
  | "ai_haul_created"
  | "ai_haul_item_replaced"
  | "ai_feedback_positive"
  | "ai_feedback_negative"
  | "ai_error";

export type AiAnalyticsProps = {
  entryPoint?: string;
  resultCount?: number;
  category?: string;
  priceBucket?: string;
  latencyBucket?: string;
  tool?: string;
  reason?: string;
};

/** Server-side privacy-safe analytics — no raw prompts. */
export async function trackAiEventServer(
  event: AiAnalyticsEvent,
  props: AiAnalyticsProps = {}
) {
  try {
    await track(event, props);
  } catch {
    // Analytics must never break AI responses
  }
}

export function priceBucket(price: number | null | undefined): string {
  if (price == null) return "unknown";
  if (price < 20) return "under-20";
  if (price < 30) return "under-30";
  if (price < 50) return "under-50";
  if (price < 100) return "under-100";
  return "100-plus";
}

export function latencyBucket(ms: number): string {
  if (ms < 300) return "lt-300ms";
  if (ms < 800) return "lt-800ms";
  if (ms < 2000) return "lt-2s";
  return "gte-2s";
}
