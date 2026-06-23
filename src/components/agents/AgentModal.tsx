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
                  className={`agent-modal__option flex w-full flex-col items-start rounded-2xl border px-4 py-3 text-left transition-colors ${
                    selected
                      ? "border-accent/50 bg-accent/10"
                      : "border-border bg-surface/40 hover:border-accent/30 hover:bg-surface/70"
                  } ${agent.recommended ? "agent-modal__option--recommended" : ""}`}
                >
                  <div className="flex w-full items-center justify-between gap-2">
                    <span className="flex items-center gap-2">
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-black ${
                          agent.recommended
                            ? "bg-accent text-background"
                            : "bg-border text-foreground"
                        }`}
                        aria-hidden
                      >
                        {agent.shortLabel.slice(0, 2).toUpperCase()}
                      </span>
                      <span className="font-bold text-foreground">{agent.name}</span>
                    </span>
                    {agent.recommended ? (
                      <span className="rounded-full border border-accent/35 bg-accent/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent">
                        Recommended
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-muted">
                    {agent.description}
                  </p>
                  {product && !buyUrl ? (
                    <p className="mt-2 text-[11px] font-semibold text-amber-300/90">
                      Opens agent search for this item
                    </p>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>

        {product ? (
          <p className="mt-4 text-center text-xs text-muted">
            Selected:{" "}
            <span className="font-bold text-foreground">
              {getAgentById(agentId).name}
            </span>
          </p>
        ) : null}
      </div>
    </div>
  );
}
