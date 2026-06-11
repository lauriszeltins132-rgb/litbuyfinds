import {
  formatDatasetAge,
  formatSyncedTimestamp,
} from "@/lib/catalog-meta";

type DataFreshnessProps = {
  variant?: "inline" | "block";
  label?: string;
};

export default function DataFreshness({
  variant = "inline",
  label = "Dataset updated",
}: DataFreshnessProps) {
  const text = `${label} ${formatDatasetAge()} · Last sync ${formatSyncedTimestamp()}`;

  if (variant === "block") {
    return (
      <p className="text-xs leading-relaxed text-muted">{text}</p>
    );
  }

  return <span className="text-xs text-muted">{text}</span>;
}
