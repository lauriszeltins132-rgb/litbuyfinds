"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const AiPanel = dynamic(() => import("@/components/ai/AiPanel"), {
  ssr: false,
});

type ProductAiActionsProps = {
  productName: string;
  productId: string;
  price: number | null;
};

export default function ProductAiActions({
  productName,
  productId,
  price,
}: ProductAiActionsProps) {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState<string | undefined>();

  function ask(next: string) {
    setPrompt(next);
    setOpen(true);
  }

  const cheaper =
    price != null
      ? `Find cheaper alternatives to ${productName} under $${price}`
      : `Find cheaper alternatives to ${productName}`;

  return (
    <div className="mt-4 rounded-2xl border border-border bg-surface/40 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-accent">
        LitBuy AI
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded-full border border-border px-3 py-1.5 text-xs font-bold hover:border-accent hover:text-accent"
          onClick={() =>
            ask(`Find products similar to ${productName} (id ${productId})`)
          }
        >
          Find similar
        </button>
        <button
          type="button"
          className="rounded-full border border-border px-3 py-1.5 text-xs font-bold hover:border-accent hover:text-accent"
          onClick={() => ask(cheaper)}
        >
          Find cheaper
        </button>
        <button
          type="button"
          className="rounded-full border border-border px-3 py-1.5 text-xs font-bold hover:border-accent hover:text-accent"
          onClick={() =>
            ask(
              `Build an outfit under $120 around ${productName}. Keep the total under budget.`
            )
          }
        >
          Build outfit
        </button>
      </div>
      <AiPanel
        open={open}
        onClose={() => setOpen(false)}
        entryPoint="product"
        initialPrompt={prompt}
      />
    </div>
  );
}
