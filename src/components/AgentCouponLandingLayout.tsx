import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import RegisterLink from "@/components/RegisterLink";
import SchemaScript from "@/components/SchemaScript";
import {
  buildAgentCouponWebPageSchema,
  buildBreadcrumbSchema,
} from "@/lib/schema";
import type { AgentCouponLandingConfig } from "@/lib/agent-coupon-landing-pages";

type AgentCouponLandingLayoutProps = {
  config: AgentCouponLandingConfig;
};

export default function AgentCouponLandingLayout({
  config,
}: AgentCouponLandingLayoutProps) {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: config.h1 },
  ];

  return (
    <>
      <SchemaScript
        data={buildAgentCouponWebPageSchema({
          name: config.h1,
          description: config.metaDescription,
          path: config.path,
          couponUrl: config.couponUrl,
          offerHeadline: config.offerHeadline,
          offerDescription: config.offerDescription,
        })}
      />
      <SchemaScript
        data={buildBreadcrumbSchema(breadcrumbItems, config.path)}
      />

      <Breadcrumbs items={breadcrumbItems} currentPath={config.path} />

      <article className="px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <section className="overflow-hidden rounded-3xl border border-accent/20 bg-gradient-to-br from-accent/10 via-[#121214] to-[#0d1210] p-6 text-center sm:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
              {config.agent.name} · Coupons
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              {config.h1}
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-muted">
              {config.intro}
            </p>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted/80">
              {config.keywordLine}
            </p>
            <p className="mx-auto mt-4 max-w-md text-sm font-bold text-accent">
              {config.offerHeadline}
            </p>
            <p className="mx-auto mt-1 max-w-md text-xs leading-relaxed text-muted">
              {config.offerDescription}
            </p>
            <div className="mt-8">
              {config.agent.useRegisterLink ? (
                <RegisterLink
                  location={`agent_coupon_${config.slug}`}
                  className="inline-flex items-center justify-center rounded-full bg-accent px-8 py-4 text-sm font-black text-background transition-transform hover:scale-[1.02] hover:bg-accent-hover"
                >
                  {config.ctaLabel}
                </RegisterLink>
              ) : (
                <a
                  href={config.couponUrl}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="inline-flex items-center justify-center rounded-full bg-accent px-8 py-4 text-sm font-black text-background transition-transform hover:scale-[1.02] hover:bg-accent-hover"
                >
                  {config.ctaLabel}
                </a>
              )}
            </div>
          </section>

          <section className="mt-10 rounded-2xl border border-border bg-surface/20 p-5">
            <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-muted">
              Related deals
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {config.relatedDeals.map((link) => (
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

          <footer className="mt-10 border-t border-border pt-8">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-muted">
              More coupon guides
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {config.footerLinks.map((link) => (
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
          </footer>
        </div>
      </article>
    </>
  );
}
