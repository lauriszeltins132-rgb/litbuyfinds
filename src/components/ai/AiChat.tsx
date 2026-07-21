"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, isToolUIPart, type UIMessage } from "ai";
import { useEffect, useMemo, useRef, useState } from "react";
import AiFeedback from "@/components/ai/AiFeedback";
import AiProductGrid from "@/components/ai/AiProductGrid";
import AiPromptChips from "@/components/ai/AiPromptChips";
import type { PublicProduct } from "@/lib/ai/schemas";
import { publicProductSchema } from "@/lib/ai/schemas";

type AiChatProps = {
  entryPoint?: "homepage" | "floating" | "ai-page" | "product" | "collection";
  initialPrompt?: string;
  compact?: boolean;
};

function extractProductsFromMessage(message: UIMessage): PublicProduct[] {
  const found: PublicProduct[] = [];
  const seen = new Set<string>();

  for (const part of message.parts ?? []) {
    if (part.type === "data-products") {
      const data = (part as { data?: { products?: unknown } }).data;
      const list = Array.isArray(data?.products) ? data.products : [];
      for (const item of list) {
        const parsed = publicProductSchema.safeParse(item);
        if (parsed.success && !seen.has(parsed.data.id)) {
          seen.add(parsed.data.id);
          found.push(parsed.data);
        }
      }
    }

    if (isToolUIPart(part)) {
      const state = (part as { state?: string }).state;
      if (state !== "output-available") continue;
      const output = (part as { output?: unknown }).output as
        | {
            products?: unknown[];
            product?: unknown;
          }
        | undefined;
      if (!output) continue;

      if (Array.isArray(output.products)) {
        for (const item of output.products) {
          const parsed = publicProductSchema.safeParse(item);
          if (parsed.success && !seen.has(parsed.data.id)) {
            seen.add(parsed.data.id);
            found.push(parsed.data);
          }
        }
      }

      if (output.product) {
        const parsed = publicProductSchema.safeParse(output.product);
        if (parsed.success && !seen.has(parsed.data.id)) {
          seen.add(parsed.data.id);
          found.push(parsed.data);
        }
      }
    }
  }

  return found;
}

function messageText(message: UIMessage): string {
  return (message.parts ?? [])
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("\n")
    .trim();
}

export default function AiChat({
  entryPoint = "ai-page",
  initialPrompt,
  compact = false,
}: AiChatProps) {
  const [input, setInput] = useState("");
  const scrollerRef = useRef<HTMLDivElement>(null);
  const bootstrapped = useRef(false);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/ai/chat",
        body: { entryPoint },
      }),
    [entryPoint]
  );

  const { messages, sendMessage, status, stop, setMessages, error, clearError } =
    useChat({ transport });

  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    const node = scrollerRef.current;
    if (!node) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    node.scrollTo({
      top: node.scrollHeight,
      behavior: reduce ? "auto" : "smooth",
    });
  }, [messages, status]);

  useEffect(() => {
    if (!initialPrompt || bootstrapped.current) return;
    bootstrapped.current = true;
    void sendMessage({ text: initialPrompt.slice(0, 1200) });
  }, [initialPrompt, sendMessage]);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    clearError();
    await sendMessage({ text: text.slice(0, 1200) });
  }

  function clearConversation() {
    stop();
    setMessages([]);
    setInput("");
    clearError();
  }

  return (
    <div
      className={`flex flex-col ${compact ? "h-[min(70vh,640px)]" : "min-h-[70vh]"}`}
    >
      <div
        ref={scrollerRef}
        className="flex-1 space-y-4 overflow-y-auto px-1 py-2"
        aria-live="polite"
        aria-relevant="additions"
      >
        {messages.length === 0 ? (
          <div className="rounded-2xl border border-border bg-surface/40 p-5">
            <p className="text-sm font-bold text-foreground">
              Ask LitBuy AI what you want to find
            </p>
            <p className="mt-2 text-sm text-muted">
              Describe a product, budget, color, or haul. Results come only from
              the live LitBuy Finds catalogue — never invented listings.
            </p>
            <p className="mt-2 text-xs text-muted">
              If conversational AI is offline, catalogue search mode still returns
              real products from the same database.
            </p>
            <div className="mt-4">
              <AiPromptChips
                onSelect={(prompt) => {
                  void sendMessage({ text: prompt });
                }}
              />
            </div>
          </div>
        ) : null}

        {messages.map((message) => {
          const text = messageText(message);
          const products = extractProductsFromMessage(message);
          const isUser = message.role === "user";

          return (
            <div
              key={message.id}
              className={`rounded-2xl border px-4 py-3 ${
                isUser
                  ? "ml-6 border-accent/30 bg-accent/5"
                  : "mr-2 border-border bg-surface/50"
              }`}
            >
              <p className="text-[10px] font-bold uppercase tracking-wide text-muted">
                {isUser ? "You" : "LitBuy AI"}
              </p>
              {text ? (
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                  {text}
                </p>
              ) : null}
              {!isUser && products.length > 0 ? (
                <AiProductGrid
                  products={products.slice(0, 9)}
                  title="Matched finds"
                />
              ) : null}
              {!isUser && text ? (
                <AiFeedback
                  responseId={message.id}
                  productIds={products.map((p) => p.id)}
                  entryPoint={entryPoint}
                />
              ) : null}
            </div>
          );
        })}

        {busy ? (
          <p className="text-sm text-muted" role="status">
            Searching the catalogue…
          </p>
        ) : null}

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error.message || "LitBuy AI is temporarily unavailable."}
            <button
              type="button"
              className="ml-2 font-bold underline"
              onClick={() => clearError()}
            >
              Dismiss
            </button>
          </div>
        ) : null}
      </div>

      <form
        onSubmit={onSubmit}
        className="mt-3 border-t border-border pt-3"
      >
        <label htmlFor="litbuy-ai-input" className="sr-only">
          Ask LitBuy AI
        </label>
        <div className="flex gap-2">
          <input
            id="litbuy-ai-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. black sneakers under €45"
            maxLength={1200}
            disabled={busy}
            className="min-w-0 flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none ring-accent focus:ring-2 disabled:opacity-60"
          />
          {busy ? (
            <button
              type="button"
              onClick={() => stop()}
              className="min-h-11 rounded-full border border-border px-4 py-2 text-sm font-bold"
            >
              Stop
            </button>
          ) : (
            <button
              type="submit"
              className="min-h-11 rounded-full bg-accent px-4 py-2 text-sm font-bold text-white hover:opacity-90 disabled:opacity-50"
              disabled={!input.trim()}
            >
              Ask
            </button>
          )}
        </div>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={clearConversation}
            className="text-xs font-semibold text-muted hover:text-accent"
          >
            Clear conversation
          </button>
          <p className="text-[11px] text-muted">
            Prices may change at LitBuy checkout. Shipping not included.
          </p>
        </div>
      </form>
    </div>
  );
}
