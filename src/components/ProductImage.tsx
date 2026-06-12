"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { trackBrokenImage } from "@/lib/analytics-events";
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
  className?: string;
  priority?: boolean;
  variant?: ProductImageVariant;
  productHref?: string;
};

type LoadPhase = "primary" | "fallback" | "failed";

export default function ProductImage({
  src,
  alt,
  className = "",
  priority = false,
  variant = "card",
  productHref,
}: ProductImageProps) {
  const validation = useMemo(() => validateImageUrl(src), [src]);
  const plan = useMemo(() => {
    if (!validation.valid) return null;
    return getProductImagePlan(validation.normalized);
  }, [validation.normalized, validation.valid]);

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

  const markFailed = useCallback(() => {
    if (!plan) {
      setPhase("failed");
      return;
    }

    if (phase === "primary" && plan.isCutout && plan.originalSrc !== plan.src) {
      setPhase("fallback");
      setVisible(false);
      return;
    }

    setPhase("failed");
    setVisible(false);
    if (!loggedRef.current) {
      loggedRef.current = true;
      trackBrokenImage(validation.normalized || src, variant);
    }
  }, [phase, plan, src, validation.normalized, variant]);

  const handleLoad = useCallback(
    (event: React.SyntheticEvent<HTMLImageElement>) => {
      const img = event.currentTarget;
      if (!hasPlausibleImageDimensions(img.naturalWidth, img.naturalHeight)) {
        markFailed();
        return;
      }
      setVisible(true);
    },
    [markFailed]
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
  const needsMatte = !isCutout && (plan.needsMatte || phase === "fallback");

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
