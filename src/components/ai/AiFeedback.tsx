"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";

type AiFeedbackProps = {
  responseId?: string;
  productIds?: string[];
  entryPoint?: string;
};

export default function AiFeedback({
  responseId,
  productIds,
  entryPoint,
}: AiFeedbackProps) {
  const [sent, setSent] = useState<"up" | "down" | null>(null);

  async function send(helpful: boolean) {
    setSent(helpful ? "up" : "down");
    track(helpful ? "ai_feedback_positive" : "ai_feedback_negative", {
      entryPoint,
    });
    try {
      await fetch("/api/ai/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          helpful,
          responseId,
          productIds,
          entryPoint,
        }),
      });
    } catch {
      // ignore
    }
  }

  if (sent) {
    return (
      <p className="mt-2 text-xs text-muted" aria-live="polite">
        Thanks for the feedback.
      </p>
    );
  }

  return (
    <div className="mt-2 flex items-center gap-2 text-xs text-muted">
      <span>Was this helpful?</span>
      <button
        type="button"
        className="rounded-full border border-border px-2 py-1 font-semibold hover:border-accent hover:text-accent"
        onClick={() => send(true)}
        aria-label="Mark response helpful"
      >
        Yes
      </button>
      <button
        type="button"
        className="rounded-full border border-border px-2 py-1 font-semibold hover:border-accent hover:text-accent"
        onClick={() => send(false)}
        aria-label="Mark response not helpful"
      >
        No
      </button>
    </div>
  );
}
