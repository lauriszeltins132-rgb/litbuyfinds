import fs from "fs";
import path from "path";

const DATASET_PATH = path.join(process.cwd(), "src/data/products.json");

function getDatasetMtime(): Date {
  try {
    const stat = fs.statSync(DATASET_PATH);
    return stat.mtime;
  } catch {
    return new Date();
  }
}

const DATASET_SYNCED_AT = getDatasetMtime();

export function getDatasetSyncedAt(): Date {
  return DATASET_SYNCED_AT;
}

export function getDatasetSyncedIso(): string {
  return DATASET_SYNCED_AT.toISOString();
}

export function getDatasetAgeHours(): number {
  const ms = Date.now() - DATASET_SYNCED_AT.getTime();
  return Math.max(0, Math.floor(ms / 3_600_000));
}

export function formatDatasetAge(): string {
  const hours = getDatasetAgeHours();
  if (hours < 1) return "less than 1 hour ago";
  if (hours === 1) return "1 hour ago";
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  return days === 1 ? "1 day ago" : `${days} days ago`;
}

export function formatSyncedTimestamp(date = DATASET_SYNCED_AT): string {
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
    timeZoneName: "short",
  });
}
