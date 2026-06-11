import Link from "next/link";

const STEPS = [
  {
    step: "1",
    title: "Browse finds",
    description: "Explore categories, trending picks, and recently added products.",
    href: "/#browse",
  },
  {
    step: "2",
    title: "Open QC photos",
    description: "Check quality references before you buy when a QC link is available.",
    href: "/guides/how-to-check-qc-photos",
  },
  {
    step: "3",
    title: "Click the LitBuy link",
    description: "Open the verified listing on LitBuy from any product page.",
    href: "/guides/how-litbuy-works",
  },
  {
    step: "4",
    title: "Register or log in",
    description: "Create a LitBuy account or sign in to your existing one.",
    href: "/guides/beginner-guide-to-litbuy",
  },
  {
    step: "5",
    title: "Add item to cart",
    description: "Confirm size and color, then purchase through LitBuy.",
    href: "/guides/how-to-order",
  },
  {
    step: "6",
    title: "Ship your haul",
    description: "Review warehouse QC and bundle items into one shipment.",
    href: "/guides/shipping-and-hauls",
  },
] as const;

type HowItWorksProps = {
  compact?: boolean;
};

export default function HowItWorks({ compact = false }: HowItWorksProps) {
  return (
    <section className={`px-4 sm:px-6 ${compact ? "py-6" : "pb-12"}`}>
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
              How it works
            </p>
            <h2 className="mt-2 text-2xl font-black sm:text-3xl">
              How LitBuy Finds works
            </h2>
            {!compact && (
              <p className="mt-2 max-w-2xl text-sm text-muted">
                Six steps from discovery to delivery. New here?{" "}
                <Link href="/guides/beginner-guide-to-litbuy" className="font-bold text-accent hover:underline">
                  Read the beginner guide
                </Link>
                .
              </p>
            )}
          </div>
          {!compact && (
            <Link
              href="/guides"
              className="rounded-full border border-border px-4 py-2 text-sm font-bold text-muted hover:border-accent/40 hover:text-accent"
            >
              All guides →
            </Link>
          )}
        </div>

        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((item) => (
            <li key={item.step}>
              <Link
                href={item.href}
                className="panel-shell flex h-full flex-col rounded-2xl border border-border p-5 transition hover:border-accent/25"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-accent/30 bg-accent/10 text-sm font-black text-accent">
                  {item.step}
                </span>
                <h3 className="mt-4 font-black text-foreground">{item.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                  {item.description}
                </p>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
