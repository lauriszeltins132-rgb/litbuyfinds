import { getCatalogStats } from "@/lib/products";

const SIGNALS = [
  { key: "finds", label: "QC-curated finds" },
  { key: "qc", label: "with QC references" },
  { key: "updates", label: "Daily catalog sync" },
  { key: "community", label: "Active Discord & Telegram" },
  { key: "litbuy", label: "Verified LitBuy links" },
] as const;

type TrustStripProps = {
  compact?: boolean;
};

export default function TrustStrip({ compact = false }: TrustStripProps) {
  const stats = getCatalogStats();

  const values: Record<string, string> = {
    finds: `${stats.total.toLocaleString()}+`,
    qc: `${stats.withQc.toLocaleString()}+`,
    updates: "Daily",
    community: "Active",
    litbuy: "Verified",
  };

  return (
    <section className={`px-3 sm:px-6 ${compact ? "py-2 sm:py-4" : "py-8"}`}>
      <div className="mx-auto max-w-7xl">
        {!compact ? (
          <div className="mb-4 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
              Why trust LitBuy Finds
            </p>
            <h2 className="mt-2 text-xl font-black sm:text-2xl">
              Verified links, QC-approved products, daily updates
            </h2>
          </div>
        ) : null}
        <div className="grid grid-cols-2 gap-2 rounded-xl border border-border bg-surface/40 p-3 sm:grid-cols-3 sm:gap-3 sm:rounded-2xl sm:p-4 lg:grid-cols-5 lg:gap-4 lg:p-5">
          {SIGNALS.map((signal) => (
            <div key={signal.key} className="text-center">
              <p className="text-lg font-black text-accent sm:text-xl">
                {values[signal.key]}
              </p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-muted sm:text-[11px]">
                {signal.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
