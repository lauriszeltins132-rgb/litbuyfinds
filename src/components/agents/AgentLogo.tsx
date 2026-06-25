import Image from "next/image";
import type { AgentId } from "@/lib/agents";
import { getAgentById } from "@/lib/agents";
import { getAgentLogoPath } from "@/lib/agent-logos";

type AgentLogoProps = {
  agentId: AgentId;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
};

const SIZE_PX = {
  xs: 20,
  sm: 28,
  md: 36,
  lg: 44,
} as const;

export default function AgentLogo({
  agentId,
  size = "sm",
  className = "",
}: AgentLogoProps) {
  const agent = getAgentById(agentId);
  const src = getAgentLogoPath(agentId);
  const px = SIZE_PX[size];

  if (src) {
    return (
      <span
        className={`agent-logo agent-logo--${size} ${className}`.trim()}
        style={{ width: px, height: px }}
      >
        <Image
          src={src}
          alt={`${agent.name} logo`}
          width={px}
          height={px}
          className="agent-logo__img"
          sizes={`${px}px`}
        />
      </span>
    );
  }

  return (
    <span
      className={`agent-logo agent-logo--fallback agent-logo--${size} ${className}`.trim()}
      style={{ width: px, height: px }}
      aria-hidden
    >
      {agent.shortLabel.slice(0, 2).toUpperCase()}
    </span>
  );
}
