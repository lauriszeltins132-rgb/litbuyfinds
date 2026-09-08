"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { trackBrokenImage } from "@/lib/analytics-events";
import { logProductImageFailure } from "@/lib/image-load-debug";
import {
  hasPlausibleImageDimensions,
  validateImageUrl,
} from "@/lib/image-url";
import { IMAGE_LOAD_TIMEOUT_MS } from "@/lib/image-load-timeout";
import {
  abortImageElementLoad,
  filterFailedImageCandidates,
  isImageElementCached,
  isImageUrlCached,
  markImageUrlFailed,
  rememberLoadedImageUrl,
} from "@/lib/image-load-cache";
import {
  acquireImageLoadSlot,
  releaseImageLoadSlot,
} from "@/lib/image-load-queue";

type UseProductImageLoaderArgs = {
  src: string;
  preferredSrc?: string;
  fallbacks?: string[];
  priority?: boolean;
  analyticsContext: string;
};

type FailReason = "error" | "timeout" | "implausible" | "exhausted";

/** Prefetch only when close to the viewport — avoids loading several rows early. */
const VIEWPORT_ROOT_MARGIN = "160px 0px";

/** Soft retries of the same URL before advancing candidates. */
const MAX_SOFT_RETRIES = 2;

/** Backoff before remounting the same URL (ms × attempt). */
const RETRY_BACKOFF_MS = 280;

function buildCandidates(
  src: string,
  preferredSrc: string | undefined,
  fallbacks: string[]
): string[] {
  const validation = validateImageUrl(src);
  if (!validation.valid) return [];

  const ordered = [preferredSrc, validation.normalized, ...fallbacks].filter(
    (url): url is string => Boolean(url)
  );
  const seen = new Set<string>();
  const unique: string[] = [];
  for (const url of ordered) {
    if (seen.has(url)) continue;
    seen.add(url);
    unique.push(url);
  }
  return filterFailedImageCandidates(unique);
}

/**
 * Shared product-image loader: session cache, near-viewport fetch gating,
 * concurrency limiting, soft retries with backoff, hung-request abort, and
 * hydration-safe eager/lazy decisions.
 * Does not alter image URLs, dimensions, or visual presentation.
 */
