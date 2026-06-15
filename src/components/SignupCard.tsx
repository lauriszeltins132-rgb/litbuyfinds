import Link from "next/link";
import RegisterLink from "@/components/RegisterLink";
import {
  BROWSE_FINDS_CTA_LABEL,
  LITBUY_ACCOUNT_BENEFITS,
  REGISTER_MODAL_CTA_LABEL,
} from "@/lib/constants";

type SignupCardVariant = "intro" | "ready" | "compact";

type SignupCardProps = {
  location: string;
  variant?: SignupCardVariant;
};

export default function SignupCard({
  location,
  variant = "ready",
}: SignupCardProps) {
  const benefitList = (
    <ul className="space-y-2">
      {LITBUY_ACCOUNT_BENEFITS.slice(0, 4).map((benefit) => (
        <li
          key={benefit}
          className="flex items-start gap-2 text-sm text-foreground/90"
        >
          <span className="text-accent" aria-hidden>
            ✓
          </span>
          {benefit}
        </li>
      ))}
    </ul>
  );

  if (variant === "compact") {
    return (
      <section className="px-3 py-2.5 sm:px-6 sm:py-6">
        <div className="signup-card mx-auto max-w-7xl rounded-2xl border border-border bg-surface/45 p-4 sm:rounded-3xl sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-md">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">
                LitBuy benefits
              </p>
              <div className="mt-3">{benefitList}</div>
            </div>
            <div className="flex flex-col gap-2 sm:items-end">
              <RegisterLink
                location={location}
                className="inline-flex shrink-0 items-center justify-center rounded-full bg-accent px-5 py-2.5 text-xs font-black text-background hover:bg-accent-hover sm:px-8 sm:py-3.5 sm:text-sm"
              >
                {REGISTER_MODAL_CTA_LABEL}
              </RegisterLink>
              <Link
                href="/#browse"
                className="inline-flex shrink-0 items-center justify-center rounded-full border border-border-strong px-5 py-2.5 text-xs font-bold text-foreground hover:border-accent/40 hover:text-accent sm:px-6 sm:py-3.5 sm:text-sm"
              >
                {BROWSE_FINDS_CTA_LABEL}
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-3 py-2.5 sm:px-6 sm:py-6">
      <div className="signup-card mx-auto max-w-7xl rounded-2xl border border-border bg-surface/45 p-4 sm:rounded-3xl sm:p-8">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">
              Why LitBuy
            </p>
            <h2 className="mt-2 text-xl font-black sm:text-2xl">
              Unlock QC, tracking &amp; verified links
            </h2>
            <div className="mt-4">{benefitList}</div>
          </div>
          <div className="flex flex-col gap-3">
            <RegisterLink
              location={location}
              className="inline-flex w-full items-center justify-center rounded-full bg-accent px-6 py-3.5 text-sm font-black text-background hover:bg-accent-hover"
            >
              {REGISTER_MODAL_CTA_LABEL}
            </RegisterLink>
            <Link
              href="/#browse"
              className="inline-flex w-full items-center justify-center rounded-full border border-border-strong px-6 py-3 text-sm font-bold text-foreground hover:border-accent/40 hover:text-accent"
            >
              {BROWSE_FINDS_CTA_LABEL}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
