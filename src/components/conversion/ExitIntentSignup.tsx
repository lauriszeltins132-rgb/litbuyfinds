"use client";

import { useEffect, useState } from "react";
import RegisterLink from "@/components/RegisterLink";
import { useConversion } from "@/context/ConversionContext";
import { CONVERSION_DISMISS_KEYS } from "@/lib/conversion";
import {
  LITBUY_ACCOUNT_BENEFITS,
  REGISTER_EXIT_CTA_LABEL,
} from "@/lib/constants";

export default function ExitIntentSignup() {
  const { isNudgeDismissed, dismissNudge } = useConversion();
  const [visible, setVisible] = useState(false);
  const dismissed = isNudgeDismissed(CONVERSION_DISMISS_KEYS.exitIntent);

  useEffect(() => {
    if (dismissed) return;

    const onMouseOut = (event: MouseEvent) => {
      if (event.relatedTarget || event.clientY > 24) return;
      setVisible(true);
    };

    window.addEventListener("mouseout", onMouseOut);
    return () => window.removeEventListener("mouseout", onMouseOut);
  }, [dismissed]);

  if (!visible || dismissed) return null;

  return (
    <div className="fixed inset-0 z-[190] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={() => {
          setVisible(false);
          dismissNudge(CONVERSION_DISMISS_KEYS.exitIntent);
        }}
      />

      <div className="panel-shell relative w-full max-w-md rounded-3xl border border-border bg-surface p-6">
        <button
          type="button"
          aria-label="Close"
          className="absolute right-3 top-3 text-muted hover:text-foreground"
          onClick={() => {
            setVisible(false);
            dismissNudge(CONVERSION_DISMISS_KEYS.exitIntent);
          }}
        >
          ×
        </button>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">
          Before you go
        </p>
        <h2 className="mt-2 text-xl font-black">Unlock LitBuy member benefits</h2>
        <ul className="mt-4 space-y-2">
          {LITBUY_ACCOUNT_BENEFITS.slice(0, 4).map((benefit) => (
            <li
              key={benefit}
              className="flex items-start gap-2 text-sm text-foreground/90"
            >
              <span className="text-accent" aria-hidden>
                ✓
              </span>
              {benefit}
            </li>
          ))}
        </ul>
        <RegisterLink
          location="exit_intent"
          className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-accent py-3.5 text-sm font-black text-background hover:bg-accent-hover"
          onClick={() => dismissNudge(CONVERSION_DISMISS_KEYS.exitIntent)}
        >
          {REGISTER_EXIT_CTA_LABEL}
        </RegisterLink>
      </div>
    </div>
  );
}
