import Link from "next/link";
import type { BrandInfo } from "@/lib/brands";
import type { CategoryInfo } from "@/lib/types";

type CategorySeoBlockProps = {
  categoryName: string;
  intro: string;
  brands: BrandInfo[];
  relatedCategories: CategoryInfo[];
};

const BUYING_TIPS: Record<string, string[]> = {
  shoes: [
    "Compare size charts per batch — EU and US sizing varies.",
    "Request QC for pairs over $50; check toe box and midsole shape.",
    "Stick to trending sellers when you are unsure about quality.",
  ],
  default: [
    "Open QC photos when available before shipping internationally.",
    "Combine multiple items in one parcel to save on shipping.",
    "Filter by price and brand to narrow a large category quickly.",
  ],
};

export default function CategorySeoBlock({
  categoryName,
  intro,
  brands,
  relatedCategories,
}: CategorySeoBlockProps) {
  const slug = categoryName.toLowerCase();
  const tips =
    BUYING_TIPS[slug.includes("shoe") ? "shoes" : "default"] ??
    BUYING_TIPS.default;

  return (
    <section className="px-4 pb-6 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-2xl border border-border bg-surface/40 p-6">
          <h2 className="text-lg font-black">What&apos;s in {categoryName}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">{intro}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-border bg-surface/30 p-5">
            <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-muted">
              Popular brands
            </h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {brands.slice(0, 8).map((brand) => (
                <li key={brand.slug}>
                  <Link
                    href={`/brands/${brand.slug}`}
                    className="rounded-full border border-border px-3 py-1 text-xs font-bold hover:border-accent/40 hover:text-accent"
                  >
                    {brand.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-surface/30 p-5">
            <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-muted">
              Buying tips
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              {tips.map((tip) => (
                <li key={tip} className="flex gap-2">
                  <span className="text-accent">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-surface/30 p-5">
            <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-muted">
              Related categories
            </h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {relatedCategories.slice(0, 6).map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={cat.href}
                    className="rounded-full border border-border px-3 py-1 text-xs font-bold hover:border-accent/40 hover:text-accent"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
