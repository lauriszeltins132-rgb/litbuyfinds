import Link from "next/link";

const CARDS = [
  {
    title: "Beginner Guide",
    description: "Agents, LitBuy basics, and your first haul — start here.",
    href: "/guides/beginner-guide-to-litbuy",
  },
  {
    title: "How to Order",
    description: "From find to cart: account setup, QC, and shipping prep.",
    href: "/guides/how-to-order-from-litbuy",
  },
  {
    title: "QC Photos Explained",
    description: "What QC means and what to look for before you ship.",
    href: "/guides/what-are-qc-photos",
  },
] as const;

export default function NewToLitBuy() {
  return (
    <section className="px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl rounded-2xl border border-border bg-surface/35 p-6 sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">
              New to LitBuy?
            </p>
            <h2 className="mt-2 text-2xl font-black sm:text-3xl">
              Learn before you order
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Learn how agents, QC photos, and hauls work before you order.
            </p>
          </div>
          <Link
            href="/guides"
            className="rounded-full border border-border px-4 py-2 text-sm font-bold text-muted transition hover:border-accent/40 hover:text-accent"
          >
            View All Guides
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {CARDS.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group rounded-xl border border-border bg-background/40 p-5 transition hover:border-accent/30"
            >
              <h3 className="font-black text-foreground group-hover:text-accent">
                {card.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {card.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
