import { PUBLIC_CATALOG_COUNT } from "@/lib/constants";
import { TRUST_FOOTER_SIGNALS } from "@/lib/trust";

export default function FooterTrustBar() {
  const listingLabel = `${PUBLIC_CATALOG_COUNT} product listings`;

  const signals = TRUST_FOOTER_SIGNALS.map((signal) =>
    signal.includes("3,000+") ? listingLabel : signal
  );

  return (
    <div className="mt-10 rounded-2xl border border-border/80 bg-surface/25 px-4 py-4 sm:px-6">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted">
        Why shoppers trust LitBuy Finds
      </p>
      <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-foreground/80">
        {signals.map((signal) => (
          <li key={signal} className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
            {signal}
          </li>
        ))}
      </ul>
    </div>
  );
}
