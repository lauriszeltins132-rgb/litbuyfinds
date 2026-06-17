import { getLiveSiteSignals } from "@/lib/site-signals";

export default function LiveSiteSignals() {
  const signals = getLiveSiteSignals();

  return (
    <div className="mt-4 flex flex-col items-center gap-2 sm:mt-5">
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-[11px] font-semibold sm:text-xs">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/25 bg-accent/8 px-2.5 py-1 text-accent">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
          Updated {signals.updatedAgo}
        </span>
        {signals.newTodayCount > 0 ? (
          <span className="text-muted">
            {signals.newTodayCount.toLocaleString()} new finds added today
          </span>
        ) : null}
        <span className="text-muted">
          {signals.totalIndexedLabel} finds indexed
        </span>
      </div>
      <p className="text-[10px] text-muted/80 sm:text-[11px]">
        Latest sync: {signals.lastSyncLabel}
      </p>
    </div>
  );
}
