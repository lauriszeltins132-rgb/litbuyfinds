"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useProcessedImage } from "@/hooks/useProcessedImage";
import type { BrightBgTreatment } from "@/lib/bright-bg";
import { trackBrokenImage } from "@/lib/analytics-events";
import { detectBrightFromElement } from "@/lib/image-bright-detect";
import {
  hasPlausibleImageDimensions,
  validateImageUrl,
} from "@/lib/image-url";
import ImageUnavailablePlaceholder from "./ImageUnavailablePlaceholder";

type ProductImageVariant = "card" | "featured" | "hero";

type ProductImageProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  variant?: ProductImageVariant;
  productHref?: string;
};

export default function ProductImage({
  src,
  alt,
  className = "",
  priority = false,
  variant = "card",
  productHref,
}: ProductImageProps) {
  const validation = validateImageUrl(src);
  const {
    displaySrc,
    failed,
    loading,
    ready,
    treatment: catalogTreatment,
    processedToPng,
  } = useProcessedImage(src);
  const [renderFailed, setRenderFailed] = useState(!validation.valid);
  const [visible, setVisible] = useState(false);
  const [liveTreatment, setLiveTreatment] =
    useState<BrightBgTreatment>("none");
  const loggedRef = useRef(false);

  const treatment =
    liveTreatment !== "none" ? liveTreatment : catalogTreatment;
  const needsDarkMatte = !processedToPng && treatment === "matte";
  const needsVignette = !processedToPng && treatment === "vignette";
  const needsBrightFrame = needsDarkMatte || needsVignette;

  useEffect(() => {
    setRenderFailed(!validation.valid);
    setVisible(false);
    setLiveTreatment("none");
    loggedRef.current = false;
  }, [validation.normalized, validation.valid]);

  const markFailed = useCallback(() => {
    setRenderFailed(true);
    setVisible(false);
    if (!loggedRef.current) {
      loggedRef.current = true;
      trackBrokenImage(validation.normalized || src, variant);
    }
  }, [src, validation.normalized, variant]);

  const handleLoad = useCallback(
    (event: React.SyntheticEvent<HTMLImageElement>) => {
      const img = event.currentTarget;
      if (!hasPlausibleImageDimensions(img.naturalWidth, img.naturalHeight)) {
        markFailed();
        return;
      }

      if (!processedToPng && catalogTreatment === "none") {
        const detected = detectBrightFromElement(img);
        if (detected) setLiveTreatment(detected);
      }

      setVisible(true);
    },
    [catalogTreatment, markFailed, processedToPng]
  );

  const showPlaceholder = renderFailed || failed || !ready || !displaySrc;

  if (showPlaceholder) {
    return (
      <ImageUnavailablePlaceholder
        className={className}
        variant={variant}
        loading={!renderFailed && !failed && loading}
        productHref={productHref}
      />
    );
  }

  const assetClass = needsDarkMatte
    ? "product-float-asset product-float-asset--matte"
    : needsVignette
      ? "product-float-asset product-float-asset--vignette"
      : processedToPng
        ? "product-float-asset product-float-asset--processed"
        : "product-float-asset product-float-asset--natural";

  const stageClass = needsVignette
    ? `product-float-stage product-float-stage--vignette product-float-stage--${variant}`
    : `product-float-stage product-float-stage--${variant}`;

  const matteClass = needsBrightFrame
    ? needsVignette
      ? "product-float-matte product-float-matte--vignette"
      : "product-float-matte product-float-matte--active"
    : "product-float-matte";

  return (
    <div className={`${stageClass} ${className}`}>
      {variant === "card" ? null : <div className="product-float-glow" aria-hidden />}
      <div className={matteClass}>
        {needsBrightFrame ? (
          <div className="product-float-matte-solid" aria-hidden />
        ) : null}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={displaySrc}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          referrerPolicy="no-referrer"
          className={`${assetClass} ${visible ? "" : "product-float-asset--hidden"}`}
          onLoad={handleLoad}
          onError={markFailed}
        />
      </div>
      {needsVignette ? (
        <div className="product-float-vignette-mask" aria-hidden />
      ) : null}
      {needsBrightFrame ? (
        <div className="product-float-edge-mask" aria-hidden />
      ) : null}
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
