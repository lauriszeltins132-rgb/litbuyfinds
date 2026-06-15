import {
  LITBUY_OFFER_DESCRIPTION,
  LITBUY_OFFER_HEADLINE,
  REGISTER_MODAL_CTA_LABEL,
} from "@/lib/constants";
import OfferVisual from "./OfferVisual";
import RegisterLink from "./RegisterLink";

export default function OfferCallout() {
  return (
    <section className="px-4 py-6 sm:px-6">
      <div className="offer-card mx-auto max-w-7xl overflow-hidden rounded-3xl border border-accent/20 p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <OfferVisual className="shrink-0" />
            <div className="max-w-xl">
              <h2 className="text-2xl font-black sm:text-3xl">
                {LITBUY_OFFER_HEADLINE}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">
                {LITBUY_OFFER_DESCRIPTION}
              </p>
            </div>
          </div>

          <RegisterLink
            location="offer_callout"
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-accent px-8 py-4 text-sm font-black text-background transition-transform hover:scale-[1.02] hover:bg-accent-hover"
          >
            {REGISTER_MODAL_CTA_LABEL}
          </RegisterLink>
        </div>
      </div>
    </section>
  );
}
