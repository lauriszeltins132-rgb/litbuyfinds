"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { trackBrokenImage } from "@/lib/analytics-events";
import { cutoutLooksDamaged } from "@/lib/cutout-quality";
import { getProductImagePlan } from "@/lib/processed-images";
import {
  hasPlausibleImageDimensions,
  validateImageUrl,
} from "@/lib/image-url";
import ImageUnavailablePlaceholder from "./ImageUnavailablePlaceholder";

type ProductImageVariant = "card" | "featured" | "hero";

type ProductImageProps = {
  src: string;
  alt: string;
  productName?: string;
  className?: string;
  priority?: boolean;
  variant?: ProductImageVariant;
  productHref?: string;
};

type LoadPhase = "primary" | "fallback" | "failed";

const ARTIFACT_SAMPLE = 72;

function detectCutoutArtifacts(img: HTMLImageElement): boolean {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = ARTIFACT_SAMPLE;
    canvas.height = ARTIFACT_SAMPLE;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return false;

    ctx.drawImage(img, 0, 0, ARTIFACT_SAMPLE, ARTIFACT_SAMPLE);
    const { data, width, height } = ctx.getImageData(0, 0, ARTIFACT_SAMPLE, ARTIFACT_SAMPLE);
    return cutoutLooksDamaged(data, width, height);
  } catch {
    return false;
  }
}

export default function ProductImage({
  src,
  alt,
  productName,
  className = "",
  priority = false,
  variant = "card",
  productHref,
}: ProductImageProps) {
  const validation = useMemo(() => validateImageUrl(src), [src]);
  const plan = useMemo(() => {
    if (!validation.valid) return null;
    return getProductImagePlan(validation.normalized, productName);
  }, [validation.normalized, validation.valid, productName]);

  const [phase, setPhase] = useState<LoadPhase>(
    validation.valid && plan ? "primary" : "failed"
  );
  const [visible, setVisible] = useState(false);
  const loggedRef = useRef(false);

  useEffect(() => {
    setPhase(validation.valid && plan ? "primary" : "failed");
    setVisible(false);
    loggedRef.current = false;
  }, [validation.normalized, validation.valid, plan]);

  const activeSrc = useMemo(() => {
    if (!plan) return "";
    if (phase === "primary") return plan.src;
    if (phase === "fallback") return plan.originalSrc;
    return "";
  }, [phase, plan]);

  const fallbackToOriginal = useCallback(() => {
    if (!plan) {
      setPhase("failed");
      setVisible(false);
      return;
    }
    if (phase === "primary" && plan.isCutout && plan.originalSrc !== plan.src) {
      setPhase("fallback");
      setVisible(false);
      return;
    }
    setPhase("failed");
    setVisible(false);
  }, [phase, plan]);

  const markFailed = useCallback(() => {
    const wasPrimary = phase === "primary";
    fallbackToOriginal();
    if (!wasPrimary && !loggedRef.current) {
      loggedRef.current = true;
      trackBrokenImage(validation.normalized || src, variant);
    }
  }, [fallbackToOriginal, phase, src, validation.normalized, variant]);

  const handleLoad = useCallback(
    (event: React.SyntheticEvent<HTMLImageElement>) => {
      const img = event.currentTarget;
      if (!hasPlausibleImageDimensions(img.naturalWidth, img.naturalHeight)) {
        markFailed();
        return;
      }

      const showingCutout = phase === "primary" && plan?.isCutout;
      if (showingCutout && detectCutoutArtifacts(img)) {
        fallbackToOriginal();
        return;
      }

      setVisible(true);
    },
    [fallbackToOriginal, markFailed, phase, plan?.isCutout]
  );

  if (phase === "failed" || !validation.valid || !plan || !activeSrc) {
    return (
      <ImageUnavailablePlaceholder
        className={className}
        variant={variant}
        productHref={productHref}
      />
    );
  }

  const isCutout = phase === "primary" && plan.isCutout;
  const needsMatte = !isCutout;

  return (
    <div
      className={`product-float-stage product-float-stage--${variant} ${className}`}
    >
      {variant !== "card" ? <div className="product-float-glow" aria-hidden /> : null}
      <div
        className={`product-float-matte ${
          needsMatte ? "product-float-matte--bright" : ""
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={activeSrc}
          src={activeSrc}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          referrerPolicy="no-referrer"
          className={`product-float-asset ${
            isCutout ? "product-float-asset--cutout" : "product-float-asset--raw"
          } ${visible ? "" : "product-float-asset--hidden"}`}
          onLoad={handleLoad}
          onError={markFailed}
        />
      </div>
      {!visible && (
        <ImageUnavailablePlaceholder
          variant={variant}
          loading
          productHref={productHref}
        />
      )}
    </div>
  );
}
