"use client";

import type { AgentId } from "@/lib/agents";
import { getAgentById } from "@/lib/agents";
import AgentLogo from "./AgentLogo";

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
  const logoSize = size === "sm" ? "xs" : "sm";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-bold ${textSize} ${
        agent.recommended
          ? "border-accent/35 bg-accent/12 text-accent"
          : "border-border bg-surface/80 text-muted"
      }`}
    >
      <AgentLogo agentId={agentId} size={logoSize} />
      {agent.name}
      {showRecommended && agent.recommended ? (
        <span className="font-semibold opacity-90">· Recommended</span>
      ) : null}
    </span>
  );
}
