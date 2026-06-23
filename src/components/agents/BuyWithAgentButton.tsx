"use client";

import type { AgentId } from "@/lib/agents";
import {
  buildAgentProductUrl,
  getAgentById,
} from "@/lib/agents";
import type { Product } from "@/lib/types";
import { usePreferences } from "@/context/PreferencesContext";
import { useAgentModal } from "@/context/AgentModalContext";
import { trackProductContext } from "@/lib/analytics-events";

type BuyLocation = "product_card" | "product_page" | "product_modal" | "daily_drop";

type BuyWithAgentButtonProps = {
  product: Product;
  location: BuyLocation;
  /** Open agent picker before redirect (catalog cards) */
  showAgentPicker?: boolean;
  className?: string;
  compact?: boolean;
  appearance?: "primary" | "secondary";
};

export default function BuyWithAgentButton({
  product,
  location,
  showAgentPicker = false,
  className = "",
  compact = false,
  appearance = "primary",
}: BuyWithAgentButtonProps) {
  const { agentId } = usePreferences();
  const { openAgentModal } = useAgentModal();
  const agent = getAgentById(agentId);
  const buyUrl = buildAgentProductUrl(product, agentId);

  const label = agent.recommended
    ? compact
      ? "Buy"
      : `Buy with ${agent.name}`
    : `Buy with ${agent.name}`;

  const baseClass = compact
    ? "rounded-full bg-accent px-3 py-1.5 text-[11px] font-black text-background"
    : appearance === "secondary"
      ? "inline-flex items-center justify-center rounded-full border border-border px-6 py-3 text-sm font-bold text-foreground hover:border-accent/40"
      : "inline-flex items-center justify-center rounded-full bg-accent px-8 py-3.5 text-sm font-black text-background hover:bg-accent-hover";

  if (!product.affiliate_link && !buyUrl) {
    return null;
  }

  function handleBuyClick(event: React.MouseEvent) {
    if (showAgentPicker) {
      event.preventDefault();
      openAgentModal({
        product,
        redirectOnSelect: true,
        title: "Choose your preferred agent",
      });
      return;
    }

    trackProductContext("buy_click", product, location);
  }

  if (showAgentPicker) {
    return (
      <button
        type="button"
        onClick={handleBuyClick}
        className={`${baseClass} ${className}`}
      >
        {compact ? "Buy" : label}
      </button>
    );
  }

  if (!buyUrl) {
    return (
      <button
        type="button"
        onClick={() =>
          openAgentModal({
            product,
            redirectOnSelect: true,
          })
        }
        className={`${baseClass} ${className}`}
      >
        {label}
      </button>
    );
  }

  return (
    <a
      href={buyUrl}
      target="_blank"
      rel="noopener noreferrer sponsored"
      onClick={handleBuyClick}
      className={`${baseClass} ${className}`}
    >
      {label}
    </a>
  );
}

export function BuyingAgentPanel({
  product,
  className = "",
}: {
  product: Product;
  className?: string;
}) {
  const { agentId } = usePreferences();
  const { openAgentModal } = useAgentModal();
  const agent = getAgentById(agentId);

  return (
    <div
      className={`rounded-2xl border border-border bg-surface/40 px-4 py-3 ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">
            Buying agent
          </p>
          <p className="mt-1 text-sm font-bold text-foreground">
            {agent.name}
            {agent.recommended ? (
              <span className="ml-2 rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent">
                Recommended
              </span>
            ) : null}
          </p>
          <p className="mt-1 text-xs text-muted">
            LitBuy recommended — or choose OopBuy, Kakobuy, HipoBuy, ACBuy, or
            MuleBuy.
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            openAgentModal({
              product,
              redirectOnSelect: false,
              title: "Change your preferred agent",
            })
          }
          className="rounded-full border border-border px-3 py-1.5 text-xs font-bold text-foreground hover:border-accent/40 hover:text-accent"
        >
          Change
        </button>
      </div>
    </div>
  );
}

export function getBuyButtonLabel(agentId: AgentId): string {
  const agent = getAgentById(agentId);
  return `Buy with ${agent.name}`;
}
