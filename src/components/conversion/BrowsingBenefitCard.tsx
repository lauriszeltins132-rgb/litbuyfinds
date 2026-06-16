"use client";

import { useEffect, useRef, useState } from "react";
import RegisterLink from "@/components/RegisterLink";
import { useConversion } from "@/context/ConversionContext";
import { CONVERSION_DISMISS_KEYS } from "@/lib/conversion";
import {
  MOBILE_POPUP_BADGE,
  MOBILE_POPUP_BENEFITS,
  MOBILE_POPUP_CTA_A,
  MOBILE_POPUP_CTA_B,
  MOBILE_POPUP_HEADLINE,
  MOBILE_POPUP_SUBTEXT,
  MOBILE_POPUP_URGENCY,
} from "@/lib/constants";
import {
  getMobilePopupCtaVariant,
  trackPopupClose,
  trackPopupImpression,
} from "@/lib/analytics-events";

const SCROLL_THRESHOLD = 480;
const POPUP_LOCATION = "mobile_popup_sheet";

function useIsMobile() {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return mobile;
}

export default function BrowsingBenefitCard() {
  const { isNudgeDismissed, dismissNudge } = useConversion();
  const [visible, setVisible] = useState(false);
  const [variant, setVariant] = useState<"a" | "b">("a");
  const impressed = useRef(false);
  const isMobile = useIsMobile();
  const dismissed = isNudgeDismissed(CONVERSION_DISMISS_KEYS.stickyBenefit);

  useEffect(() => {
    setVariant(getMobilePopupCtaVariant());
  }, []);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!visible || dismissed || impressed.current) return;
    impressed.current = true;
    trackPopupImpression(POPUP_LOCATION, variant);
  }, [visible, dismissed, variant]);

  if (!visible || dismissed) return null;

  const ctaLabel = variant === "a" ? MOBILE_POPUP_CTA_A : MOBILE_POPUP_CTA_B;
  const registerLocation = `${POPUP_LOCATION}_${variant}`;

  function handleClose() {
    trackPopupClose(POPUP_LOCATION, variant);
    dismissNudge(CONVERSION_DISMISS_KEYS.stickyBenefit);
  }

  return (
    <aside
      className={`conversion-mobile-popup ${isMobile ? "conversion-mobile-popup--sheet" : "conversion-mobile-popup--card"}`}
      aria-label="LitBuy account benefits"
      role="dialog"
      aria-modal="false"
    >
      <div className="conversion-mobile-popup__panel">
        <button
          type="button"
          aria-label="Dismiss"
          className="conversion-mobile-popup__close"
          onClick={handleClose}
        >
          ×
        </button>

        <div className="conversion-mobile-popup__scroll">
          <p className="conversion-mobile-popup__badge">
            <span aria-hidden>🔥</span> {MOBILE_POPUP_BADGE.toUpperCase()}
          </p>

          <h2 className="conversion-mobile-popup__headline">{MOBILE_POPUP_HEADLINE}</h2>

          <p className="conversion-mobile-popup__subtext">{MOBILE_POPUP_SUBTEXT}</p>

          <ul className="conversion-mobile-popup__benefits">
            {MOBILE_POPUP_BENEFITS.map((benefit) => (
              <li key={benefit}>
                <span className="conversion-mobile-popup__check" aria-hidden>
                  ✓
                </span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>

          <p className="conversion-mobile-popup__urgency">{MOBILE_POPUP_URGENCY}</p>
        </div>

        <div className="conversion-mobile-popup__actions">
          <RegisterLink
            location={registerLocation}
            className="conversion-mobile-popup__cta"
            onClick={handleClose}
          >
            {ctaLabel}
          </RegisterLink>
          <p className="conversion-mobile-popup__footnote">
            Free account · Takes 30 seconds
          </p>
        </div>
      </div>
    </aside>
  );
}
