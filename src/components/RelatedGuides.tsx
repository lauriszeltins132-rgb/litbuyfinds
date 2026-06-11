import Link from "next/link";

type RelatedGuidesProps = {
  title?: string;
  links: { href: string; label: string }[];
};

export default function RelatedGuides({
  title = "Related guides",
  links,
}: RelatedGuidesProps) {
  if (links.length === 0) return null;

  return (
    <section className="px-4 pb-6 sm:px-6">
      <div className="mx-auto max-w-7xl rounded-2xl border border-border bg-surface/35 p-5">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">
          {title}
        </p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="rounded-full border border-border px-3 py-1.5 text-xs font-bold text-muted transition hover:border-accent/40 hover:text-accent"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
