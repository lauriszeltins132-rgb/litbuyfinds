import { getDatasetSyncedIso } from "./catalog-meta";

/** When the guides program launched on LitBuy Finds */
export const GUIDES_PUBLISHED_ISO = "2026-06-01T00:00:00.000Z";

export type ContentDates = {
  publishedIso: string;
  updatedIso: string;
};

export function getGuideContentDates(slug?: string): ContentDates {
  const updatedIso = getDatasetSyncedIso();
  const publishedIso = GUIDE_PUBLISH_OVERRIDES[slug ?? ""] ?? GUIDES_PUBLISHED_ISO;
  return { publishedIso, updatedIso };
}

export function formatContentMonthYear(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function formatContentDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Earlier publish dates for original core guides */
const GUIDE_PUBLISH_OVERRIDES: Record<string, string> = {
  "what-is-a-shopping-agent": "2026-05-15T00:00:00.000Z",
  "how-litbuy-works": "2026-05-15T00:00:00.000Z",
  "beginner-guide-to-litbuy": "2026-05-15T00:00:00.000Z",
  "how-to-check-qc-photos": "2026-05-20T00:00:00.000Z",
  "litbuy-spreadsheet-guide": "2026-05-20T00:00:00.000Z",
};
