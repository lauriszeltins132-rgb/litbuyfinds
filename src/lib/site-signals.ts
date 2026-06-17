import { getActualCatalogCount } from "./catalog-count";
import { formatDatasetAge, formatSyncedTimestamp, getDatasetSyncedIso } from "./catalog-meta";
import { getLatestProducts } from "./products";
import { getNewToday, getRecencyPool } from "./recency";

export type LiveSiteSignals = {
  totalIndexed: number;
  totalIndexedLabel: string;
  newTodayCount: number;
  updatedAgo: string;
  lastSyncLabel: string;
  lastSyncIso: string;
};

export function getLiveSiteSignals(): LiveSiteSignals {
  const totalIndexed = getActualCatalogCount();
  const latestSheet = getLatestProducts().length;
  const recencyPool = getRecencyPool().length;
  const newToday = getNewToday(200).length;
  const newTodayCount = Math.max(latestSheet, Math.min(newToday, recencyPool));

  return {
    totalIndexed,
    totalIndexedLabel: totalIndexed.toLocaleString(),
    newTodayCount,
    updatedAgo: formatDatasetAge(),
    lastSyncLabel: formatSyncedTimestamp(),
    lastSyncIso: getDatasetSyncedIso(),
  };
}
