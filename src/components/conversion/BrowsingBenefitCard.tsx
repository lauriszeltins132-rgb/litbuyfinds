"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import RegisterLink from "@/components/RegisterLink";
import { useConversion } from "@/context/ConversionContext";
import { CONVERSION_DISMISS_KEYS } from "@/lib/conversion";
import { REGISTER_MODAL_CTA_LABEL } from "@/lib/constants";

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
        <p className="mt-1 text-xs font-bold leading-snug text-foreground">
          Unlock verified links, QC photos &amp; order tracking
        </p>
        <div className="mt-2.5 flex flex-wrap gap-2">
          <RegisterLink
            location="sticky_benefit_card"
            className="inline-flex rounded-full bg-accent px-3 py-1.5 text-[10px] font-black text-background hover:bg-accent-hover sm:text-xs"
          >
            {REGISTER_MODAL_CTA_LABEL}
          </RegisterLink>
          <Link
            href="/guides/beginner-guide-to-litbuy"
            className="inline-flex rounded-full border border-border px-3 py-1.5 text-[10px] font-bold text-muted hover:text-foreground sm:text-xs"
          >
            Learn more
          </Link>
        </div>
      </div>
    </aside>
  );
}
