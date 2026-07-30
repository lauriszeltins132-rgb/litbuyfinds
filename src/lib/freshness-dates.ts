import { getDatasetSyncedIso } from "./catalog-meta";
import { formatContentDate } from "./content-dates";
import type {
  SeoLandingPageEntry,
  SeoLandingUpdateFrequency,
} from "./seo-landing-config";

export type ContentFreshnessVariant =
  | "updated-daily"
  | "updated-weekly"
  | "latest-updated"
  | "weekly-added"
  | "catalog-sync";

export type FreshnessDisplayKind = "dailyFinds" | "weeklyFinds" | "latestFinds";

const DATE_FORMAT: Intl.DateTimeFormatOptions = {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
};

export function formatFreshnessDate(date: Date): string {
  return date.toLocaleDateString("en-US", DATE_FORMAT);
}

/** UTC midnight for the given instant. */
export function getUtcDayStart(now = new Date()): Date {
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );
}

/** Monday-based week start in UTC. */
export function getUtcWeekStart(now = new Date()): Date {
  const dayStart = getUtcDayStart(now);
  const weekday = dayStart.getUTCDay();
  const daysFromMonday = weekday === 0 ? 6 : weekday - 1;
  dayStart.setUTCDate(dayStart.getUTCDate() - daysFromMonday);
  return dayStart;
}

export function getDailyFindsTitle(now = new Date()): string {
  return `Daily Finds - ${formatFreshnessDate(now)}`;
}

export function getWeeklyFindsTitle(now = new Date()): string {
  return `Weekly Finds - Week of ${formatFreshnessDate(getUtcWeekStart(now))}`;
}

export function getLatestFindsUpdatedLabel(now = new Date()): string {
  return `Latest finds updated ${formatFreshnessDate(now)}`;
}

export function getWeeklyAddedLabel(now = new Date()): string {
  return `New products added this week`;
}

export type FreshnessSchemaDates = {
  datePublished: string;
  dateModified: string;
};

function laterIso(a: string, b: string): string {
  return a > b ? a : b;
}

export function getDailyFreshnessSchemaDates(
  now = new Date()
): FreshnessSchemaDates {
  const datePublished = getUtcDayStart(now).toISOString();
  const dateModified = laterIso(getDatasetSyncedIso(), now.toISOString());
  return { datePublished, dateModified };
}

export function getWeeklyFreshnessSchemaDates(
  now = new Date()
): FreshnessSchemaDates {
  const datePublished = getUtcWeekStart(now).toISOString();
  const dateModified = laterIso(getDatasetSyncedIso(), now.toISOString());
  return { datePublished, dateModified };
}

export function getCatalogFreshnessSchemaDates(): FreshnessSchemaDates {
  const syncIso = getDatasetSyncedIso();
  return { datePublished: syncIso, dateModified: syncIso };
}

export function getFreshnessSchemaDates(
  frequency: SeoLandingUpdateFrequency,
  display?: FreshnessDisplayKind,
  now = new Date()
): FreshnessSchemaDates | undefined {
  if (display === "dailyFinds" || frequency === "daily") {
    return getDailyFreshnessSchemaDates(now);
  }
  if (display === "weeklyFinds" || frequency === "weekly") {
    return getWeeklyFreshnessSchemaDates(now);
  }
  if (display === "latestFinds") {
    return getDailyFreshnessSchemaDates(now);
  }
  if (frequency === "monthly") {
    return getCatalogFreshnessSchemaDates();
  }
  return undefined;
}

export function resolveFreshnessH1(
  entry: SeoLandingPageEntry,
  now = new Date()
): string {
  switch (entry.freshnessDisplay) {
    case "dailyFinds":
      return getDailyFindsTitle(now);
    case "weeklyFinds":
      return getWeeklyFindsTitle(now);
    default:
      return entry.h1;
  }
}

export function resolveFreshnessPageTitle(
  entry: SeoLandingPageEntry,
  now = new Date()
): string {
  switch (entry.freshnessDisplay) {
    case "dailyFinds":
      return `${getDailyFindsTitle(now)} | LitBuy Finds`;
    case "weeklyFinds":
      return `${getWeeklyFindsTitle(now)} | LitBuy Finds`;
    case "latestFinds":
      return `Latest Rep Finds - ${formatFreshnessDate(now)} | LitBuy Finds`;
    default:
      return entry.title;
  }
}

export function resolveFreshnessDescription(
  entry: SeoLandingPageEntry,
  now = new Date()
): string {
  switch (entry.freshnessDisplay) {
    case "dailyFinds":
      return `Daily finds for ${formatFreshnessDate(now)} — trending sneakers, jackets, and streetwear with QC photos and verified agent links on LitBuy Finds.`;
    case "weeklyFinds":
      return `Weekly finds for the week of ${formatContentDate(getUtcWeekStart(now).toISOString())} — trending rep picks updated weekly on LitBuy Finds.`;
    case "latestFinds":
      return `Latest rep finds updated ${formatFreshnessDate(now)} — new sneakers, clothing, and accessories with QC photos and agent links on LitBuy Finds.`;
    default:
      return entry.description;
  }
}