export function useProductImageLoader({
  src,
  preferredSrc,
  fallbacks = [],
  priority = false,
  analyticsContext,
}: UseProductImageLoaderArgs) {
  const validation = useMemo(() => validateImageUrl(src), [src]);

  const candidates = useMemo(
    () => buildCandidates(src, preferredSrc, fallbacks),
    [src, preferredSrc, fallbacks]
  );
  const candidateKey = candidates.join("|");

  const [srcIndex, setSrcIndex] = useState(0);
  const [retryToken, setRetryToken] = useState(0);
  const [failed, setFailed] = useState(candidates.length === 0);
  const [loaded, setLoaded] = useState(false);
  /** Client-only: avoid SSR/client mismatch for cache-driven loading attrs. */
  const [cacheBoost, setCacheBoost] = useState(false);
  /**
   * Non-priority images wait until near the viewport before attaching src.
   * Priority / session-cached images fetch immediately.
   */
  const [nearViewport, setNearViewport] = useState(priority);
  /** Non-priority images also wait for a concurrency slot. */
  const [slotReady, setSlotReady] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);
  const loggedRef = useRef(false);
  const softRetryCountRef = useRef(0);
  const holdingSlotRef = useRef(false);
  const backoffActiveRef = useRef(false);
  const retryTimerRef = useRef<number | null>(null);

  const candidateSrc = candidates[srcIndex] ?? "";
  const wantsNetwork = priority || cacheBoost || nearViewport;
  const allowFetch = wantsNetwork && (priority || cacheBoost || slotReady);

  const releaseSlotIfHeld = useCallback(() => {
    if (!holdingSlotRef.current) return;
    holdingSlotRef.current = false;
    releaseImageLoadSlot();
  }, []);

  useEffect(() => {
    const firstSrc = candidates[0] ?? "";
    const cached = isImageUrlCached(firstSrc);
    setSrcIndex(0);
    setRetryToken(0);
    setFailed(candidates.length === 0);
    setLoaded(cached);
    setCacheBoost(cached);
    setNearViewport(priority || cached);
    setSlotReady(priority || cached);
    loggedRef.current = false;
    softRetryCountRef.current = 0;
    backoffActiveRef.current = false;
    if (retryTimerRef.current != null) {
      window.clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
    releaseSlotIfHeld();
  }, [candidateKey, candidates, priority, releaseSlotIfHeld]);

  useEffect(() => {
    if (priority || cacheBoost || nearViewport) return;

    const node = imgRef.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setNearViewport(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setNearViewport(true);
        observer.disconnect();
      },
      { rootMargin: VIEWPORT_ROOT_MARGIN, threshold: 0.01 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [cacheBoost, candidateKey, nearViewport, priority, retryToken, srcIndex]);

  useEffect(() => {
    if (priority || cacheBoost) {
      setSlotReady(true);
      return;
    }

    if (!nearViewport) {
      setSlotReady(false);
      releaseSlotIfHeld();
      return;
    }

    if (holdingSlotRef.current) {
      setSlotReady(true);
      return;
    }

    let cancelled = false;
    void acquireImageLoadSlot().then(() => {
      if (cancelled) {
        releaseImageLoadSlot();
        return;
      }
      holdingSlotRef.current = true;
      setSlotReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, [cacheBoost, nearViewport, priority, releaseSlotIfHeld, srcIndex]);

  useEffect(() => {
    if (loaded) releaseSlotIfHeld();
  }, [loaded, releaseSlotIfHeld]);

  useEffect(() => {
    return () => {
      if (retryTimerRef.current != null) {
        window.clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }
      releaseSlotIfHeld();
    };
  }, [releaseSlotIfHeld]);

  const failExhausted = useCallback(() => {
    if (candidateSrc) {
      markImageUrlFailed(candidateSrc);
      logProductImageFailure({
        url: candidateSrc,
        attempt: softRetryCountRef.current,
        reason: "exhausted",
      });
    }
    releaseSlotIfHeld();
    setFailed(true);
    setLoaded(false);
    if (!loggedRef.current) {
      loggedRef.current = true;
      trackBrokenImage(validation.normalized || src, analyticsContext);
    }
  }, [
    analyticsContext,
    candidateSrc,
    releaseSlotIfHeld,
    src,
    validation.normalized,
  ]);

  const softRetryOrAdvance = useCallback(
    (reason: FailReason = "error") => {
      if (backoffActiveRef.current) return;

      abortImageElementLoad(imgRef.current);

      if (candidateSrc) {
        logProductImageFailure({
          url: candidateSrc,
          attempt: softRetryCountRef.current + 1,
          reason,
        });
      }

      if (softRetryCountRef.current < MAX_SOFT_RETRIES) {
        softRetryCountRef.current += 1;
        setLoaded(false);
        backoffActiveRef.current = true;
        const delay = RETRY_BACKOFF_MS * softRetryCountRef.current;
        if (retryTimerRef.current != null) {
          window.clearTimeout(retryTimerRef.current);
        }
        retryTimerRef.current = window.setTimeout(() => {
          retryTimerRef.current = null;
          backoffActiveRef.current = false;
          setRetryToken((token) => token + 1);
        }, delay);
        return;
      }

      setSrcIndex((currentIndex) => {
        const nextIndex = currentIndex + 1;
        if (nextIndex < candidates.length) {
          if (candidateSrc) markImageUrlFailed(candidateSrc);
          const nextSrc = candidates[nextIndex] ?? "";
          softRetryCountRef.current = 0;
          backoffActiveRef.current = false;
          setRetryToken(0);
          setLoaded(isImageUrlCached(nextSrc));
          return nextIndex;
        }
        failExhausted();
        return currentIndex;
      });
    },
    [candidateSrc, candidates, failExhausted]
  );

  const confirmLoaded = useCallback(
    (img: HTMLImageElement, url: string) => {
      if (!hasPlausibleImageDimensions(img.naturalWidth, img.naturalHeight)) {
        softRetryOrAdvance("implausible");
        return;
      }
      rememberLoadedImageUrl(url);
      setLoaded(true);
      setCacheBoost(true);
      releaseSlotIfHeld();
    },
    [releaseSlotIfHeld, softRetryOrAdvance]
  );

  useLayoutEffect(() => {
    const img = imgRef.current;
    if (failed || !candidateSrc || !allowFetch) return;

    if (isImageUrlCached(candidateSrc)) {
      setLoaded(true);
      setCacheBoost(true);
      releaseSlotIfHeld();
      return;
    }

    if (img && isImageElementCached(img)) {
      confirmLoaded(img, candidateSrc);
    }
  }, [
    allowFetch,
    candidateSrc,
    confirmLoaded,
    failed,
    releaseSlotIfHeld,
    retryToken,
    srcIndex,
  ]);

  useEffect(() => {
    const img = imgRef.current;
    if (!img || failed || !candidateSrc || !allowFetch || loaded) return;

    const tryConfirm = () => {
      if (img.complete && img.naturalWidth > 0) {
        confirmLoaded(img, candidateSrc);
        return true;
      }
      return false;
    };

    if (tryConfirm()) return;

    let cancelled = false;
    void img
      .decode?.()
      .then(() => {
        if (!cancelled) tryConfirm();
      })
      .catch(() => {
        if (!cancelled && img.complete && img.naturalWidth > 0) {
          rememberLoadedImageUrl(candidateSrc);
          setLoaded(true);
          setCacheBoost(true);
          releaseSlotIfHeld();
        }
      });

    return () => {
      cancelled = true;
    };
  }, [
    allowFetch,
    candidateSrc,
    confirmLoaded,
    failed,
    loaded,
    releaseSlotIfHeld,
    retryToken,
    srcIndex,
  ]);

  useEffect(() => {
    if (!allowFetch || failed || !candidateSrc || loaded) return;
    if (backoffActiveRef.current) return;

    const timer = window.setTimeout(() => {
      softRetryOrAdvance("timeout");
    }, IMAGE_LOAD_TIMEOUT_MS);

    return () => window.clearTimeout(timer);
  }, [
    allowFetch,
    candidateSrc,
    failed,
    loaded,
    retryToken,
    softRetryOrAdvance,
    srcIndex,
  ]);

  const shouldLazyLoad = !priority && !cacheBoost && !loaded;
  const fetchPriority: "high" | "low" | "auto" = priority
    ? "high"
    : cacheBoost || loaded
      ? "auto"
      : "low";
  const decoding: "sync" | "async" = priority ? "sync" : "async";

  return {
    imgRef,
    /** Empty until near viewport + slot (unless priority/cached) — defers network. */
    displaySrc: allowFetch ? candidateSrc : "",
    failed: failed || !candidateSrc,
    loaded,
    imgKey: `${candidateSrc}::${retryToken}::${allowFetch ? "on" : "off"}`,
    shouldLazyLoad,
    fetchPriority,
    decoding,
    confirmLoaded,
    softRetryOrAdvance: () => softRetryOrAdvance("error"),
    validation,
  };
}
