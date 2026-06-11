import Link from "next/link";

const TIPS = [
  {
    text: "New to LitBuy?",
    href: "/guides/beginner-guide-to-litbuy",
    label: "Read the beginner guide",
  },
  {
    text: "Not sure what QC means?",
    href: "/guides/how-to-check-qc-photos",
    label: "Learn how to check QC photos",
  },
  {
    text: "First time ordering?",
    href: "/guides/how-to-order",
    label: "See how to order",
  },
  {
    text: "Want fresh products?",
    href: "/recently-added",
    label: "View Recently Added",
  },
  {
    text: "Looking for popular products?",
    href: "/trending",
    label: "View Trending",
  },
] as const;

export default function EducationalTips() {
  return (
    <section className="px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl rounded-2xl border border-border bg-surface/35 p-5 sm:p-6">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">
          Helpful links
        </p>
        <ul className="mt-4 space-y-3">
          {TIPS.map((tip) => (
            <li key={tip.href} className="text-sm text-muted">
              {tip.text}{" "}
              <Link
                href={tip.href}
                className="font-bold text-accent hover:underline"
              >
                {tip.label}
              </Link>
              .
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
