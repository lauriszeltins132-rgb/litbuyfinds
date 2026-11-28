import Link from "next/link";
import SmartLink from "@/components/SmartLink";
import Breadcrumbs from "@/components/Breadcrumbs";
import InviteFunnelLink from "@/components/InviteFunnelLink";
import InviteSignupPanel from "@/components/InviteSignupPanel";
import SchemaScript from "@/components/SchemaScript";
import {
  LITBUY_AUTHORITY_LINKS,
  LITBUY_HUB_FOOTER_LINKS,
} from "@/lib/litbuy-authority-hub";
import { LITBUY_COUPONS_OFFER } from "@/lib/litbuy-coupons-page";
import type { AuthorityPage } from "@/lib/litbuy-authority-pages";
import {
  buildArticleSchema,
  buildBreadcrumbSchema,
  buildFaqSchema,
} from "@/lib/schema";

type AuthorityPageLayoutProps = {
  page: AuthorityPage;
};

export default function AuthorityPageLayout({ page }: AuthorityPageLayoutProps) {
  const breadcrumbs = page.breadcrumbItems ?? [
    { label: "Home", href: "/" },
    ...(page.parentCrumb ? [page.parentCrumb] : []),
    { label: page.h1 },
  ];

  return (
    <>
      <SchemaScript data={buildBreadcrumbSchema(breadcrumbs, page.path)} />
      <SchemaScript
        data={buildArticleSchema({
          title: page.h1,
          description: page.metaDescription,
          path: page.path,
          datePublished: page.publishedTime,
          dateModified: page.modifiedTime,
        })}
      />
      {page.faqs && page.faqs.length > 0 ? (
        <SchemaScript data={buildFaqSchema(page.faqs)} />
      ) : null}

      <Breadcrumbs items={breadcrumbs} currentPath={page.path} />

      <article className="px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
            {page.badge}
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            {page.h1}
          </h1>
          {page.slug === "litbuy-invite-code" ? (
            <InviteSignupPanel
              headline={LITBUY_COUPONS_OFFER.headline}
              disclaimer={LITBUY_COUPONS_OFFER.disclaimer}
            />
          ) : null}
          <p className="mt-5 text-base leading-relaxed text-foreground">
            {page.directAnswer}
          </p>

          <aside
            className="mt-6 rounded-2xl border border-border bg-surface/40 p-4 sm:p-5"
            aria-label="Quick summary"
          >
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">
              Summary
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted">{page.summary}</p>
          </aside>

          {page.primaryCta ? (
            <div className="mt-6">
              <a
                href={page.primaryCta.href}
                target="_blank"
                rel="noopener noreferrer"
                className="community-btn community-btn--discord inline-flex items-center justify-center rounded-2xl px-6 py-3 text-sm font-bold text-white"
              >
                {page.primaryCta.label}
              </a>
            </div>
          ) : null}

          <div className="mt-10 space-y-10">
            {page.sections.map((section) => {
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
                          <SmartLink
                            href={link.href}
                            className="inline-flex rounded-full border border-border bg-panel px-3 py-1.5 text-xs font-semibold text-foreground hover:border-accent hover:text-accent"
                          >
                            {link.label}
                          </SmartLink>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              );
            })}
          </div>

          {page.slug === "is-litbuy-legit" ? (
            <aside className="mt-10 rounded-2xl border border-border bg-surface/40 p-4 sm:p-5">
              <h2 className="text-xl font-black text-foreground">
                Creating an account
              </h2>
              <p className="mt-3 text-base leading-relaxed text-muted">
                Registration happens on LitBuy. A new account can enter an invite
                code during signup. LitBuy Finds keeps the code, the field, and the
                signup steps on one page. You can also keep reading without
                registering.
              </p>
              <InviteFunnelLink
                href="/litbuy-invite-code"
                location="legit_page"
                className="mt-4 inline-flex text-sm font-bold text-accent hover:underline"
              >
                LitBuy invite code
              </InviteFunnelLink>
            </aside>
          ) : null}

          {page.slug === "litbuy-links" ? (
            <aside className="mt-10 rounded-2xl border border-border bg-surface/40 p-4 sm:p-5">
              <h2 className="text-lg font-black text-foreground">New to LitBuy?</h2>
              <p className="mt-3 text-base leading-relaxed text-muted">
                If you already have an account, open the product link and continue
                on LitBuy. If you still need an account, the invite page shows the
                code and the signup steps before you order.
              </p>
              <InviteFunnelLink
                href="/litbuy-invite-code"
                location="litbuy_links_page"
                className="mt-4 inline-flex text-sm font-bold text-accent hover:underline"
              >
                Create a LitBuy account
              </InviteFunnelLink>
            </aside>
          ) : null}

          {page.faqs && page.faqs.length > 0 ? (
            <section className="mt-12 border-t border-border pt-10">
              <h2 className="text-xl font-black text-foreground">FAQ</h2>
              <dl className="mt-5 space-y-6">
                {page.faqs.map((faq) => (
                  <div key={faq.question}>
                    <dt className="font-bold text-foreground">{faq.question}</dt>
                    <dd className="mt-1 text-sm leading-relaxed text-muted">
                      {faq.answer}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}

          <section className="mt-12 border-t border-border pt-10">
            <h2 className="text-xl font-black text-foreground">Related pages</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {(page.relatedLinks ?? LITBUY_AUTHORITY_LINKS).map((link) => (
                <li key={link.href}>
                  <SmartLink
                    href={link.href}
                    className="inline-flex rounded-full border border-border bg-panel px-3 py-1.5 text-xs font-semibold text-foreground hover:border-accent hover:text-accent"
                  >
                    {link.label}
                  </SmartLink>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-muted">
              LitBuy resource hub
            </h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {LITBUY_HUB_FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-semibold text-accent hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </article>
    </>
  );
}
