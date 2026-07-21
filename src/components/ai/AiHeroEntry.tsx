"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AiPromptChips from "@/components/ai/AiPromptChips";

const AiPanel = dynamic(() => import("@/components/ai/AiPanel"), {
  ssr: false,
});

export default function AiHeroEntry() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState<string | undefined>();

  function submit(text: string) {
    const q = text.trim();
    if (!q) return;
    // Full page for longer sessions; panel for quick asks
    if (q.length > 80) {
      router.push(`/ai?q=${encodeURIComponent(q)}`);
      return;
    }
    setPrompt(q);
    setOpen(true);
  }

  return (
    <section className="mx-auto mt-8 max-w-[700px] rounded-3xl border border-border bg-surface/50 p-5 text-left sm:p-6">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
        LitBuy AI
      </p>
      <h2 className="mt-2 text-xl font-black tracking-tight text-foreground sm:text-2xl">
        Ask LitBuy AI
      </h2>
      <p className="mt-2 text-sm text-muted">
        Describe what you’re looking for and get matched with products from our
        finds.
      </p>
      <form
        className="mt-4 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          submit(value);
        }}
      >
        <label htmlFor="ai-hero-input" className="sr-only">
          Ask LitBuy AI
        </label>
        <input
          id="ai-hero-input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Black sneakers under €45"
          className="min-w-0 flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-sm outline-none ring-accent focus:ring-2"
        />
        <button
          type="submit"
          className="rounded-full bg-accent px-4 py-2 text-sm font-bold text-white"
        >
          Ask
        </button>
      </form>
      <div className="mt-4">
        <AiPromptChips
          onSelect={(p) => {
            setValue(p);
            submit(p);
          }}
        />
      </div>
      <p className="mt-3 text-xs text-muted">
        Or open the full assistant on{" "}
        <a href="/ai" className="font-bold text-accent hover:underline">
          /ai
        </a>
        .
      </p>
      <AiPanel
        open={open}
        onClose={() => setOpen(false)}
        entryPoint="homepage"
        initialPrompt={prompt}
      />
    </section>
  );
}
