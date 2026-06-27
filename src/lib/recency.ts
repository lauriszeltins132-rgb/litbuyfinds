import { getAllProducts, getLatestProducts, sortWithImagesFirst } from "./products";
import { getUtcDayIndex, rotateWindow } from "./rotation-seeds";
import type { Product } from "./types";

function byNewestId(a: Product, b: Product): number {
  return Number(b.id) - Number(a.id);
}

/** Newest items from the Latest Finds sheet, then high-ID catalog additions. */
export function getRecencyPool(): Product[] {
  const latest = [...getLatestProducts()].sort(byNewestId);
  const recentCatalog = getAllProducts()
    .filter(
      (product) =>
        product.group === "category" &&
        product.category_slug !== "latest-finds" &&
        Number(product.id) >= 2700
    )
    .sort(byNewestId);

  const seen = new Set<string>();
  const merged: Product[] = [];

  for (const product of [...latest, ...recentCatalog]) {
    if (seen.has(product.id)) continue;
    seen.add(product.id);
    merged.push(product);
  }

  return sortWithImagesFirst(merged);
}

function sliceRotating(pool: Product[], window: number, day: number): Product[] {
  return rotateWindow(pool, window, day, "recency-pool");
}

/** Rotates daily so the homepage always feels fresh. */
export function getNewToday(limit = 12): Product[] {
  const pool = getRecencyPool().filter((product) => product.image);
  return sliceRotating(pool, limit, getUtcDayIndex());
}

/** Latest arrivals from the past week window in the dataset. */
export function getNewThisWeek(limit = 36): Product[] {
  return getRecencyPool().slice(0, limit);
}

/** Full latest-finds sheet plus recent high-ID catalog items. */
export function getNewThisMonth(limit = 120): Product[] {
  return getRecencyPool().slice(0, limit);
}

export function getRecentlyAddedPreview(limit = 12): Product[] {
  return getNewToday(limit);
}

export function getRecencyCounts() {
  const pool = getRecencyPool();
  const withImages = pool.filter((product) => product.image);
  return {
    today: getNewToday(withImages.length).length,
    week: getNewThisWeek(pool.length).length,
    month: pool.length,
  };
}
