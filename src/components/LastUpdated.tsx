import { formatContentDate } from "@/lib/content-dates";
import { getDatasetSyncedIso } from "@/lib/catalog-meta";

type LastUpdatedProps = {
  iso?: string;
  className?: string;
};

export default function LastUpdated({ iso, className = "" }: LastUpdatedProps) {
  const updatedIso = iso ?? getDatasetSyncedIso();

  return (
    <p className={`text-sm font-semibold text-muted ${className}`}>
      Last Updated:{" "}
      <time dateTime={updatedIso} className="text-foreground">
        {formatContentDate(updatedIso)}
      </time>
    </p>
  );
}
