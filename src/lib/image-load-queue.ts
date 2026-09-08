/**
 * Lightweight in-memory gate so catalog grids do not open dozens of
 * remote image connections at once (postimg / alicdn / geilicdn).
 * Priority and already-cached images bypass this queue.
 */

const MAX_CONCURRENT_IMAGE_LOADS = 6;

let active = 0;
const waiters: Array<() => void> = [];

export function acquireImageLoadSlot(): Promise<void> {
  if (active < MAX_CONCURRENT_IMAGE_LOADS) {
    active += 1;
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    waiters.push(() => {
      active += 1;
      resolve();
    });
  });
}

export function releaseImageLoadSlot(): void {
  active = Math.max(0, active - 1);
  const next = waiters.shift();
  if (next) next();
}

/** Test/debug helper — not used in production UI. */
export function getImageLoadQueueStats() {
  return { active, waiting: waiters.length, max: MAX_CONCURRENT_IMAGE_LOADS };
}
