"use client";

import { useCallback, useState } from "react";
import { useProcessedImage } from "@/hooks/useProcessedImage";

type ProductImageVariant = "card" | "featured" | "hero";

type ProductImageProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  variant?: ProductImageVariant;
};

const VARIANT_CAP: Record<ProductImageVariant, number> = {
  card: 320,
  featured: 460,
  hero: 520,
};

export default function ProductImage({
  src,
  alt,
  className = "",
  priority = false,
  variant = "card",
}: ProductImageProps) {
  const [failed, setFailed] = useState(false);
  const [safeMax, setSafeMax] = useState<number | null>(null);
  const { displaySrc, state } = useProcessedImage(src);

  const handleLoad = useCallback(
    (event: React.SyntheticEvent<HTMLImageElement>) => {
      const img = event.currentTarget;
      const natural = Math.max(img.naturalWidth, img.naturalHeight);
      if (!natural) return;

      const cap = VARIANT_CAP[variant];
      // Allow modest upscale for mid-res images; cap low-res so they stay sharp.
      if (natural < 380) {
        const upscale = natural < 220 ? 1.05 : natural < 300 ? 1.12 : 1.18;
        setSafeMax(Math.min(Math.round(natural * upscale), cap));
      }
    },
    [variant]
  );

  if (!src || failed) {
    return (
      <div
        className={`product-float-stage product-float-stage--${variant} product-float-stage--empty ${className}`}
      >
        <svg
          className="h-10 w-10 opacity-25 text-muted"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
          />
        </svg>
      </div>
    );
  }

  const assetClass =
    state === "fallback"
      ? "product-float-asset product-float-asset--fallback"
      : "product-float-asset";

  return (
    <div
      className={`product-float-stage product-float-stage--${variant} ${className}`}
    >
      <div className="product-float-glow" aria-hidden />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={displaySrc}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        referrerPolicy="no-referrer"
        className={`${assetClass} ${state === "loading" ? "product-float-asset--loading" : ""}`}
        style={
          safeMax
            ? { maxWidth: safeMax, maxHeight: safeMax }
            : undefined
        }
        onLoad={handleLoad}
        onError={() => setFailed(true)}
      />
    </div>
  );
}
