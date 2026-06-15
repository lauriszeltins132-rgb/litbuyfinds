import { getHomepageRails } from "./homepage-rails";

/** Analytics-backed popular picks with daily rotation and deduplication. */
export function getPopularToday(limit = 12) {
  return getHomepageRails(limit).popularToday;
}

export function getMonthlyHighlights(limit = 96) {
  return getHomepageRails(Math.min(limit, 12)).popularMonth;
}
