import { z } from "zod";

/** Central AI configuration — no hardcoded model IDs in call sites. */

function readEnv(name: string, fallback = ""): string {
  return (process.env[name] ?? fallback).trim();
}

function readInt(name: string, fallback: number): number {
  const raw = readEnv(name);
  if (!raw) return fallback;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

/** Documented safe default when AI_PRIMARY_MODEL is unset. */
export const DEFAULT_PRIMARY_MODEL = "openai/gpt-4o-mini";
export const DEFAULT_FALLBACK_MODEL = "openai/gpt-4o";

const MODEL_ID_PATTERN = /^[a-z0-9][a-z0-9._/-]{0,127}$/i;

function readModelId(name: string, fallback: string): string {
  const raw = readEnv(name, fallback);
  if (!MODEL_ID_PATTERN.test(raw)) return fallback;
  return raw;
}

export const aiConfig = {
  gatewayApiKey: readEnv("AI_GATEWAY_API_KEY"),
  primaryModel: readModelId("AI_PRIMARY_MODEL", DEFAULT_PRIMARY_MODEL),
  fallbackModel: readModelId("AI_FALLBACK_MODEL", DEFAULT_FALLBACK_MODEL),
  embeddingModel: readEnv("AI_EMBEDDING_MODEL"),
  maxOutputTokens: Math.min(readInt("AI_MAX_OUTPUT_TOKENS", 1200), 4000),
  dailyRequestLimit: readInt("AI_DAILY_REQUEST_LIMIT", 800),
  perIpPerMinute: readInt("AI_RATE_LIMIT_PER_MINUTE", 12),
  perIpPerDay: readInt("AI_RATE_LIMIT_PER_DAY", 80),
  maxHistoryMessages: Math.min(readInt("AI_MAX_HISTORY_MESSAGES", 16), 24),
  maxPromptChars: Math.min(readInt("AI_MAX_PROMPT_CHARS", 1200), 4000),
  maxToolCalls: Math.min(readInt("AI_MAX_TOOL_CALLS", 6), 8),
  maxProductsReturned: Math.min(readInt("AI_MAX_PRODUCTS", 12), 24),
  maxRequestBodyBytes: 100_000,
  cronSecret: readEnv("CRON_SECRET"),
  siteUrl: readEnv("NEXT_PUBLIC_SITE_URL", "https://litbuyfinds.io"),
  isProduction: process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production",
};

export function isAiChatConfigured(): boolean {
  return Boolean(aiConfig.gatewayApiKey);
}

const uiMessageSchema = z
  .object({
    id: z.string().max(128).optional(),
    role: z.enum(["user", "assistant", "system"]),
    parts: z.array(z.unknown()).max(40).optional(),
    content: z.unknown().optional(),
  })
  .passthrough();

/**
 * Chat body — clients cannot choose model, tools, or provider.
 * Unknown transport keys are ignored; only messages + entryPoint are used.
 */
export const chatRequestSchema = z.object({
  messages: z.array(uiMessageSchema).min(1).max(aiConfig.maxHistoryMessages),
  entryPoint: z
    .enum(["homepage", "floating", "ai-page", "product", "collection", "other"])
    .optional()
    .default("other"),
});

export type ChatEntryPoint = z.infer<typeof chatRequestSchema>["entryPoint"];
