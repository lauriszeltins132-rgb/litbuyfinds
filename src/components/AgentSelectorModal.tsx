"use client";

import { useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import {
  AGENT_CONFIG,
  DEFAULT_AGENT_ID,
  getAgentById,
  getAgentDestination,
  getMarketplaceSource,
  getOriginalSourceUrl,
} from "@/lib/agents";
import { getDisplayProductName } from "@/lib/product-validation";

type AgentSelectorModalProps = {
  product: Product;
  open: boolean;
  onClose: () => void;
  onContinue?: (agentId: string) => void;
};

export default function AgentSelectorModal({
  product,
  open,
  onClose,
  onContinue,
}: AgentSelectorModalProps) {
  const [selectedAgentId, setSelectedAgentId] = useState(DEFAULT_AGENT_ID);
  const [copied, setCopied] = useState(false);
  const sourceUrl = useMemo(() => getOriginalSourceUrl(product), [product]);
  const source = getMarketplaceSource(sourceUrl);
  const selectedAgent = getAgentById(selectedAgentId);

  useEffect(() => {
    if (!open) return;
    setSelectedAgentId(DEFAULT_AGENT_ID);
    setCopied(false);

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

  async function copySourceUrl() {
    try {
      await navigator.clipboard.writeText(sourceUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  async function continueWithAgent() {
    if (!selectedAgent.directLink) {
      await copySourceUrl();
    }

    onContinue?.(selectedAgent.id);
    window.open(
      getAgentDestination(product, selectedAgent.id),
      "_blank",
      "noopener,noreferrer"
    );
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[220] flex items-end justify-center p-3 sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Close agent selector"
        className="absolute inset-0 bg-black/82 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="modal-enter panel-shell relative w-full max-w-lg overflow-hidden rounded-3xl border border-border/80 bg-surface p-5 shadow-2xl sm:p-6">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-border/80 bg-background/80 text-sm text-muted hover:text-foreground"
        >
          x
        </button>

        <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">
          Choose your Agent
        </p>
        <h2 className="mt-2 pr-8 text-2xl font-black text-foreground">
          Buy this find through your preferred agent
        </h2>
        <p className="mt-2 line-clamp-2 text-sm text-muted">
          {getDisplayProductName(product)}
        </p>

        <div className="mt-5 rounded-2xl border border-border bg-background/45 p-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
            Original source
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-xs font-bold uppercase text-accent">
              {source}
            </span>
            <button
              type="button"
              onClick={copySourceUrl}
              className="rounded-full border border-border px-3 py-1 text-xs font-bold text-foreground hover:border-accent/40 hover:text-accent"
            >
              {copied ? "Source copied" : "Copy source URL"}
            </button>
          </div>
          <p className="mt-2 truncate text-xs text-muted">{sourceUrl}</p>
        </div>

        <div className="mt-5 grid gap-2">
          {AGENT_CONFIG.map((agent) => {
            const active = agent.id === selectedAgentId;
            return (
              <button
                key={agent.id}
                type="button"
                onClick={() => setSelectedAgentId(agent.id)}
                className={`flex items-start gap-3 rounded-2xl border p-3 text-left transition ${
                  active
                    ? "border-accent bg-accent/10"
                    : "border-border bg-panel hover:border-accent/35"
                }`}
              >
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[11px] font-black ${
                    active
                      ? "border-accent bg-accent text-background"
                      : "border-border text-muted"
                  }`}
                >
                  {active ? "✓" : ""}
                </span>
                <span>
                  <span className="block text-sm font-black text-foreground">
                    {agent.name}
                    {agent.id === DEFAULT_AGENT_ID ? " (default)" : ""}
                  </span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-muted">
                    {agent.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={continueWithAgent}
            className="inline-flex flex-1 items-center justify-center rounded-full bg-accent px-5 py-3 text-sm font-black text-background hover:bg-accent-hover"
          >
            Continue with {selectedAgent.name}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-full border border-border px-5 py-3 text-sm font-bold text-foreground hover:border-accent/40"
          >
            Keep browsing
          </button>
        </div>

        {!selectedAgent.directLink ? (
          <p className="mt-3 text-xs leading-relaxed text-muted">
            We copied the original marketplace URL so you can paste it into{" "}
            {selectedAgent.name}. LitBuyFinds keeps discovery separate from the
            agent you choose.
          </p>
        ) : null}
      </div>
    </div>
  );
}
