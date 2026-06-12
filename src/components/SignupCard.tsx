import Link from "next/link";
import RegisterLink from "@/components/RegisterLink";
import PromoBanner from "@/components/PromoBanner";
import {
  BROWSE_FINDS_CTA_LABEL,
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
  if (variant === "compact") {
    return (
      <section className="px-3 py-2.5 sm:px-6 sm:py-6">
        <div className="signup-card mx-auto max-w-7xl overflow-hidden rounded-2xl border border-border bg-surface/45 p-4 sm:rounded-3xl sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <PromoBanner variant="card" className="sm:max-w-[220px] shrink-0" />
            <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
              <RegisterLink
                location={location}
                className="inline-flex shrink-0 items-center justify-center rounded-full bg-accent px-5 py-2.5 text-xs font-black text-background transition hover:bg-accent-hover sm:px-8 sm:py-3.5 sm:text-sm"
              >
                {REGISTER_MODAL_CTA_LABEL}
              </RegisterLink>
              <Link
                href="/#browse"
                className="inline-flex shrink-0 items-center justify-center rounded-full border border-border-strong px-5 py-2.5 text-xs font-bold text-foreground transition hover:border-accent/40 hover:text-accent sm:px-6 sm:py-3.5 sm:text-sm"
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
      <div className="signup-card mx-auto max-w-7xl overflow-hidden rounded-2xl border border-border bg-surface/45 p-4 sm:rounded-3xl sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_minmax(280px,420px)] lg:items-center">
          <div className="order-2 space-y-4 lg:order-1">
            <RegisterLink
              location={location}
              className="inline-flex w-full items-center justify-center rounded-full bg-accent px-6 py-3.5 text-sm font-black text-background transition hover:bg-accent-hover sm:w-auto sm:px-8 sm:py-4"
            >
              {REGISTER_MODAL_CTA_LABEL}
            </RegisterLink>
            <Link
              href="/#browse"
              className="inline-flex w-full items-center justify-center rounded-full border border-border-strong px-6 py-3 text-sm font-bold text-foreground transition hover:border-accent/40 hover:text-accent sm:w-auto sm:px-8 sm:py-3.5"
            >
              {BROWSE_FINDS_CTA_LABEL}
            </Link>
            {variant === "intro" ? (
              <p className="text-center text-sm text-muted sm:text-left">
                <Link
                  href="/guides/how-to-order-from-litbuy"
                  className="font-bold text-accent hover:underline"
                >
                  How ordering works →
                </Link>
              </p>
            ) : null}
          </div>

          <PromoBanner
            variant="card"
            priority={variant === "intro"}
            className="order-1 lg:order-2"
          />
        </div>
      </div>
    </section>
  );
}
