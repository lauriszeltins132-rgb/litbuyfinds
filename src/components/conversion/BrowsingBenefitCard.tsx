"use client";

import { useEffect, useState } from "react";
import RegisterLink from "@/components/RegisterLink";
import { useConversion } from "@/context/ConversionContext";
import { CONVERSION_DISMISS_KEYS } from "@/lib/conversion";
import {
  LITBUY_STICKY_BENEFITS,
  REGISTER_STICKY_CTA_LABEL,
} from "@/lib/constants";

const SCROLL_THRESHOLD = 480;

export default function BrowsingBenefitCard() {
  const { isNudgeDismissed, dismissNudge } = useConversion();
  const [visible, setVisible] = useState(false);
  const dismissed = isNudgeDismissed(CONVERSION_DISMISS_KEYS.stickyBenefit);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible || dismissed) return null;

  return (
    <aside
      className="conversion-sticky-benefit"
      aria-label="LitBuy member benefits"
    >
      <div className="conversion-sticky-benefit__card">
        <button
          type="button"
          aria-label="Dismiss"
          className="conversion-sticky-benefit__close"
          onClick={() => dismissNudge(CONVERSION_DISMISS_KEYS.stickyBenefit)}
        >
          ×
        </button>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
          Free LitBuy account
        </p>
        <p className="mt-1 text-xs font-bold text-foreground">Unlock:</p>
        <ul className="mt-1.5 space-y-1">
          {LITBUY_STICKY_BENEFITS.map((benefit) => (
            <li
              key={benefit}
              className="flex items-center gap-1.5 text-[11px] text-muted"
            >
              <span className="text-accent" aria-hidden>
                ✓
              </span>
              {benefit}
            </li>
          ))}
        </ul>
        <RegisterLink
          location="sticky_benefit_card"
          className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-accent px-3 py-2 text-xs font-black text-background hover:bg-accent-hover"
        >
          {REGISTER_STICKY_CTA_LABEL}
        </RegisterLink>
      </div>
    </aside>
  );
}
