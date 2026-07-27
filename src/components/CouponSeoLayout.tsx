import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import CouponClaimLink from "@/components/CouponClaimLink";
import SchemaScript from "@/components/SchemaScript";
import {
  buildBreadcrumbSchema,
  buildCouponOfferSchema,
  buildFaqSchema,
} from "@/lib/schema";
import type { CouponSeoPageConfig } from "@/lib/coupon-seo-pages";

type CouponSeoLayoutProps = {
  config: CouponSeoPageConfig;
};

export default function CouponSeoLayout({ config }: CouponSeoLayoutProps) {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: `${config.agentName} Coupons` },
  ];
  const claimLabel = `Claim ${config.agentName} Offer`;

  return (
    <>
      <SchemaScript
        data={buildCouponOfferSchema({
          name: config.h1,
          description: config.metaDescription,
          path: config.path,
          agentName: config.agentName,
          agentUrl: config.signupUrl,
        })}
      />
      <SchemaScript data={buildBreadcrumbSchema(breadcrumbItems, config.path)} />
      <SchemaScript data={buildFaqSchema(config.faqs)} />

      <Breadcrumbs items={breadcrumbItems} currentPath={config.path} />

      <article className="px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <section className="overflow-hidden rounded-3xl border border-accent/20 bg-gradient-to-br from-accent/10 via-[#121214] to-[#0d1210] p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
              {config.badge}
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              {config.h1}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted">
              {config.intro}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <CouponClaimLink
                href={config.signupUrl}
                location={`coupon_seo_${config.slug}`}
                className="inline-flex items-center rounded-full bg-accent px-5 py-3 text-sm font-black text-background transition hover:bg-accent-hover"
              >
                {claimLabel}
              </CouponClaimLink>
              <span className="text-xs font-bold uppercase tracking-[0.12em] text-muted">
                Verified for 2026
              </span>
            </div>
          </section>

          <div className="mt-10 space-y-10">
            {config.sections.map((section) => {
              const Heading = section.level === 3 ? "h3" : "h2";
              return (
                <section key={section.heading}>
                  <Heading
                    className={
                      section.level === 3
                        ? "text-lg font-bold text-foreground"
                        : "text-xl font-black text-foreground"
                    }
                  >
                    {section.heading}
                  </Heading>
                  <div className="mt-3 space-y-3 text-base leading-relaxed text-muted">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                  {section.links && section.links.length > 0 ? (
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {section.links.map((link) => (
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
                  ) : null}
                </section>
              );
            })}
          </div>

          <section className="mt-12 rounded-2xl border border-border bg-surface/40 p-6">
            <h2 className="text-xl font-black">Frequently asked questions</h2>
            <dl className="mt-5 space-y-5">
              {config.faqs.map((faq) => (
                <div key={faq.question}>
                  <dt className="font-bold text-foreground">{faq.question}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-muted">
                    {faq.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="mt-10 overflow-hidden rounded-3xl border border-accent/25 bg-gradient-to-r from-accent/12 to-transparent p-6 text-center sm:p-8">
            <h2 className="text-2xl font-black text-foreground">
              Claim your {config.agentName} offer
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted">
              Tap below to open {config.agentName} with the current promo
              applied. Always confirm the discount at checkout.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <CouponClaimLink
                href={config.signupUrl}
                location={`coupon_seo_cta_${config.slug}`}
                className="inline-flex items-center rounded-full bg-accent px-5 py-3 text-sm font-black text-background transition hover:bg-accent-hover"
              >
                {claimLabel}
              </CouponClaimLink>
              <Link
                href={`/${config.agentSlug}-finds`}
                className="inline-flex items-center rounded-full border border-border px-4 py-2.5 text-sm font-bold text-foreground/85 hover:border-accent/40 hover:text-accent"
              >
                Browse {config.agentName} finds
              </Link>
            </div>
          </section>

          {config.relatedLinks.length > 0 ? (
            <section className="mt-10 border-t border-border pt-8">
              <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-muted">
                Related pages
              </h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {config.relatedLinks.map((link) => (
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
            </section>
          ) : null}
        </div>
      </article>
    </>
  );
}
