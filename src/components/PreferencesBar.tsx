"use client";

import Select from "@/components/ui/Select";
import { usePreferences } from "@/context/PreferencesContext";
import type { CurrencyCode } from "@/lib/constants";

const currencies: CurrencyCode[] = ["USD", "EUR", "CNY"];

export default function PreferencesBar() {
  const { currency, setCurrency } = usePreferences();

  return (
    <div className="hidden border-b border-border bg-surface/90 px-4 py-2.5 backdrop-blur sm:block sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">
          Display currency
        </p>

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
  );
}
