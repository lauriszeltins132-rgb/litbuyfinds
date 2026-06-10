import {
  LITBUY_OFFER_DESCRIPTION,
  LITBUY_OFFER_HEADLINE,
} from "@/lib/constants";
import CommunityLinks from "./CommunityLinks";
import RegisterLink from "./RegisterLink";

export default function OfferCallout() {
  return (
    <section className="px-4 py-6 sm:px-6">
      <div className="offer-card mx-auto max-w-7xl overflow-hidden rounded-3xl border border-accent/25 p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
              <span className="offer-badge">Limited</span>
              New user offer
            </p>
            <h2 className="mt-4 text-2xl font-black sm:text-3xl">
              {LITBUY_OFFER_HEADLINE}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">
              {LITBUY_OFFER_DESCRIPTION}
            </p>
          </div>

          <div className="flex shrink-0 flex-col items-stretch gap-3 sm:items-end">
            <RegisterLink
              location="offer_callout"
              className="inline-flex items-center justify-center rounded-full bg-accent px-8 py-4 text-sm font-black text-background transition-transform hover:scale-[1.02] hover:bg-accent-hover"
            >
              Register on LitBuy
            </RegisterLink>
            <CommunityLinks variant="inline" location="offer_callout" />
          </div>
        </div>
      </div>
    </section>
  );
}
