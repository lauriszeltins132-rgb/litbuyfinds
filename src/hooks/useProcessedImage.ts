"use client";

import { useEffect, useMemo, useState } from "react";
import type { BrightBgTreatment } from "@/lib/bright-bg";
import { getCatalogBrightBgTreatment } from "@/lib/bright-bg";
import { probeImageLoad, processProductImage } from "@/lib/image-processing";
import { validateImageUrl } from "@/lib/image-url";

export type ProcessedImageState = "idle" | "loading" | "ready" | "failed";

export function useProcessedImage(rawSrc: string) {
  const validation = useMemo(() => validateImageUrl(rawSrc), [rawSrc]);
  const [displaySrc, setDisplaySrc] = useState("");
  const [processedToPng, setProcessedToPng] = useState(false);
  const [treatment, setTreatment] = useState<BrightBgTreatment>("none");
  const [state, setState] = useState<ProcessedImageState>(() =>
    validation.valid ? "loading" : "failed"
  );

  useEffect(() => {
    if (!validation.valid) {
      setDisplaySrc("");
      setProcessedToPng(false);
      setTreatment("none");
      setState("failed");
      return;
    }

    let cancelled = false;
    setDisplaySrc("");
    setProcessedToPng(false);
    setTreatment("none");
    setState("loading");

    processProductImage(validation.normalized)
      .then((processed) => {
        if (cancelled) return;
        setDisplaySrc(processed.src);
        setProcessedToPng(processed.processedToPng);
        setTreatment(processed.treatment);
        setState("ready");
      })
      .catch(() => {
        void probeImageLoad(validation.normalized).then((ok) => {
          if (cancelled) return;
          if (ok) {
            const catalogTreatment = getCatalogBrightBgTreatment(
              validation.normalized
            );
            setDisplaySrc(validation.normalized);
            setProcessedToPng(false);
            setTreatment(catalogTreatment);
            setState("ready");
            return;
          }
          setDisplaySrc("");
          setProcessedToPng(false);
          setTreatment("none");
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
    treatment,
    needsDarkMatte: state === "ready" && treatment === "matte",
    needsVignette: state === "ready" && treatment === "vignette",
    failed: state === "failed",
    loading: state === "loading",
    ready: state === "ready",
  };
}
