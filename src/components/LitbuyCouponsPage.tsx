import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import RegisterLink from "@/components/RegisterLink";
import SchemaScript from "@/components/SchemaScript";
import {
  LITBUY_COUPONS_CTA,
  LITBUY_COUPONS_FAQS,
  LITBUY_COUPONS_INTERNAL_LINKS,
  LITBUY_COUPONS_METADATA,
  LITBUY_COUPONS_PATH,
  LITBUY_COUPONS_TRUST_SIGNALS,
  getLitbuyCouponRows,
  getLitbuyCouponsLastUpdated,
} from "@/lib/litbuy-coupons-page";
import {
  buildAgentCouponWebPageSchema,
  buildBreadcrumbSchema,
  buildFaqSchema,
} from "@/lib/schema";

export default function LitbuyCouponsPage() {
  const lastUpdated = getLitbuyCouponsLastUpdated();
  const couponRows = getLitbuyCouponRows();
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: LITBUY_COUPONS_METADATA.h1 },
  ];

  return (
    <>
      <SchemaScript
        data={buildAgentCouponWebPageSchema({
          name: LITBUY_COUPONS_METADATA.h1,
          description: LITBUY_COUPONS_METADATA.description,
          path: LITBUY_COUPONS_PATH,
          couponUrl: LITBUY_COUPONS_CTA.url,
          offerHeadline: LITBUY_COUPONS_CTA.headline,
          offerDescription: LITBUY_COUPONS_CTA.description,
        })}
      />
      <SchemaScript data={buildBreadcrumbSchema(breadcrumbs, LITBUY_COUPONS_PATH)} />
      <SchemaScript data={buildFaqSchema([...LITBUY_COUPONS_FAQS])} />

      <Breadcrumbs items={breadcrumbs} currentPath={LITBUY_COUPONS_PATH} />

      <article className="px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-3xl">
          {/* Hero — Best LitBuy Coupon */}
          <section className="overflow-hidden rounded-3xl border border-accent/25 bg-gradient-to-br from-accent/10 via-surface to-background p-6 sm:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
              Best LitBuy coupon
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              {LITBUY_COUPONS_METADATA.h1}
            </h1>
            <p className="mt-5 text-base leading-relaxed text-foreground">
              {LITBUY_COUPONS_METADATA.heroIntro}
            </p>
            <p className="mt-3 text-sm text-muted">
              Last updated:{" "}
              <time dateTime={lastUpdated}>{lastUpdated}</time>
            </p>
            <div className="mt-8">
              <RegisterLink
                location="litbuy_coupons_hero"
                className="inline-flex items-center justify-center rounded-full bg-accent px-8 py-4 text-sm font-black text-background transition hover:opacity-90"
              >
                {LITBUY_COUPONS_CTA.label}
              </RegisterLink>
            </div>
          </section>

          {/* Trust signals */}
          <ul className="mt-6 grid gap-2 sm:grid-cols-2">
            {LITBUY_COUPONS_TRUST_SIGNALS.map((signal) => (
              <li
                key={signal}
                className="flex items-start gap-2 rounded-xl border border-border/80 bg-surface/30 px-4 py-3 text-sm text-muted"
              >
                <span className="text-accent" aria-hidden>
                  ✓
                </span>
                {signal}
              </li>
            ))}
          </ul>

          {/* Current working coupon */}
          <section className="mt-12">
            <h2 className="text-xl font-black text-foreground">
              Current working LitBuy coupon
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted">
              Register a new LitBuy account through the button below to unlock the
              current new-user shipping discount. This is the same referral offer
              we verify on LitBuy checkout — not a third-party code generator.
            </p>
            <div className="mt-5 rounded-2xl border border-accent/30 bg-accent/5 p-5">
              <p className="text-lg font-black text-foreground">
                {LITBUY_COUPONS_CTA.headline}
              </p>
              <p className="mt-2 text-sm text-muted">
                {LITBUY_COUPONS_CTA.description}
              </p>
              <RegisterLink
                location="litbuy_coupons_current"
                className="mt-4 inline-flex rounded-full bg-accent px-6 py-3 text-sm font-bold text-background hover:opacity-90"
              >
                Open LitBuy registration →
              </RegisterLink>
            </div>
          </section>

          {/* Comparison table */}
          <section className="mt-12">
            <h2 className="text-xl font-black text-foreground">
              LitBuy coupon comparison
            </h2>
            <div className="mt-4 overflow-x-auto rounded-2xl border border-border">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface/40">
                    <th className="px-4 py-3 font-bold text-foreground">Coupon</th>
                    <th className="px-4 py-3 font-bold text-foreground">Discount</th>
                    <th className="px-4 py-3 font-bold text-foreground">Status</th>
                    <th className="px-4 py-3 font-bold text-foreground">Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {couponRows.map((row) => (
                    <tr key={row.coupon} className="border-b border-border/60 last:border-0">
                      <td className="px-4 py-3 text-foreground">{row.coupon}</td>
                      <td className="px-4 py-3 text-muted">{row.discount}</td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-accent/15 px-2 py-0.5 text-xs font-bold text-accent">
                          {row.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted">{row.updated}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* How to claim */}
          <section className="mt-12">
            <h2 className="text-xl font-black text-foreground">
              How to claim the coupon
            </h2>
            <ol className="mt-4 list-decimal space-y-3 pl-5 text-base leading-relaxed text-muted">
              <li>
                Click <strong className="text-foreground">Claim LitBuy Coupon</strong>{" "}
                on this page to open the official LitBuy registration screen.
              </li>
              <li>Create your free LitBuy account and complete signup.</li>
              <li>
                Browse finds on{" "}
                <Link href="/litbuy-finds" className="font-semibold text-accent hover:underline">
                  LitBuy Finds
                </Link>{" "}
                or search with{" "}
                <Link href="/ai" className="font-semibold text-accent hover:underline">
                  LitBuy AI
                </Link>
                .
              </li>
              <li>
                Add items to your cart and confirm the shipping discount or
                promotion appears at checkout before you pay.
              </li>
            </ol>
          </section>

          {/* Benefits */}
          <section className="mt-12">
            <h2 className="text-xl font-black text-foreground">Coupon benefits</h2>
            <ul className="mt-4 space-y-2 text-base leading-relaxed text-muted">
              <li>Lower international shipping on eligible new-user promotions</li>
              <li>Full warehouse QC photo access after you order</li>
              <li>Verified buy links from the LitBuy Finds catalog</li>
              <li>Order tracking and saved finds across devices</li>
            </ul>
          </section>

          {/* Coupon vs referral */}
          <section className="mt-12">
            <h2 className="text-xl font-black text-foreground">
              Coupon vs referral code
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted">
              A <strong className="text-foreground">referral code</strong> (invite
              code) is entered or embedded when you register — it links your
              account to a referrer and can unlock welcome credits. A{" "}
              <strong className="text-foreground">coupon</strong> is typically
              applied at checkout for shipping or service fees. LitBuy often
              bundles registration benefits with referral links, so one verified
              signup URL covers both for new users.
            </p>
          </section>

          {/* Expiry */}
          <section className="mt-12">
            <h2 className="text-xl font-black text-foreground">
              Does the coupon expire?
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted">
              LitBuy promotions can change by season, region, and account type.
              We update the table above when we re-check the offer. If checkout
              does not show the expected discount, do not assume the code is
              still valid — check LitBuy&apos;s live promotions page instead.
            </p>
          </section>

          {/* Savings */}
          <section className="mt-12">
            <h2 className="text-xl font-black text-foreground">
              How much can you save?
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted">
              Product prices on LitBuy Finds are separate from shipping. For many
              hauls, international freight is a significant line item — a
              shipping discount on registration can reduce that cost on your
              first parcel. Savings vary by weight, destination, and shipping
              line. We do not guarantee a fixed dollar amount; confirm totals on
              LitBuy before paying.
            </p>
          </section>

          {/* Why LitBuy Finds */}
          <section className="mt-12">
            <h2 className="text-xl font-black text-foreground">
              Why use LitBuy Finds coupons?
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted">
              LitBuy Finds pairs verified coupon links with a searchable catalog
              of real products — spreadsheet finds, QC references, category
              browsing, and LitBuy AI. You claim the offer once, then discover
              items worth buying without hunting expired codes on random blogs.
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {LITBUY_COUPONS_INTERNAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:border-accent hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* FAQ */}
          <section className="mt-12 border-t border-border pt-10">
            <h2 className="text-xl font-black text-foreground">
              Frequently asked questions
            </h2>
            <dl className="mt-6 space-y-6">
              {LITBUY_COUPONS_FAQS.map((faq) => (
                <div key={faq.question}>
                  <dt className="font-bold text-foreground">{faq.question}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-muted">
                    {faq.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </article>
    </>
  );
}
