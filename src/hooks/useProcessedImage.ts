"use client";

import { useEffect, useMemo, useState } from "react";
import { probeImageLoad, removeWhiteBackground } from "@/lib/image-processing";
import { validateImageUrl } from "@/lib/image-url";

export type ProcessedImageState = "idle" | "loading" | "ready" | "failed";

export function useProcessedImage(rawSrc: string) {
  const validation = useMemo(() => validateImageUrl(rawSrc), [rawSrc]);
  const [displaySrc, setDisplaySrc] = useState("");
  const [processedToPng, setProcessedToPng] = useState(false);
  const [state, setState] = useState<ProcessedImageState>(() =>
    validation.valid ? "loading" : "failed"
  );

  useEffect(() => {
    if (!validation.valid) {
      setDisplaySrc("");
      setProcessedToPng(false);
      setState("failed");
      return;
    }

    let cancelled = false;
    setDisplaySrc("");
    setProcessedToPng(false);
    setState("loading");

    removeWhiteBackground(validation.normalized)
      .then((processed) => {
        if (cancelled) return;
        const isPng = processed.startsWith("data:");
        setDisplaySrc(processed);
        setProcessedToPng(isPng);
        setState("ready");
      })
      .catch(() => {
        void probeImageLoad(validation.normalized).then((ok) => {
          if (cancelled) return;
          if (ok) {
            setDisplaySrc(validation.normalized);
            setProcessedToPng(false);
            setState("ready");
            return;
          }
          setDisplaySrc("");
          setProcessedToPng(false);
          setState("failed");
        });
      });

    return () => {
      cancelled = true;
    };
  }, [validation.normalized, validation.valid]);

  return {
    displaySrc,
    state,
    normalizedSrc: validation.normalized,
    processedToPng,
    /** Raw JPEG/PNG URLs that still carry a white matte need dark-card blending. */
    needsDarkMatte: state === "ready" && !processedToPng,
    failed: state === "failed",
    loading: state === "loading",
    ready: state === "ready",
  };
}
