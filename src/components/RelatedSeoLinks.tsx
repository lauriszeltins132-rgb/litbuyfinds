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

import { BEST_OF_SLUGS, BEST_OF_PAGES } from "@/lib/best-of-pages";

const BEST_OF_LINKS = BEST_OF_SLUGS.slice(0, 8).map((slug) => {
  const page = BEST_OF_PAGES[slug];
  return { href: page.path, label: page.title };
});

const GUIDE_LINKS = [
  { href: "/guides", label: "Guides" },
  { href: "/best-finds-by-category", label: "By category" },
  { href: "/most-popular-finds-now", label: "Popular now" },
  { href: "/best-qc-approved-finds", label: "QC approved" },
  { href: "/best-jordan-finds-2026", label: "Jordan 2026" },
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
          {BEST_OF_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full border border-border px-3 py-1.5 text-xs font-bold text-muted hover:border-accent/40 hover:text-accent"
            >
              {link.label}
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
