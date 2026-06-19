"use client";

import { usePathname } from "next/navigation";
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
} from "@/lib/constants";
import {
  getMobilePopupCtaVariant,
  trackPopupClose,
  trackPopupImpression,
} from "@/lib/analytics-events";

const SCROLL_THRESHOLD_MOBILE = 2200;
const SCROLL_THRESHOLD_DESKTOP = 2800;
const APPEAR_DELAY_MS = 25_000;
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
  const pathname = usePathname();
  const { isNudgeDismissed, dismissNudge } = useConversion();
  const [visible, setVisible] = useState(false);
  const [variant, setVariant] = useState<"a" | "b">("a");
  const impressed = useRef(false);
  const scrollReadyAt = useRef<number | null>(null);
  const isMobile = useIsMobile();
  const dismissed = isNudgeDismissed(CONVERSION_DISMISS_KEYS.stickyBenefit);

  useEffect(() => {
    setVariant(getMobilePopupCtaVariant());
  }, []);

  useEffect(() => {
    if (pathname !== "/") {
      setVisible(false);
      scrollReadyAt.current = null;
    }
  }, [pathname]);

  useEffect(() => {
    if (pathname !== "/") return;

    const threshold = isMobile ? SCROLL_THRESHOLD_MOBILE : SCROLL_THRESHOLD_DESKTOP;

    const onScroll = () => {
      if (window.scrollY < threshold) {
        scrollReadyAt.current = null;
        setVisible(false);
        return;
      }

      if (scrollReadyAt.current === null) {
        scrollReadyAt.current = Date.now();
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isMobile, pathname]);

  useEffect(() => {
    if (pathname !== "/" || dismissed || scrollReadyAt.current === null) return;

    const timer = window.setInterval(() => {
      if (scrollReadyAt.current === null) return;
      if (Date.now() - scrollReadyAt.current >= APPEAR_DELAY_MS) {
        setVisible(true);
        window.clearInterval(timer);
      }
    }, 500);

    return () => window.clearInterval(timer);
  }, [dismissed, isMobile, pathname]);

  useEffect(() => {
    if (!visible || dismissed || impressed.current) return;
    impressed.current = true;
    trackPopupImpression(POPUP_LOCATION, variant);
  }, [visible, dismissed, variant]);

  if (pathname !== "/" || !visible || dismissed) return null;

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

          {!isMobile ? (
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
          ) : null}
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
