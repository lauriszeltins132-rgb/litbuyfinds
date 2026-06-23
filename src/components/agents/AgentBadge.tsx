"use client";

import type { AgentId } from "@/lib/agents";
import { getAgentById } from "@/lib/agents";

type AgentBadgeProps = {
  agentId: AgentId;
  size?: "sm" | "md";
  showRecommended?: boolean;
};

export default function AgentBadge({
  agentId,
  size = "sm",
  showRecommended = true,
}: AgentBadgeProps) {
  const agent = getAgentById(agentId);
  const textSize = size === "sm" ? "text-[10px]" : "text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-bold ${textSize} ${
        agent.recommended
          ? "border-accent/35 bg-accent/12 text-accent"
          : "border-border bg-surface/80 text-muted"
      }`}
    >
      <span
        className={`flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-black ${
          agent.recommended
            ? "bg-accent text-background"
            : "bg-border text-foreground"
        }`}
        aria-hidden
      >
        {agent.shortLabel.slice(0, 1)}
      </span>
      {agent.name}
      {showRecommended && agent.recommended ? (
        <span className="font-semibold opacity-90">· Recommended</span>
      ) : null}
    </span>
  );
}
