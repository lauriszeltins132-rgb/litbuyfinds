import Link from "next/link";
import SchemaScript from "@/components/SchemaScript";
import { getBrandAuthority } from "@/lib/brand-authority-content";
import { buildFaqSchema } from "@/lib/schema";
import { getBrandFaqs, getBrandRelatedGuides } from "@/lib/seo-content";

type BrandSeoCollapsibleProps = {
  brandSlug: string;
  brandName: string;
  intro: string;
};

const BRAND_TIPS: Record<string, string> = {
  nike: "Watch swoosh placement and toe box height on Dunks and Air Max batches.",
  jordan: "Compare wings logo embossing and hourglass shape on Jordan 1 highs.",
  adidas: "Check stripe alignment on Campus and Samba styles.",
  "louis-vuitton": "Review monogram alignment and hardware on bags before shipping.",
  gucci: "Compare GG pattern spacing and zipper pulls on bags and belts.",
  moncler: "Check badge stitching and puff distribution on outerwear.",
  supreme: "Look at box logo symmetry and tag photos in QC.",
  "chrome-hearts": "Inspect cross motif engraving and hardware weight in QC photos.",
  default:
    "Filter by price, open QC when available, and compare photos to listing references before shipping.",
};

export default function BrandSeoCollapsible({
  brandSlug,
  brandName,
  intro,
}: BrandSeoCollapsibleProps) {
  const authority = getBrandAuthority(brandSlug);
  const tip = authority?.buyingTips[0] ?? BRAND_TIPS[brandSlug] ?? BRAND_TIPS.default;
  const relatedGuides = getBrandRelatedGuides(brandSlug);
  const baseFaqs = getBrandFaqs(brandSlug, brandName);
  const faqs = authority
    ? [
        ...authority.faqs,
        ...baseFaqs.filter((f) => !authority.faqs.some((a) => a.question === f.question)),
      ]
    : baseFaqs;

  const preview =
    authority?.whyPopular?.[0] && authority.whyPopular[0].length < 220
      ? `${intro} ${authority.whyPopular[0]}`.trim()
      : intro;

  return (
    <section className="px-4 pb-6 sm:px-6">
      <SchemaScript data={buildFaqSchema(faqs)} />
      <div className="mx-auto max-w-7xl space-y-6">
        <details className="group rounded-2xl border border-border bg-surface/30 p-6">
          <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
            <h2 className="text-lg font-black">About {brandName}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted group-open:hidden">
              {preview}
            </p>
            <span className="mt-3 inline-block text-sm font-bold text-accent group-open:hidden">
              Read more
            </span>
          </summary>

          <div className="mt-4 space-y-6 border-t border-border pt-6">
            <p className="text-sm leading-relaxed text-muted">{intro}</p>

            {authority?.whyPopular.map((paragraph) => (
              <p key={paragraph} className="text-sm leading-relaxed text-muted">
                {paragraph}
              </p>
            ))}

            {authority?.sections.map((section) => (
              <div key={section.heading}>
                <h3 className="text-base font-bold text-foreground">{section.heading}</h3>
                <div className="mt-2 space-y-2 text-sm leading-relaxed text-muted">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                {section.links && section.links.length > 0 ? (
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {section.links.map((link) => (
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
                ) : null}
              </div>
            ))}

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-border bg-surface/40 p-4">
                <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-muted">
                  Buying tips
                </h3>
                <ul className="mt-3 space-y-2 text-sm text-muted">
                  {(authority?.buyingTips ?? [tip]).map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="text-accent">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-border bg-surface/40 p-4">
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
          </div>
        </details>

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
