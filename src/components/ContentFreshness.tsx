import {
  formatDatasetAge,
  formatSyncedTimestamp,
  getDatasetSyncedIso,
} from "@/lib/catalog-meta";
import {
  formatFreshnessDate,
  getLatestFindsUpdatedLabel,
  getWeeklyAddedLabel,
  type ContentFreshnessVariant,
} from "@/lib/freshness-dates";

export type { ContentFreshnessVariant };

type ContentFreshnessProps = {
  variant: ContentFreshnessVariant;
  display?: "inline" | "badge" | "block";
  className?: string;
};

function getFreshnessText(variant: ContentFreshnessVariant, now = new Date()): string {
  switch (variant) {
    case "updated-daily":
      return "Updated daily";
    case "updated-weekly":
      return "Updated weekly";
    case "latest-updated":
      return getLatestFindsUpdatedLabel(now);
    case "weekly-added":
      return getWeeklyAddedLabel(now);
    case "catalog-sync":
      return `Catalog synced ${formatDatasetAge()} · Last sync ${formatSyncedTimestamp()}`;
  }
}

function getDateTimeAttr(variant: ContentFreshnessVariant): string | undefined {
  const now = new Date();
  switch (variant) {
    case "updated-daily":
      return now.toISOString().slice(0, 10);
    case "updated-weekly":
      return now.toISOString();
    case "latest-updated":
      return getDatasetSyncedIso();
    case "weekly-added":
      return now.toISOString();
    case "catalog-sync":
      return getDatasetSyncedIso();
  }
}

export default function ContentFreshness({
  variant,
  display = "inline",
  className = "",
}: ContentFreshnessProps) {
  const text = getFreshnessText(variant);
  const dateTime = getDateTimeAttr(variant);

  if (display === "badge") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border border-accent/25 bg-accent/8 px-2.5 py-1 text-xs font-semibold text-accent ${className}`}
      >
        <time dateTime={dateTime}>{text}</time>
      </span>
    );
  }

  if (display === "block") {
    return (
      <p className={`text-xs leading-relaxed text-muted ${className}`}>
        <time dateTime={dateTime}>{text}</time>
      </p>
    );
  }

  return (
    <span className={`text-xs text-muted ${className}`}>
      <time dateTime={dateTime}>{text}</time>
    </span>
  );
}

export function getUpdateFrequencyFreshnessVariant(
  frequency: "daily" | "weekly" | "monthly" | "static" | undefined
): ContentFreshnessVariant | undefined {
  switch (frequency) {
    case "daily":
      return "updated-daily";
    case "weekly":
      return "updated-weekly";
    default:
      return undefined;
  }
}
