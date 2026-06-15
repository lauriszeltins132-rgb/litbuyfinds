import RegisterLink from "@/components/RegisterLink";
import {
  LITBUY_ACCOUNT_BENEFITS,
  REGISTER_MODAL_CTA_LABEL,
} from "@/lib/constants";

type HomepageWhyLitBuyProps = {
  location?: string;
};

export default function HomepageWhyLitBuy({
  location = "homepage_why_litbuy",
}: HomepageWhyLitBuyProps) {
  return (
    <section className="px-3 py-2.5 sm:px-6 sm:py-6">
      <div className="signup-card mx-auto max-w-7xl rounded-2xl border border-border p-5 sm:rounded-3xl sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
              LitBuy account
            </p>
            <h2 className="mt-2 text-2xl font-black text-foreground sm:text-3xl">
              Why Create a LitBuy Account?
            </h2>
            <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
              {LITBUY_ACCOUNT_BENEFITS.map((benefit) => (
                <li
                  key={benefit}
                  className="flex items-start gap-2.5 text-sm text-foreground/90"
                >
                  <span className="mt-0.5 text-accent" aria-hidden>
                    ✓
                  </span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex shrink-0 flex-col items-stretch gap-3 sm:items-center lg:items-end">
            <RegisterLink
              location={location}
              className="inline-flex items-center justify-center rounded-full bg-accent px-8 py-3.5 text-sm font-black text-background transition hover:bg-accent-hover"
            >
              {REGISTER_MODAL_CTA_LABEL}
            </RegisterLink>
            <p className="text-center text-xs text-muted lg:text-right">
              Free to join · Verified links · QC access
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
