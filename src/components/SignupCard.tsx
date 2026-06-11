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
    eyebrow: "New to LitBuy?",
    title: "Create a free account to start ordering",
    body: "Access products instantly, save finds for later, build your haul, and order through LitBuy with verified agent checkout.",
    cta: "Create Free Account",
  },
  ready: {
    eyebrow: "Ready to start?",
    title: "Create your free LitBuy account",
    body: "Start building your haul today — browse finds here, then checkout on LitBuy when you are ready.",
    cta: "Create Free Account",
  },
  compact: {
    eyebrow: "Next step",
    title: "Order through LitBuy",
    body: "Create a free account to open product links, review QC, and ship your haul.",
    cta: "Create Free Account",
  },
};

export default function SignupCard({
  location,
  variant = "ready",
}: SignupCardProps) {
  const copy = COPY[variant];

  return (
    <section className="px-4 py-6 sm:px-6">
      <div className="signup-card mx-auto max-w-7xl overflow-hidden rounded-3xl border border-border bg-surface/45 p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
              {copy.eyebrow}
            </p>
            <h2 className="mt-2 text-2xl font-black sm:text-3xl">{copy.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
              {copy.body}
            </p>
            {variant !== "compact" ? <SignupTrustProof /> : null}
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
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-accent px-8 py-4 text-sm font-black text-background transition hover:bg-accent-hover"
          >
            {copy.cta}
          </RegisterLink>
        </div>
      </div>
    </section>
  );
}
