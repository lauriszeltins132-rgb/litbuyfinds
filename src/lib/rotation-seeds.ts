/** UTC period indices — stable for the full calendar period worldwide. */

export function getUtcDayIndex(): number {
  return Math.floor(Date.now() / 86_400_000);
}

export function getUtcWeekIndex(): number {
  return Math.floor(Date.now() / (7 * 86_400_000));
}

export function getUtcMonthIndex(): number {
  const now = new Date();
  return now.getUTCFullYear() * 12 + now.getUTCMonth();
}

export function hashSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Deterministic order that changes when `periodSeed` or `salt` changes. */
export function seededShuffle<T>(
  items: T[],
  periodSeed: number,
  salt: string,
  keyFn: (item: T) => string
): T[] {
  return [...items].sort((a, b) => {
    const ha = hashSeed(`${salt}:${periodSeed}:${keyFn(a)}`);
    const hb = hashSeed(`${salt}:${periodSeed}:${keyFn(b)}`);
    return ha - hb;
  });
}

/** Slide a quality-sorted window across a pool — stable within the period. */
export function rotateWindow<T>(
  pool: T[],
  limit: number,
  periodSeed: number,
  salt: string
): T[] {
  if (pool.length === 0) return [];
  if (pool.length <= limit) return pool.slice(0, limit);

  const span = pool.length - limit + 1;
  const offset = hashSeed(`${salt}:offset:${periodSeed}`) % span;
  return pool.slice(offset, offset + limit);
}
