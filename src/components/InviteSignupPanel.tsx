"use client";

import { useEffect, useState } from "react";
import { LITBUY_INVITE_CODE, LITBUY_SIGNUP_URL } from "@/lib/constants";
import {
  trackInviteCodeCopy,
  trackInvitePageView,
  trackLitbuySignupClick,
} from "@/lib/analytics-events";

type InviteSignupPanelProps = {
  headline: string;
  disclaimer: string;
};

const STEPS = [
  "Open the LitBuy signup page.",
  "Enter your email and account details.",
  `Confirm invitation code ${LITBUY_INVITE_CODE} is entered.`,
  "Complete registration.",
  "Check the coupons and offers shown on your new account.",
];

export default function InviteSignupPanel({
  headline,
  disclaimer,
}: InviteSignupPanelProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    trackInvitePageView("invite_page_hero");
  }, []);

  async function copyCode() {
    let didCopy = false;
    try {
      await navigator.clipboard.writeText(LITBUY_INVITE_CODE);
      didCopy = true;
    } catch {
      const area = document.createElement("textarea");
      area.value = LITBUY_INVITE_CODE;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.left = "-9999px";
      document.body.appendChild(area);
      area.select();
      didCopy = document.execCommand("copy");
      area.remove();
    }
    setCopied(didCopy);
    trackInviteCodeCopy("invite_page_hero");
  }

  return (
    <section
      className="mt-6 rounded-2xl border border-border bg-surface/50 p-4 sm:p-5"
      aria-label="LitBuy signup"
    >
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">
        Invite code
      </p>
      <p className="mt-2 font-mono text-3xl font-black tracking-[0.18em] text-foreground">
        {LITBUY_INVITE_CODE}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Use this code when you create a LitBuy account. The signup link already
        includes it. This records the click to LitBuy, not a completed registration.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={copyCode}
          className="inline-flex items-center justify-center rounded-2xl border border-border bg-panel px-5 py-3 text-sm font-bold text-foreground hover:border-accent hover:text-accent"
        >
          {copied ? "Copied" : "Copy code"}
        </button>
        <a
          href={LITBUY_SIGNUP_URL}
          target="_blank"
          rel="noopener noreferrer sponsored"
          onClick={() => trackLitbuySignupClick("invite_page_hero")}
          className="community-btn community-btn--discord inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-bold text-white"
        >
          Sign up to LitBuy
        </a>
      </div>

      <ol className="mt-5 space-y-2 text-sm leading-relaxed text-foreground">
        {STEPS.map((step, index) => (
          <li key={step}>
            <span className="font-bold">{index + 1}. </span>
            {step}
          </li>
        ))}
      </ol>
      <a
        href={LITBUY_SIGNUP_URL}
        target="_blank"
        rel="noopener noreferrer sponsored"
        onClick={() => trackLitbuySignupClick("invite_page_steps")}
        className="mt-4 inline-flex items-center justify-center rounded-2xl border border-border bg-panel px-5 py-3 text-sm font-bold text-foreground hover:border-accent hover:text-accent"
      >
        Create LitBuy account
      </a>
      <p className="mt-4 text-sm leading-relaxed text-muted">
        Eligible new accounts can see {headline}. {disclaimer} Coupon details stay
        on the LitBuy coupons page.
      </p>
    </section>
  );
}
