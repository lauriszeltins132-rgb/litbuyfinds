"use client";

import { useEffect } from "react";
import type { AgentId } from "@/lib/agents";
import {
  BUYING_AGENTS,
  buildAgentProductUrl,
  getAgentById,
} from "@/lib/agents";
import type { Product } from "@/lib/types";
import { usePreferences } from "@/context/PreferencesContext";
import { trackProductContext } from "@/lib/analytics-events";
import AgentLogo from "./AgentLogo";

type AgentModalProps = {
  open: boolean;
  onClose: () => void;
  product?: Product;
  redirectOnSelect?: boolean;
  title?: string;
};

export default function AgentModal({
  open,
  onClose,
  product,
  redirectOnSelect = false,
  title = "Choose your preferred agent",
}: AgentModalProps) {
  const { agentId, setAgentId } = usePreferences();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  function handleSelect(nextAgentId: AgentId) {
    setAgentId(nextAgentId);

    if (product) {
      trackProductContext("buy_click", product, "agent_modal");
      const url = buildAgentProductUrl(product, nextAgentId);
      if (redirectOnSelect && url) {
        window.open(url, "_blank", "noopener,noreferrer");
      }
    }

    onClose();
  }

  return (
    <div className="fixed inset-0 z-[160] flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        aria-label="Close agent selector"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="agent-modal-title"
        className="agent-modal relative z-10 w-full max-w-lg rounded-t-3xl border border-border bg-panel p-5 shadow-2xl sm:rounded-3xl sm:p-6"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">
              Preferred agent
            </p>
            <h2 id="agent-modal-title" className="mt-1 text-xl font-black">
              {title}
            </h2>
            <p className="mt-2 text-sm text-muted">
              LitBuy is our recommended agent. You can switch anytime — your
              choice is saved while you browse.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-muted hover:border-accent/40 hover:text-accent"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <ul className="grid gap-2 sm:grid-cols-2">
          {BUYING_AGENTS.map((agent) => {
            const selected = agentId === agent.id;
            const buyUrl = product ? buildAgentProductUrl(product, agent.id) : null;

            return (
              <li key={agent.id}>
                <button
                  type="button"
                  onClick={() => handleSelect(agent.id)}
                  className={`agent-selector-card w-full ${
                    selected ? "agent-selector-card--selected" : ""
                  } ${agent.recommended ? "agent-modal__option--recommended" : ""}`}
                >
                  <AgentLogo agentId={agent.id} size="md" />
                  <span className="agent-selector-card__body">
                    <span className="agent-selector-card__name">{agent.name}</span>
                    {agent.recommended ? (
                      <span className="agent-selector-card__badge">
                        ⭐ Recommended
                      </span>
                    ) : null}
                    <span className="mt-1 text-xs leading-relaxed text-muted">
                      {agent.description}
                    </span>
                  </span>
                  {product && !buyUrl ? (
                    <span className="text-[11px] font-semibold text-amber-300/90">
                      Search on agent
                    </span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>

        {product ? (
          <p className="mt-4 text-center text-xs text-muted">
            Selected:{" "}
            <span className="inline-flex items-center gap-1.5 font-bold text-foreground">
              <AgentLogo agentId={agentId} size="xs" />
              {getAgentById(agentId).name}
            </span>
          </p>
        ) : null}
      </div>
    </div>
  );
}
