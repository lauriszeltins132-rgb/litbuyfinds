"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { trackBrokenImage } from "@/lib/analytics-events";
import {
  classifyImageBackground,
  type ImageBackgroundKind,
} from "@/lib/image-background-analysis";
import { getCategoryFillClass } from "@/lib/image-presentation-presets";
import {
  buildProductImageCandidates,
  isAcceptableLoadedImage,
} from "@/lib/image-source-selection";
import { validateImageUrl } from "@/lib/image-url";
import ImageUnavailablePlaceholder from "./ImageUnavailablePlaceholder";

export type LitbuyProductImageVariant = "card" | "featured" | "hero";

const IMAGE_LAYOUT: Record<
  LitbuyProductImageVariant,
  { width: number; height: number; sizes: string }
> = {
  card: {
    width: 400,
    height: 400,
    sizes: "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 240px",
  },
  featured: {
    width: 540,
    height: 500,
    sizes: "(max-width: 1024px) 100vw, 540px",
  },
  hero: {
    width: 600,
    height: 560,
    sizes: "(max-width: 1024px) 100vw, 600px",
  },
};

export type LitbuyProductImageProps = {
  src: string;
  alt: string;
  productName?: string;
  category?: string;
  className?: string;
  priority?: boolean;
  variant?: LitbuyProductImageVariant;
  productHref?: string;
  preferredSrc?: string;
  fallbacks?: string[];
  fillClass?: string;
  surfaceClass?: string;
  backgroundKind?: ImageBackgroundKind;
  isProcessedCutout?: boolean;
};

export default function LitbuyProductImage({
  src,
  alt,
  category,
  className = "",
  priority = false,
  variant = "card",
  productHref,
  preferredSrc,
  fallbacks = [],
  fillClass,
  surfaceClass,
  backgroundKind,
  isProcessedCutout = false,
}: LitbuyProductImageProps) {
  const validation = useMemo(() => validateImageUrl(src), [src]);

  const candidates = useMemo(
    () =>
      buildProductImageCandidates(src, {
        preferredSrc,
        fallbacks,
        includeProcessedApi: variant !== "card",
      }),
    [src, preferredSrc, fallbacks, variant]
  );
  const candidateKey = candidates.join("|");

  const background = useMemo(() => {
    if (backgroundKind) {
      return {
        ...classifyImageBackground(src, { isProcessedCutout }),
        kind: backgroundKind,
      };
    }
    return classifyImageBackground(validation.valid ? validation.normalized : src, {
      isProcessedCutout,
    });
  }, [backgroundKind, isProcessedCutout, src, validation]);

  const resolvedFillClass = isProcessedCutout
    ? fillClass ?? "product-float-asset--fill-balanced"
    : category
      ? getCategoryFillClass(
          category,
          validation.valid ? validation.normalized : src,
          false
        )
      : fillClass ??
        getCategoryFillClass(
          category,
          validation.valid ? validation.normalized : src,
          isProcessedCutout
        );

  const resolvedSurfaceClass = surfaceClass ?? background.surfaceClass;

  const [srcIndex, setSrcIndex] = useState(0);
  const [failed, setFailed] = useState(candidates.length === 0);
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const loggedRef = useRef(false);

  const displaySrc = candidates[srcIndex] ?? "";
  const showingProcessed =
    isProcessedCutout ||
    displaySrc.startsWith("/processed/") ||
    displaySrc.startsWith("/api/processed-image");

  useEffect(() => {
    setSrcIndex(0);
    setFailed(candidates.length === 0);
    setLoaded(false);
    loggedRef.current = false;
  }, [candidateKey, candidates.length]);

  const failExhausted = useCallback(() => {
    setFailed(true);
    setLoaded(false);
    if (!loggedRef.current) {
      loggedRef.current = true;
      trackBrokenImage(validation.normalized || src, variant);
    }
  }, [src, validation.normalized, variant]);

  const advanceOrFail = useCallback(() => {
    setSrcIndex((currentIndex) => {
      if (currentIndex + 1 < candidates.length) {
        setLoaded(false);
        return currentIndex + 1;
      }
      failExhausted();
      return currentIndex;
    });
  }, [candidates.length, failExhausted]);

  const confirmLoaded = useCallback(
    (img: HTMLImageElement) => {
      if (!isAcceptableLoadedImage(img.naturalWidth, img.naturalHeight)) {
        advanceOrFail();
        return;
      }
      setLoaded(true);
    },
    [advanceOrFail]
  );

  useEffect(() => {
    const img = imgRef.current;
    if (!img || failed || !displaySrc) return;

    const tryConfirm = () => {
      if (img.complete && img.naturalWidth > 0) {
        confirmLoaded(img);
        return true;
      }
      return false;
    };

    if (tryConfirm()) return;

    let cancelled = false;
    void img.decode?.().then(() => {
      if (!cancelled) tryConfirm();
    }).catch(() => {
      if (!cancelled && img.complete && img.naturalWidth > 0) {
        setLoaded(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [confirmLoaded, displaySrc, failed, srcIndex]);

  if (failed || !displaySrc) {
    return (
      <ImageUnavailablePlaceholder
        className={className}
        variant={variant}
        productHref={productHref}
      />
    );
  }

  const assetClass = [
    "product-float-asset",
    resolvedFillClass,
    showingProcessed ? "product-float-asset--processed-cutout" : "",
    background.needsSeparation ? "product-float-asset--separated" : "",
    loaded ? "product-float-asset--ready" : "product-float-asset--loading",
  ]
    .filter(Boolean)
    .join(" ");

  const stageClass = [
    "product-float-stage",
    `product-float-stage--${variant}`,
    resolvedSurfaceClass,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const imageNode = (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      ref={imgRef}
      key={displaySrc}
      src={displaySrc}
      alt={alt}
      width={IMAGE_LAYOUT[variant].width}
      height={IMAGE_LAYOUT[variant].height}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      referrerPolicy="no-referrer"
      className={assetClass}
      onLoad={(event) => confirmLoaded(event.currentTarget)}
      onError={advanceOrFail}
    />
  );

  return (
    <div className={stageClass}>
      {variant !== "card" ? <div className="product-float-glow" aria-hidden /> : null}
      {variant === "card" ? (
        imageNode
      ) : (
        <div className="product-float-matte product-float-matte--opaque">{imageNode}</div>
      )}
      {!loaded && variant !== "card" ? (
        <ImageUnavailablePlaceholder
          variant={variant}
          loading
          productHref={productHref}
        />
      ) : null}
    </div>
  );
}
