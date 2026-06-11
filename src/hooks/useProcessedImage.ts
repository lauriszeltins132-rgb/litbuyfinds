"use client";

import { useEffect, useMemo, useState } from "react";
import { probeImageLoad, processProductImage } from "@/lib/image-processing";
import { validateImageUrl } from "@/lib/image-url";

export type ProcessedImageState = "idle" | "loading" | "ready" | "failed";

export function useProcessedImage(rawSrc: string) {
  const validation = useMemo(() => validateImageUrl(rawSrc), [rawSrc]);
  const [displaySrc, setDisplaySrc] = useState("");
  const [processedToPng, setProcessedToPng] = useState(false);
  const [hasBrightBackground, setHasBrightBackground] = useState(false);
  const [state, setState] = useState<ProcessedImageState>(() =>
    validation.valid ? "loading" : "failed"
  );

  useEffect(() => {
    if (!validation.valid) {
      setDisplaySrc("");
      setProcessedToPng(false);
      setHasBrightBackground(false);
      setState("failed");
      return;
    }

    let cancelled = false;
    setDisplaySrc("");
    setProcessedToPng(false);
    setHasBrightBackground(false);
    setState("loading");

    processProductImage(validation.normalized)
      .then((processed) => {
        if (cancelled) return;
        setDisplaySrc(processed.src);
        setProcessedToPng(processed.processedToPng);
        setHasBrightBackground(processed.hasBrightBackground);
        setState("ready");
      })
      .catch(() => {
        void probeImageLoad(validation.normalized).then((ok) => {
          if (cancelled) return;
          if (ok) {
            setDisplaySrc(validation.normalized);
            setProcessedToPng(false);
            setHasBrightBackground(false);
            setState("ready");
            return;
          }
          setDisplaySrc("");
          setProcessedToPng(false);
          setHasBrightBackground(false);
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
    hasBrightBackground,
    /** Only bright-background images that could not be processed to PNG. */
    needsDarkMatte:
      state === "ready" && hasBrightBackground && !processedToPng,
    failed: state === "failed",
    loading: state === "loading",
    ready: state === "ready",
  };
}
