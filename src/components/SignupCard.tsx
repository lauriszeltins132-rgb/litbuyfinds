import Link from "next/link";
import RegisterLink from "@/components/RegisterLink";
import SignupTrustProof from "@/components/SignupTrustProof";

type SignupCardVariant = "intro" | "ready" | "compact";

type SignupCardProps = {
  location: string;
  variant?: SignupCardVariant;
};

const COPY: Record<
  SignupCardVariant,
  { eyebrow: string; title: string; body: string; cta: string }
> = {
  intro: {
    eyebrow: "Get started",
    title: "New to LitBuy?",
    body: "Create a free LitBuy account to open product links, check QC, and start building your haul.",
    cta: "Create Free LitBuy Account",
  },
  ready: {
    eyebrow: "Next step",
    title: "Ready to start browsing?",
    body: "Create a free LitBuy account and start building your haul.",
    cta: "Create Free LitBuy Account",
  },
  compact: {
    eyebrow: "Next step",
    title: "Order through LitBuy",
    body: "Create a free account to open product links, review QC, and ship your haul.",
    cta: "Create Free LitBuy Account",
  },
};

export default function SignupCard({
  location,
  variant = "ready",
}: SignupCardProps) {
  const copy = COPY[variant];

  return (
    <section className="px-3 py-2.5 sm:px-6 sm:py-6">
      <div className="signup-card mx-auto max-w-7xl overflow-hidden rounded-2xl border border-border bg-surface/45 p-4 sm:rounded-3xl sm:p-8">
        <div className="flex flex-col gap-4 sm:gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent sm:text-xs">
              {copy.eyebrow}
            </p>
            <h2 className="mt-1.5 text-lg font-black sm:mt-2 sm:text-3xl">{copy.title}</h2>
            <p className="mt-2 text-xs leading-relaxed text-muted sm:mt-3 sm:text-base">
              {copy.body}
            </p>
            {variant !== "compact" ? (
              <div className="hidden sm:block">
                <SignupTrustProof />
              </div>
            ) : null}
            {variant === "intro" ? (
              <p className="mt-4 text-sm text-muted">
                <Link
                  href="/guides/how-to-order-from-litbuy"
                  className="font-bold text-accent hover:underline"
                >
                  Learn how ordering works →
                </Link>
              </p>
            ) : null}
          </div>

          <RegisterLink
            location={location}
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-accent px-5 py-2.5 text-xs font-black text-background transition hover:bg-accent-hover sm:px-8 sm:py-4 sm:text-sm"
          >
            {copy.cta}
          </RegisterLink>
        </div>
      </div>
    </section>
  );
}
