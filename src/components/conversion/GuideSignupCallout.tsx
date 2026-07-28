import RegisterLink from "@/components/RegisterLink";
import { LITBUY_SIGNUP_URL, REGISTER_MODAL_CTA_LABEL } from "@/lib/constants";

type GuideSignupCalloutProps = {
  variant?: "inline" | "panel";
};

export default function GuideSignupCallout({ variant = "panel" }: GuideSignupCalloutProps) {
  if (variant === "inline") {
    return (
      <p className="rounded-xl border border-accent/20 bg-accent/5 px-4 py-3 text-sm leading-relaxed text-muted">
        <span className="font-bold text-foreground">Tip:</span> Create a LitBuy
        account before you buy — unlock verified links, QC photos, and order
        tracking.{" "}
        <RegisterLink
          location="guide_inline_callout"
          className="font-bold text-accent hover:underline"
        >
          {REGISTER_MODAL_CTA_LABEL}
        </RegisterLink>
      </p>
    );
  }

  return (
    <aside className="rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/8 via-surface/40 to-surface/20 p-5 sm:p-6">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">
        Before you buy
      </p>
      <h3 className="mt-2 text-lg font-black text-foreground">
        Get your LitBuy account
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Guides help you research. A LitBuy account unlocks QC photos, verified
        buy links, order tracking, and{" "}
        <a
          href={LITBUY_SIGNUP_URL}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="font-semibold text-accent hover:underline"
        >
          shipping discounts
        </a>
        .
      </p>
      <RegisterLink
        location="guide_panel_callout"
        className="mt-4 inline-flex rounded-full bg-accent px-5 py-2.5 text-sm font-black text-background hover:bg-accent-hover"
      >
        {REGISTER_MODAL_CTA_LABEL}
      </RegisterLink>
    </aside>
  );
}
