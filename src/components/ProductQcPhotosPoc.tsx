"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

type ProductQcPhotosPocProps = {
  images: string[];
  productName: string;
  telegramUrl?: string;
};

/**
 * Temporary single-product experiment — renders only when images are provided.
 * Gallery markup stays the same; thumbnails open a lightweight fullscreen viewer.
 */
export default function ProductQcPhotosPoc({
  images,
  productName,
  telegramUrl,
}: ProductQcPhotosPocProps) {
  const titleId = useId();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const close = useCallback(() => setActiveIndex(null), []);

  const showPrev = useCallback(() => {
    setActiveIndex((current) => {
      if (current === null || images.length === 0) return current;
      return (current - 1 + images.length) % images.length;
    });
  }, [images.length]);

  const showNext = useCallback(() => {
    setActiveIndex((current) => {
      if (current === null || images.length === 0) return current;
      return (current + 1) % images.length;
    });
  }, [images.length]);

  useEffect(() => {
    if (activeIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        showPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        showNext();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex, close, showPrev, showNext]);

  if (images.length === 0) return null;

  const isOpen = activeIndex !== null;
  const activeSrc = isOpen ? images[activeIndex] : null;

  const lightbox =
    mounted && isOpen && activeSrc
      ? createPortal(
          <div
            className="fixed inset-0 z-[170] flex items-center justify-center bg-black/85 p-3 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            data-qc-lightbox-open="true"
            onClick={close}
          >
            <p id={titleId} className="sr-only">
              {productName} QC photo {activeIndex + 1} of {images.length}
            </p>

            <button
              type="button"
              aria-label="Close QC viewer"
              className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/50 text-xl text-white hover:bg-black/70 sm:right-5 sm:top-5"
              onClick={(event) => {
                event.stopPropagation();
                close();
              }}
            >
              ×
            </button>

            {images.length > 1 ? (
              <>
                <button
                  type="button"
                  aria-label="Previous QC photo"
                  className="absolute left-2 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/50 text-2xl text-white hover:bg-black/70 sm:left-4"
                  onClick={(event) => {
                    event.stopPropagation();
                    showPrev();
                  }}
                >
                  ‹
                </button>
                <button
                  type="button"
                  aria-label="Next QC photo"
                  className="absolute right-2 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/50 text-2xl text-white hover:bg-black/70 sm:right-4"
                  onClick={(event) => {
                    event.stopPropagation();
                    showNext();
                  }}
                >
                  ›
                </button>
              </>
            ) : null}

            <div
              className="relative flex max-h-[min(92dvh,900px)] max-w-[min(96vw,1100px)] items-center justify-center"
              onClick={(event) => event.stopPropagation()}
              onTouchStart={(event) => {
                touchStartX.current = event.changedTouches[0]?.clientX ?? null;
              }}
              onTouchEnd={(event) => {
                const startX = touchStartX.current;
                const endX = event.changedTouches[0]?.clientX;
                touchStartX.current = null;
                if (startX == null || endX == null || images.length < 2) return;
                const delta = endX - startX;
                if (Math.abs(delta) < 48) return;
                if (delta < 0) showNext();
                else showPrev();
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeSrc}
                alt={`${productName} QC photo ${activeIndex + 1}`}
                decoding="async"
                draggable={false}
                className="max-h-[min(92dvh,900px)] max-w-full select-none object-contain"
              />
            </div>

            <p className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/55 px-3 py-1 text-xs font-semibold text-white/90">
              {activeIndex + 1} / {images.length}
            </p>
          </div>,
          document.body
        )
      : null;

  return (
    <div className="relative z-10 space-y-3" data-qc-lightbox="1">
      <p className="text-sm font-bold text-foreground">QC Photos Available</p>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {images.map((src, index) => (
          <li
            key={src}
            className="overflow-hidden rounded-2xl border border-border bg-panel"
          >
            <button
              type="button"
              data-qc-thumb={index + 1}
              onClick={() => setActiveIndex(index)}
              className="block w-full cursor-zoom-in text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              aria-label={`Open ${productName} QC photo ${index + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`${productName} QC photo ${index + 1}`}
                width={800}
                height={600}
                loading="lazy"
                decoding="async"
                draggable={false}
                className="pointer-events-none h-auto w-full object-cover"
              />
            </button>
          </li>
        ))}
      </ul>
      {telegramUrl ? (
        <a
          href={telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex text-sm font-bold text-accent hover:underline"
        >
          View original QC on Telegram →
        </a>
      ) : null}
      {lightbox}
    </div>
  );
}
