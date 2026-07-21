"use client";

import { track } from "@vercel/analytics";
import { AI_PROMPT_CHIPS } from "@/lib/ai/prompt-chips";

type AiPromptChipsProps = {
  onSelect: (prompt: string) => void;
  chips?: readonly { label: string; prompt: string }[];
};

export default function AiPromptChips({
  onSelect,
  chips = AI_PROMPT_CHIPS,
}: AiPromptChipsProps) {
  return (
    <div className="flex flex-wrap gap-2" role="list" aria-label="Suggested searches">
      {chips.map((chip) => (
        <button
          key={chip.label}
          type="button"
          role="listitem"
          onClick={() => {
            track("ai_followup_clicked", { category: chip.label });
            onSelect(chip.prompt);
          }}
          className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground transition hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {chip.label}
        </button>
      ))}
    </div>
  );
}
