import type { ProductFacts } from "@/lib/product-details";

type ProductPurchaseSignalsProps = {
  facts: ProductFacts;
  source: string;
};

export default function ProductPurchaseSignals({
  facts,
  source,
}: ProductPurchaseSignalsProps) {
  return (
    <ul className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-4 sm:gap-y-2">
      <li className="flex items-center gap-2 text-sm text-foreground">
        <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-[10px] font-bold text-accent">
          ✓
        </span>
        <span>
          {facts.qcStatus === "available" ? (
            <strong className="font-semibold text-accent">QC photos available</strong>
          ) : (
            <span className="text-muted">Request QC after purchase</span>
          )}
        </span>
      </li>
      <li className="flex items-center gap-2 text-sm text-foreground">
        <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-[10px] font-bold text-accent">
          ✓
        </span>
        <span>
          Found on <strong className="font-semibold">LitBuy</strong> · {source}
        </span>
      </li>
      <li className="flex items-center gap-2 text-sm text-foreground">
        <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-[10px] font-bold text-accent">
          ✓
        </span>
        <span>Choose your preferred agent</span>
      </li>
    </ul>
  );
}
