import Link from "next/link";
import SchemaScript from "@/components/SchemaScript";
import type { BrandInfo } from "@/lib/brands";
import { buildFaqSchema } from "@/lib/schema";
import { FINDS_DATABASE_HUB_LINKS } from "@/lib/finds-authority";
import {
  getCategoryFaqs,
  getCategoryRelatedGuides,
} from "@/lib/seo-content";
import type { CategoryInfo } from "@/lib/types";

type CategorySeoBlockProps = {
  categorySlug: string;
  categoryName: string;
  intro: string;
  brands: BrandInfo[];
  relatedCategories: CategoryInfo[];
};

const BUYING_TIPS: Record<string, string[]> = {
  shoes: [
    "Compare size charts per batch — EU and US sizing varies.",
    "Request QC for pairs over $50; check toe box and midsole shape.",
    "Stick to listings with clear photos when you are unsure about a seller.",
  ],
  "hoodies-and-pants": [
    "Check print placement and drawstrings on graphic hoodies.",
    "Compare measurements to a hoodie you already own.",
    "Bundle hoodies with other items to lower shipping cost per piece.",
  ],
  "coats-and-jackets": [
    "Puffers are bulky — factor volumetric weight into shipping.",
    "Check badge and zipper photos in QC when available.",
    "Winter pieces sell fast — compare recently added before you decide.",
  ],
  accessories: [
    "Hardware and logo alignment matter on bags and belts.",
    "Open QC references on the product page when listed.",
    "Smaller items are good for filling out a haul.",
  ],
  electronics: [
    "Read listing specs carefully — model numbers vary by batch.",
    "Check return policy on LitBuy before you buy fragile tech.",
    "Consider insurance on higher-value electronics shipments.",
  ],
  default: [
    "Open QC photos when available before shipping internationally.",
    "Combine multiple items in one parcel to save on shipping.",
    "Filter by price and brand to narrow a large category quickly.",
  ],
};

export default function CategorySeoBlock({
  categorySlug,
  categoryName,
  intro,
  brands,
  relatedCategories,
}: CategorySeoBlockProps) {
  const tipsKey = categorySlug.includes("shoe")
    ? "shoes"
    : categorySlug in BUYING_TIPS
      ? categorySlug
      : "default";
  const tips = BUYING_TIPS[tipsKey] ?? BUYING_TIPS.default;
  const relatedGuides = getCategoryRelatedGuides(categorySlug);
  const faqs = getCategoryFaqs(categorySlug);

  return (
    <section className="px-4 pb-6 sm:px-6">
      <SchemaScript data={buildFaqSchema(faqs)} />
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-2xl border border-border bg-surface/40 p-6">
          <h2 className="text-lg font-black">What&apos;s in {categoryName}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">{intro}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-border bg-surface/30 p-5 md:col-span-2 lg:col-span-4">
            <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-muted">
              Discovery database hubs
            </h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {FINDS_DATABASE_HUB_LINKS.slice(0, 8).map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="rounded-full border border-border px-3 py-1 text-xs font-bold hover:border-accent/40 hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

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

          <div className="rounded-2xl border border-border bg-surface/30 p-5">
            <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-muted">
              Best-of pages
            </h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              <li>
                <Link href="/best-finds" className="rounded-full border border-border px-3 py-1 text-xs font-bold hover:border-accent/40 hover:text-accent">
                  Best finds
                </Link>
              </li>
              <li>
                <Link href={`/best-${categorySlug === "shoes" ? "sneakers" : categorySlug === "coats-and-jackets" ? "jackets" : categorySlug === "hoodies-and-pants" ? "hoodies" : "accessories"}`} className="rounded-full border border-border px-3 py-1 text-xs font-bold hover:border-accent/40 hover:text-accent">
                  Best in category
                </Link>
              </li>
              <li>
                <Link href="/best-under-50" className="rounded-full border border-border px-3 py-1 text-xs font-bold hover:border-accent/40 hover:text-accent">
                  Under $50
                </Link>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-surface/30 p-5">
            <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-muted">
              Related guides
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              {relatedGuides.map((guide) => (
                <li key={guide.href}>
                  <Link
                    href={guide.href}
                    className="font-semibold text-muted hover:text-accent"
                  >
                    {guide.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface/30 p-6">
          <h2 className="text-lg font-black">Common questions</h2>
          <dl className="mt-4 space-y-4">
            {faqs.map((faq) => (
              <div key={faq.question}>
                <dt className="font-bold text-foreground">{faq.question}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-muted">
                  {faq.answer}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
