"use client";

import { useEffect } from "react";

type ProductQcPhotosPocProps = {
  images: string[];
  productName: string;
  telegramUrl?: string;
};

function photoHash(index: number) {
  return `qc-photo-${index + 1}`;
}

/**
 * Temporary single-product experiment — renders only when images are provided.
 * Uses hash/:target lightbox so open/close/prev/next work from SSR HTML
 * (no hydration required for basic click). Escape is handled lightly in JS.
 */
export default function ProductQcPhotosPoc({
  images,
  productName,
  telegramUrl,
}: ProductQcPhotosPocProps) {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const match = /^qc-photo-(\d+)$/.exec(window.location.hash.slice(1));
      if (!match) return;

      const current = Number(match[1]) - 1;
      if (event.key === "Escape") {
        event.preventDefault();
        window.location.hash = "qc-photos-poc";
        return;
      }
      if (images.length < 2) return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        const prev = (current - 1 + images.length) % images.length;
        window.location.hash = photoHash(prev);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        const next = (current + 1) % images.length;
        window.location.hash = photoHash(next);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [images.length]);

  useEffect(() => {
    function syncOverflow() {
      const open = /^qc-photo-\d+$/.test(window.location.hash.slice(1));
      document.body.style.overflow = open ? "hidden" : "";
    }
    syncOverflow();
    window.addEventListener("hashchange", syncOverflow);
    return () => {
      window.removeEventListener("hashchange", syncOverflow);
      document.body.style.overflow = "";
    };
  }, []);

  if (images.length === 0) return null;

  return (
    <div className="relative z-10 space-y-3" data-qc-lightbox="1">
      <p className="text-sm font-bold text-foreground">QC Photos Available</p>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {images.map((src, index) => (
          <li
            key={src}
            className="overflow-hidden rounded-2xl border border-border bg-panel"
          >
            <a
              href={`#${photoHash(index)}`}
              data-qc-thumb={index + 1}
              className="block w-full cursor-zoom-in focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
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
            </a>
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

      {images.map((src, index) => {
        const prev = (index - 1 + images.length) % images.length;
        const next = (index + 1) % images.length;
        return (
          <div
            key={`lightbox-${src}`}
            id={photoHash(index)}
            data-qc-lightbox-panel={index + 1}
            className="fixed inset-0 z-[170] hidden items-center justify-center bg-black/85 p-3 target:flex sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-label={`${productName} QC photo ${index + 1} of ${images.length}`}
          >
            {/* Backdrop close */}
            <a
              href="#qc-photos-poc"
              className="absolute inset-0"
              aria-label="Close QC viewer"
            />

            <a
              href="#qc-photos-poc"
              className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/50 text-xl text-white hover:bg-black/70 sm:right-5 sm:top-5"
              aria-label="Close QC viewer"
            >
              ×
            </a>

            {images.length > 1 ? (
              <>
                <a
                  href={`#${photoHash(prev)}`}
                  className="absolute left-2 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/50 text-2xl text-white hover:bg-black/70 sm:left-4"
                  aria-label="Previous QC photo"
                >
                  ‹
                </a>
                <a
                  href={`#${photoHash(next)}`}
                  className="absolute right-2 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/50 text-2xl text-white hover:bg-black/70 sm:right-4"
                  aria-label="Next QC photo"
                >
                  ›
                </a>
              </>
            ) : null}

            <div className="relative z-[1] flex max-h-[min(92dvh,900px)] max-w-[min(96vw,1100px)] items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`${productName} QC photo ${index + 1}`}
                loading="lazy"
                decoding="async"
                draggable={false}
                className="max-h-[min(92dvh,900px)] max-w-full select-none object-contain"
              />
            </div>

            <p className="pointer-events-none absolute bottom-3 left-1/2 z-10 -translate-x-1/2 rounded-full bg-black/55 px-3 py-1 text-xs font-semibold text-white/90">
              {index + 1} / {images.length}
            </p>
          </div>
        );
      })}
    </div>
  );
}
