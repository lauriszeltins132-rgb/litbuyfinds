"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import RegisterLink from "@/components/RegisterLink";
import { trackConversion } from "@/lib/analytics-events";
import { isMobileViewport } from "@/lib/is-mobile-viewport";
import {
  LITBUY_COUPONS_OFFER,
  LITBUY_COUPONS_PATH,
  LITBUY_INVITE_CODE,
} from "@/lib/litbuy-coupons-page";

const SHIPPING_PERCENT = LITBUY_COUPONS_OFFER.shippingDiscount.replace(/\s*OFF$/i, "");
const CLAIM_LABEL = `Claim Your ${SHIPPING_PERCENT} Coupon`;

function deviceVariant() {
  return isMobileViewport() ? "mobile" : "desktop";
}

function trackCoupon(
  event: "coupon_page_view" | "coupon_hero_signup_click" | "coupon_sticky_signup_click",
  location: string
) {
  trackConversion(event, {
    location,
    href: typeof window !== "undefined" ? window.location.pathname : LITBUY_COUPONS_PATH,
    variant: deviceVariant(),
  });
}

export default function CouponPageOffer() {
  const offerRef = useRef<HTMLDivElement>(null);
  const [sticky, setSticky] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    trackCoupon("coupon_page_view", "litbuy_coupons");
  }, []);

  useEffect(() => {
    const node = offerRef.current;
    if (!node) return;
    const mobile = window.matchMedia("(max-width: 639px)");

    const observer = new IntersectionObserver(
      ([entry]) => {
        setSticky(mobile.matches && !entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "0px 0px -72px 0px" }
    );
    observer.observe(node);

    const onChange = () => {
      if (!mobile.matches) setSticky(false);
    };
    mobile.addEventListener("change", onChange);
    return () => {
      observer.disconnect();
      mobile.removeEventListener("change", onChange);
    };
  }, []);

  const stickyBar =
    sticky && mounted
      ? createPortal(
          <div
            data-coupon-sticky=""
            className="fixed z-[70] flex items-center justify-between gap-3 rounded-2xl border border-accent/30 bg-panel/95 px-3 py-2 shadow-[0_8px_24px_rgba(26,25,22,0.12)] sm:hidden"
            style={{
              left: "max(0.75rem, env(safe-area-inset-left, 0px))",
              right: "max(0.75rem, env(safe-area-inset-right, 0px))",
              bottom: "calc(4.6rem + env(safe-area-inset-bottom, 0px))",
            }}
          >
            <p className="text-xs font-black uppercase leading-tight tracking-tight text-foreground">
              {SHIPPING_PERCENT} off shipping
            </p>
            <RegisterLink
              location="litbuy_coupons_sticky"
              onClick={() => trackCoupon("coupon_sticky_signup_click", "coupon_sticky")}
              className="inline-flex shrink-0 items-center justify-center rounded-full bg-accent px-3.5 py-2 text-xs font-black text-background"
            >
              Claim Coupon
            </RegisterLink>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <div
        ref={offerRef}
        className="mt-3 rounded-2xl border border-accent/30 bg-panel px-3.5 py-2.5 shadow-[0_8px_24px_rgba(26,25,22,0.05)] sm:mt-5 sm:px-5 sm:py-4"
      >
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
          Current new user offer
        </p>
        <p className="mt-0.5 text-[1.28rem] font-black uppercase leading-none tracking-tight text-foreground sm:mt-1 sm:text-3xl sm:leading-none">
          Up to {SHIPPING_PERCENT} off shipping
        </p>
        <p className="mt-1 text-[13px] leading-snug text-muted sm:mt-2 sm:text-sm">
          Plus a welcome coupon pack of up to {LITBUY_COUPONS_OFFER.welcomePack} for
          eligible new LitBuy accounts.
        </p>
        <p className="mt-1.5 text-sm font-bold text-foreground sm:mt-3">
          Invite code{" "}
          <span className="rounded-md bg-accent/15 px-2 py-0.5 font-black tracking-wide text-accent">
            {LITBUY_INVITE_CODE}
          </span>
        </p>
        <RegisterLink
          location="litbuy_coupons_offer"
          onClick={() => trackCoupon("coupon_hero_signup_click", "coupon_hero")}
          className="mt-2 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-accent px-4 text-sm font-black text-background transition hover:bg-accent-hover sm:mt-3 sm:min-h-12"
        >
          {CLAIM_LABEL}
        </RegisterLink>
        <p className="mt-1.5 text-center text-[11px] text-muted sm:mt-2 sm:text-xs">
          Create a free LitBuy account with invite code {LITBUY_INVITE_CODE}.
        </p>
      </div>
      {stickyBar}
    </>
  );
}
