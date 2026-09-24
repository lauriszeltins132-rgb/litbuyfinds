/**
 * Lightweight in-tab concurrency gate for product image network attaches.
 * Prevents request storms against slow hosts (esp. postimg) without packages.
 * Priority waiters jump the queue.
 *
 * Mobile uses a slightly higher concurrency so visible cards are less likely
 * to starve behind off-screen loads. Desktop stays at the proven limit.
 */

import { isMobileViewport } from "@/lib/is-mobile-viewport";

const DESKTOP_MAX_CONCURRENT = 4;
const MOBILE_MAX_CONCURRENT = 6;

type Waiter = {
  grant: () => void;
  cancelled: boolean;
};

let active = 0;
const normalWaiters: Waiter[] = [];
const priorityWaiters: Waiter[] = [];

function maxConcurrent(): number {
  return isMobileViewport() ? MOBILE_MAX_CONCURRENT : DESKTOP_MAX_CONCURRENT;
}

function pump(): void {
  const limit = maxConcurrent();
  while (active < limit) {
    let next: Waiter | undefined;
    while (priorityWaiters.length > 0) {
      const candidate = priorityWaiters.shift();
      if (candidate && !candidate.cancelled) {
        next = candidate;
        break;
      }
    }
    if (!next) {
      while (normalWaiters.length > 0) {
        const candidate = normalWaiters.shift();
        if (candidate && !candidate.cancelled) {
          next = candidate;
          break;
        }
      }
    }
    if (!next) return;
    active += 1;
    next.grant();
  }
}

export type ImageLoadSlotHandle = {
  /** Resolves with a release() once a concurrency slot is granted. */
  promise: Promise<() => void>;
  /** Remove this waiter if still queued; no-op after grant/release. */
  cancel: () => void;
};

/** Reserve a load slot before attaching <img src>. Always release in finally/unmount. */
export function acquireImageLoadSlot(priority = false): ImageLoadSlotHandle {
  let releaseFn: (() => void) | null = null;
  let settled = false;

  const waiter: Waiter = {
    cancelled: false,
    grant: () => {
      // grant body assigned below after Promise setup
    },
  };

  const promise = new Promise<() => void>((resolve) => {
    const grant = () => {
      if (waiter.cancelled || settled) {
        // Slot was reserved for a cancelled waiter — free it immediately.
        active = Math.max(0, active - 1);
        pump();
        return;
      }
      settled = true;
      let released = false;
      releaseFn = () => {
        if (released) return;
        released = true;
        active = Math.max(0, active - 1);
        pump();
      };
      resolve(releaseFn);
    };

    waiter.grant = grant;

    if (active < maxConcurrent()) {
      active += 1;
      grant();
      return;
    }

    if (priority) priorityWaiters.push(waiter);
    else normalWaiters.push(waiter);
  });

  const cancel = () => {
    if (waiter.cancelled) return;
    waiter.cancelled = true;
    // If already granted, free the slot so visible cards are never starved.
    if (releaseFn) {
      releaseFn();
      releaseFn = null;
    }
  };

  return { promise, cancel };
}

export function getImageLoadConcurrency(): number {
  return maxConcurrent();
}

export const IMAGE_LOAD_CONCURRENCY = DESKTOP_MAX_CONCURRENT;
export const IMAGE_LOAD_CONCURRENCY_MOBILE = MOBILE_MAX_CONCURRENT;
