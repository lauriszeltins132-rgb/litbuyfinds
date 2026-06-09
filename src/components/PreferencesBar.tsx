"use client";

import Select from "@/components/ui/Select";
import { usePreferences } from "@/context/PreferencesContext";
import type { CurrencyCode } from "@/lib/constants";

const currencies: CurrencyCode[] = ["USD", "EUR", "CNY"];

export default function PreferencesBar() {
  const { currency, agentId, setCurrency, setAgentId, agents } =
    usePreferences();

  return (
    <div className="border-b border-border bg-[#0a0a0d]/90 px-4 py-2.5 backdrop-blur sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">
          Shopping preferences
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <Select
            id="agent-select"
            value={agentId}
            onChange={(value) => setAgentId(value as typeof agentId)}
            options={agents.map((agent) => ({
              value: agent.id,
              label: agent.name,
            }))}
            size="sm"
          />

          <Select
            id="currency-select"
            value={currency}
            onChange={(value) => setCurrency(value as CurrencyCode)}
            options={currencies.map((code) => ({
              value: code,
              label: code,
            }))}
            size="sm"
          />
        </div>
      </div>
    </div>
  );
}
