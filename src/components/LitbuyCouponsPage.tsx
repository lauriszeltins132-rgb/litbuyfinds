import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import RegisterLink from "@/components/RegisterLink";
import SchemaScript from "@/components/SchemaScript";
import {
  LITBUY_COUPONS_CTA,
  LITBUY_COUPONS_FAQS,
  LITBUY_COUPONS_INTERNAL_LINKS,
  LITBUY_COUPONS_METADATA,
  LITBUY_COUPONS_OFFER,
  LITBUY_COUPONS_PATH,
  LITBUY_COUPONS_TRUST_SIGNALS,
  LITBUY_INVITE_CODE,
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
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Community coupon and shipping updates are also posted in the{" "}
              <Link href="/litbuy-discord" className="font-semibold text-accent hover:underline">
                LitBuy Discord
              </Link>
              .
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-accent/35 bg-background/70 px-5 py-4 text-center">
                <p className="text-3xl font-black tracking-tight text-accent sm:text-4xl">
                  {LITBUY_COUPONS_OFFER.welcomePack}
                </p>
                <p className="mt-1 text-xs font-bold uppercase tracking-wide text-muted">
                  {LITBUY_COUPONS_OFFER.welcomePackLabel}
                </p>
              </div>
              <div className="rounded-2xl border border-accent/35 bg-background/70 px-5 py-4 text-center">
                <p className="text-3xl font-black tracking-tight text-accent sm:text-4xl">
                  {LITBUY_COUPONS_OFFER.shippingDiscount}
                </p>
                <p className="mt-1 text-xs font-bold uppercase tracking-wide text-muted">
                  {LITBUY_COUPONS_OFFER.shippingDiscountLabel}
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm font-semibold text-foreground">
              {LITBUY_COUPONS_OFFER.headline}
            </p>
            <p className="mt-1 text-xs text-muted">{LITBUY_COUPONS_OFFER.disclaimer}</p>
            <p className="mt-3 text-sm font-bold text-foreground">
              LitBuy coupon / invite code:{" "}
              <span className="rounded-md bg-accent/15 px-2 py-0.5 font-black text-accent">
                {LITBUY_INVITE_CODE}
              </span>
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

          {/* What are LitBuy coupons */}
          <section className="mt-12">
            <h2 className="text-xl font-black text-foreground">
              What are LitBuy coupons?
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted">
              LitBuy coupons are registration and checkout discounts for shoppers
              who buy Weidian and Taobao finds through the LitBuy agent. The main
              offer tracked on this LitBuy coupons page is a new-user welcome pack
              (up to $500 in account coupons) plus international shipping savings
              when you register through our verified link. Product prices on{" "}
              <Link href="/litbuy-finds" className="font-semibold text-accent hover:underline">
                LitBuy Finds
              </Link>{" "}
              stay separate — coupons mainly reduce fees and freight on your haul.
            </p>
          </section>

          {/* How coupon codes work */}
          <section className="mt-12">
            <h2 className="text-xl font-black text-foreground">
              How LitBuy coupon codes work
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted">
              Most value comes from registering with a verified referral / invite
              link rather than pasting random blog codes. After signup, welcome
              coupons land in your LitBuy wallet and shipping discounts apply when
              you submit an international parcel. Always confirm the live total on
              LitBuy checkout — if a third-party “promo code” does not appear, it
              is usually expired.
            </p>
            <p className="mt-3 text-base leading-relaxed text-muted">
              Prefer browsing first? Open the{" "}
              <Link href="/litbuy-spreadsheet" className="font-semibold text-accent hover:underline">
                LitBuy Spreadsheet
              </Link>{" "}
              hub or{" "}
              <Link href="/latest-finds" className="font-semibold text-accent hover:underline">
                Latest LitBuy finds
              </Link>
              , shortlist products, then claim the coupon before you pay shipping.
            </p>
          </section>

          {/* Shipping discounts */}
          <section className="mt-12">
            <h2 className="text-xl font-black text-foreground">
              LitBuy shipping discounts
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted">
              Eligible new accounts can unlock up to{" "}
              <strong className="text-foreground">40% off international shipping</strong>{" "}
              through the registration offer on this page. Final freight still
              depends on weight, volumetric size, line, and destination — so treat
              the percentage as a checkout discount, not a flat fee. Pair the
              shipping coupon with lighter finds when testing your first haul, and
              see our{" "}
              <Link href="/how-to-save-on-shipping" className="font-semibold text-accent hover:underline">
                shipping savings guide
              </Link>{" "}
              for haul tips.
            </p>
          </section>

          {/* Agent coupon updates */}
          <section className="mt-12">
            <h2 className="text-xl font-black text-foreground">
              Agent coupon updates
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted">
              LitBuy promotions can change by season and account type. We refresh
              this LitBuy coupons hub when catalog sync runs and when community
              reports show a change at checkout. Active rows stay in the comparison
              table; expired offers are removed so shoppers are not sent to dead
              codes. For community shipping and coupon chatter, check the{" "}
              <Link href="/litbuy-discord" className="font-semibold text-accent hover:underline">
                LitBuy Discord
              </Link>{" "}
              page as well.
            </p>
          </section>

          {/* Current working coupon */}
          <section className="mt-12">
            <h2 className="text-xl font-black text-foreground">
              Current working LitBuy coupon
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted">
              Register a new LitBuy account through the button below to claim the
              working LitBuy coupon — up to{" "}
              <strong className="text-foreground">$500 in welcome coupons</strong>{" "}
              plus{" "}
              <strong className="text-foreground">40% off international shipping</strong>.
              This is the verified referral offer we check on LitBuy checkout, not a
              third-party code generator.
            </p>
            <div className="mt-5 rounded-2xl border border-accent/30 bg-accent/5 p-5">
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <p className="text-2xl font-black text-accent sm:text-3xl">
                  {LITBUY_COUPONS_OFFER.welcomePack}
                </p>
                <p className="text-2xl font-black text-accent sm:text-3xl">
                  {LITBUY_COUPONS_OFFER.shippingDiscount}
                </p>
              </div>
              <p className="mt-2 text-lg font-black text-foreground">
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
                Add items to your cart and confirm the{" "}
                <strong className="text-foreground">$500 coupon pack</strong> and{" "}
                <strong className="text-foreground">40% shipping discount</strong>{" "}
                appear at checkout before you pay.
              </li>
            </ol>
          </section>

          {/* Benefits */}
          <section className="mt-12">
            <h2 className="text-xl font-black text-foreground">Coupon benefits</h2>
            <ul className="mt-4 space-y-2 text-base leading-relaxed text-muted">
              <li>
                Up to <strong className="text-foreground">$500 in LitBuy welcome coupons</strong>{" "}
                on eligible new accounts
              </li>
              <li>
                Up to <strong className="text-foreground">40% off international shipping</strong>{" "}
                when you register through this LitBuy coupon link
              </li>
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
              Product prices on LitBuy Finds are separate from coupons. For many
              hauls, international freight is a significant line item — the LitBuy
              shipping coupon (up to 40% off) plus the welcome coupon pack (up to
              $500) can reduce your first haul cost. Savings vary by weight,
              destination, and shipping line. Confirm totals on LitBuy before paying.
            </p>
          </section>

          {/* Why LitBuy Finds */}
          <section className="mt-12">
            <h2 className="text-xl font-black text-foreground">
              Why use LitBuy Finds coupons?
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted">
              LitBuy Finds pairs verified LitBuy coupon links with a searchable catalog
              of real products — spreadsheet finds, QC references, category
              browsing, and LitBuy AI. Claim the $500 welcome coupons and shipping
              discount once, then discover items worth buying without hunting expired
              LitBuy promo codes on random blogs.
            </p>
            <div className="mt-6 rounded-2xl border border-accent/25 bg-accent/5 p-5">
              <p className="text-sm font-bold text-foreground">
                Ready to claim your LitBuy coupon?
              </p>
              <p className="mt-1 text-sm text-muted">
                {LITBUY_COUPONS_OFFER.headline} — free registration through our
                verified link.
              </p>
              <RegisterLink
                location="litbuy_coupons_footer"
                className="mt-4 inline-flex rounded-full bg-accent px-6 py-3 text-sm font-bold text-background hover:opacity-90"
              >
                {LITBUY_COUPONS_CTA.label}
              </RegisterLink>
            </div>
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
