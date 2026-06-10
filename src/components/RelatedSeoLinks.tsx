import Link from "next/link";
import { COLLECTION_SLUGS, COLLECTIONS } from "@/lib/collections";
import { CATEGORY_ALIAS_SLUGS } from "@/lib/category-aliases";

const FEATURED_BRANDS = [
  "nike",
  "adidas",
  "jordan",
  "asics",
  "new-balance",
  "moncler",
  "supreme",
  "ralph-lauren",
];

const GUIDE_LINKS = [
  { href: "/recently-added", label: "Recently added" },
  { href: "/how-to-buy", label: "How to buy" },
  { href: "/best-rep-sneakers", label: "Best sneakers" },
  { href: "/best-budget-finds", label: "Budget finds" },
  { href: "/new-user-guide", label: "New user guide" },
];

export default function RelatedSeoLinks() {
  const collections = COLLECTION_SLUGS.filter((slug) => slug !== "trending")
    .slice(0, 5)
    .map((slug) => COLLECTIONS[slug]);

  return (
    <section className="px-4 pb-4 sm:px-6">
      <div className="mx-auto max-w-7xl rounded-2xl border border-border bg-surface/40 p-5">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">
          Explore more
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {collections.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full border border-border px-3 py-1.5 text-xs font-bold text-muted hover:border-accent/40 hover:text-accent"
            >
              {item.title}
            </Link>
          ))}
          {CATEGORY_ALIAS_SLUGS.map((slug) => (
            <Link
              key={slug}
              href={`/categories/${slug}`}
              className="rounded-full border border-border px-3 py-1.5 text-xs font-bold text-muted hover:border-accent/40 hover:text-accent"
            >
              {slug.charAt(0).toUpperCase() + slug.slice(1)}
            </Link>
          ))}
          {FEATURED_BRANDS.map((slug) => (
            <Link
              key={slug}
              href={`/brands/${slug}`}
              className="rounded-full border border-border px-3 py-1.5 text-xs font-bold text-muted hover:border-accent/40 hover:text-accent"
            >
              {slug.replace(/-/g, " ")}
            </Link>
          ))}
          {GUIDE_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full border border-border px-3 py-1.5 text-xs font-bold text-muted hover:border-accent/40 hover:text-accent"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
