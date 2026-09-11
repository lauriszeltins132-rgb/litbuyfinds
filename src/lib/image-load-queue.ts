/**
 * Lightweight in-tab concurrency gate for product image network attaches.
 * Prevents request storms against slow hosts (esp. postimg) without packages.
 * Priority waiters jump the queue.
 */

const MAX_CONCURRENT_IMAGE_LOADS = 4;

let active = 0;
const normalWaiters: Array<() => void> = [];
const priorityWaiters: Array<() => void> = [];

function pump(): void {
  while (active < MAX_CONCURRENT_IMAGE_LOADS) {
    const next = priorityWaiters.shift() ?? normalWaiters.shift();
    if (!next) return;
    active += 1;
    next();
  }
}

/** Reserve a load slot before attaching <img src>. Always release in finally/unmount. */
export function acquireImageLoadSlot(priority = false): Promise<() => void> {
  return new Promise((resolve) => {
    const grant = () => {
      let released = false;
      resolve(() => {
        if (released) return;
        released = true;
        active = Math.max(0, active - 1);
        pump();
      });
    };

    if (active < MAX_CONCURRENT_IMAGE_LOADS) {
      active += 1;
      grant();
      return;
    }

    if (priority) priorityWaiters.push(grant);
    else normalWaiters.push(grant);
  });
}

export const IMAGE_LOAD_CONCURRENCY = MAX_CONCURRENT_IMAGE_LOADS;
