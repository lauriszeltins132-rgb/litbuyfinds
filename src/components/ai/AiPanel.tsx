"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { track } from "@vercel/analytics";

const AiChat = dynamic(() => import("@/components/ai/AiChat"), {
  ssr: false,
  loading: () => (
    <p className="p-4 text-sm text-muted" role="status">
      Loading LitBuy AI…
    </p>
  ),
});

type AiPanelProps = {
  open: boolean;
  onClose: () => void;
  entryPoint?: "floating" | "homepage" | "product" | "collection";
  initialPrompt?: string;
  returnFocusRef?: React.RefObject<HTMLElement | null>;
};

export default function AiPanel({
  open,
  onClose,
  entryPoint = "floating",
  initialPrompt,
  returnFocusRef,
}: AiPanelProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    track("ai_opened", { entryPoint });
    const previous = document.activeElement as HTMLElement | null;
    const restoreTarget = returnFocusRef?.current ?? previous;
    closeRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      restoreTarget?.focus?.();
    };
  }, [open, onClose, entryPoint, returnFocusRef]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Close LitBuy AI"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        className="absolute inset-x-0 bottom-0 max-h-[90vh] overflow-hidden rounded-t-3xl border border-border bg-background shadow-2xl motion-safe:animate-none sm:inset-y-0 sm:right-0 sm:left-auto sm:h-full sm:w-[min(100%,420px)] sm:rounded-none sm:border-l"
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div>
            <p id={titleId} className="text-sm font-black text-foreground">
              LitBuy AI
            </p>
            <p className="text-xs text-muted">Catalogue-grounded product finder</p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="min-h-11 min-w-11 rounded-full border border-border px-3 py-1.5 text-xs font-bold"
          >
            Close
          </button>
        </div>
        <div className="max-h-[calc(90vh-3.5rem)] overflow-y-auto px-3 pb-4 pt-2 sm:max-h-[calc(100vh-3.5rem)]">
          <AiChat entryPoint={entryPoint} initialPrompt={initialPrompt} compact />
        </div>
      </div>
    </div>
  );
}

export function useAiPanel() {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState<string | undefined>();
  const openWith = useCallback((next?: string) => {
    setPrompt(next);
    setOpen(true);
  }, []);
  const close = useCallback(() => setOpen(false), []);
  return { open, prompt, openWith, close, setOpen };
}
