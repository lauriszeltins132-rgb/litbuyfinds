import Link from "next/link";
import Breadcrumbs, { type BreadcrumbItem } from "@/components/Breadcrumbs";
import ContentAuthorMeta from "@/components/ContentAuthorMeta";
import SchemaScript from "@/components/SchemaScript";
import type { ContentDates } from "@/lib/content-dates";
import { buildBreadcrumbSchema, buildFaqSchema } from "@/lib/schema";
import MemberBenefitsStrip from "@/components/conversion/MemberBenefitsStrip";
import GuideSignupCallout from "@/components/conversion/GuideSignupCallout";
import SignupCard from "@/components/SignupCard";
import type { StaticPageSection } from "@/lib/static-pages";

type ContentPageLayoutProps = {
  path: string;
  badge: string;
  h1: string;
  intro: string;
  sections: StaticPageSection[];
  faqs?: { question: string; answer: string }[];
  relatedLinks?: { href: string; label: string }[];
  parentCrumb?: { label: string; href: string };
  contentDates?: ContentDates;
  showAuthorMeta?: boolean;
  showSignupCta?: boolean;
};

export default function ContentPageLayout({
  path,
  badge,
  h1,
  intro,
  sections,
  faqs,
  relatedLinks,
  parentCrumb,
  contentDates,
  showAuthorMeta = false,
  showSignupCta = false,
}: ContentPageLayoutProps) {
  const breadcrumbs: BreadcrumbItem[] = parentCrumb
    ? [
        { label: "Home", href: "/" },
        parentCrumb,
        { label: h1 },
      ]
    : [
        { label: "Home", href: "/" },
        { label: h1 },
      ];

  return (
    <>
      <SchemaScript data={buildBreadcrumbSchema(breadcrumbs, path)} />
      {faqs && faqs.length > 0 ? (
        <SchemaScript data={buildFaqSchema(faqs)} />
      ) : null}

      <Breadcrumbs items={breadcrumbs} currentPath={path} />

      <article className="px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
            {badge}
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            {h1}
          </h1>
          <p className="mt-5 text-base leading-relaxed text-muted">{intro}</p>

          {showAuthorMeta && contentDates ? (
            <ContentAuthorMeta dates={contentDates} />
          ) : null}

          {showSignupCta ? (
            <div className="mt-8">
              <GuideSignupCallout variant="inline" />
            </div>
          ) : null}

          <div className="mt-10 space-y-10">
            {sections.map((section) => {
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

          {faqs && faqs.length > 0 ? (
            <section className="mt-12 rounded-2xl border border-border bg-surface/40 p-6">
              <h2 className="text-xl font-black">Common questions</h2>
              <dl className="mt-5 space-y-5">
                {faqs.map((faq) => (
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

          {showSignupCta ? (
            <div className="mt-10 space-y-6">
              <GuideSignupCallout variant="panel" />
              <MemberBenefitsStrip location="guide_member_benefits" compact />
              <div className="-mx-4 sm:-mx-6">
                <SignupCard location="guide_signup_cta" variant="ready" />
              </div>
            </div>
          ) : null}

          {relatedLinks && relatedLinks.length > 0 ? (
            <section className="mt-10 border-t border-border pt-8">
              <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-muted">
                Keep exploring
              </h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {relatedLinks.map((link) => (
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
