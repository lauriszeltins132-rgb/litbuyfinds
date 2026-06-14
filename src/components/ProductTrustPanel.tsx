import Link from "next/link";
import type { ProductFacts } from "@/lib/product-details";
import { formatSyncedTimestamp } from "@/lib/catalog-meta";

type ProductTrustPanelProps = {
  facts: ProductFacts;
};

export default function ProductTrustPanel({ facts }: ProductTrustPanelProps) {
  return (
    <div className="rounded-2xl border border-border bg-surface/35 p-4 sm:p-5">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">
        Listing details
      </p>

      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <dt className="text-[11px] font-bold uppercase tracking-wider text-muted">
            Catalog images
          </dt>
          <dd className="mt-1 text-sm font-semibold text-foreground">
            {facts.imageCount} photo{facts.imageCount === 1 ? "" : "s"}
          </dd>
        </div>
        <div>
          <dt className="text-[11px] font-bold uppercase tracking-wider text-muted">
            QC status
          </dt>
          <dd className="mt-1 text-sm font-semibold text-foreground">
            {facts.qcStatus === "available" ? (
              <span className="text-accent">Available</span>
            ) : (
              <span className="text-muted">Not linked</span>
            )}
          </dd>
        </div>
        <div>
          <dt className="text-[11px] font-bold uppercase tracking-wider text-muted">
            Last synced
          </dt>
          <dd className="mt-1 text-sm font-semibold text-foreground">
            {formatSyncedTimestamp(new Date(facts.catalogSyncedIso))}
          </dd>
        </div>
        <div>
          <dt className="text-[11px] font-bold uppercase tracking-wider text-muted">
            Source
          </dt>
          <dd className="mt-1 text-sm font-semibold text-foreground">
            {facts.source} via LitBuy
          </dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-[11px] font-bold uppercase tracking-wider text-muted">
            Category path
          </dt>
          <dd className="mt-1 flex flex-wrap items-center gap-1.5 text-sm">
            {facts.categoryPath.map((crumb, index) => (
              <span key={`${crumb.label}-${index}`} className="flex items-center gap-1.5">
                {index > 0 ? <span className="text-muted/50">/</span> : null}
                {crumb.href && index < facts.categoryPath.length - 1 ? (
                  <Link
                    href={crumb.href}
                    className="font-semibold text-foreground hover:text-accent"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="font-semibold text-muted">{crumb.label}</span>
                )}
              </span>
            ))}
          </dd>
        </div>
        {!facts.titleTrusted ? (
          <div className="sm:col-span-2">
            <dt className="text-[11px] font-bold uppercase tracking-wider text-muted">
              Title check
            </dt>
            <dd className="mt-1 text-xs leading-relaxed text-muted">
              Display name simplified for accuracy ({Math.round(facts.titleConfidence * 100)}%
              confidence). Verify photos before buying.
            </dd>
          </div>
        ) : null}
      </dl>
    </div>
  );
}
