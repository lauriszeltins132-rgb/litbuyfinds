import Link from "next/link";
import { getContextualBestOfLinks } from "@/lib/best-of-pages";

type BestOfLinksProps = {
  categorySlug?: string;
  brandSlug?: string;
  maxPrice?: number;
  title?: string;
};

export default function BestOfLinks({
  categorySlug,
  brandSlug,
  maxPrice,
  title = "Best-of collections",
}: BestOfLinksProps) {
  const links = getContextualBestOfLinks({ categorySlug, brandSlug, maxPrice });
  if (links.length === 0) return null;

  return (
    <section className="px-4 pb-4 sm:px-6">
      <div className="mx-auto max-w-7xl rounded-2xl border border-border bg-surface/30 p-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">{title}</p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="rounded-full border border-border px-3 py-1.5 text-xs font-bold text-foreground/80 hover:border-accent/40 hover:text-accent"
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
