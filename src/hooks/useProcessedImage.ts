"use client";

import { useEffect, useState } from "react";
import { removeWhiteBackground } from "@/lib/image-processing";

export type ProcessedImageState = "loading" | "processed" | "fallback";

export function useProcessedImage(src: string) {
  const [displaySrc, setDisplaySrc] = useState(src);
  const [state, setState] = useState<ProcessedImageState>(
    src ? "loading" : "fallback"
  );

  useEffect(() => {
    if (!src) {
      setState("fallback");
      return;
    }

    let cancelled = false;
    setDisplaySrc(src);
    setState("loading");

    removeWhiteBackground(src)
      .then((processed) => {
        if (!cancelled) {
          setDisplaySrc(processed);
          setState("processed");
        }
      })
      .catch(() => {
        if (!cancelled) {
          setDisplaySrc(src);
          setState("fallback");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [src]);

  return { displaySrc, state };
}
