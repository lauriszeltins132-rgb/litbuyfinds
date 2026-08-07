import Link from "next/link";
import SmartLink from "@/components/SmartLink";
import Breadcrumbs from "@/components/Breadcrumbs";
import SchemaScript from "@/components/SchemaScript";
import {
  buildBreadcrumbSchema,
  buildDiscordAgentWebPageSchema,
  buildFaqSchema,
} from "@/lib/schema";
import type { DiscordAgentLandingConfig } from "@/lib/discord-agent-landing-pages";

type DiscordAgentLandingLayoutProps = {
  config: DiscordAgentLandingConfig;
};

export default function DiscordAgentLandingLayout({
  config,
}: DiscordAgentLandingLayoutProps) {
  const breadcrumbItems = config.breadcrumbItems ?? [
    { label: "Home", href: "/" },
    { label: "Discord", href: "/litbuy-discord" },
    { label: config.h1 },
  ];

  return (
    <>
      <SchemaScript
        data={buildDiscordAgentWebPageSchema({
          name: config.h1,
          description: config.metaDescription,
          path: config.path,
          agentName: config.agentName,
          discordUrl: config.discordUrl,
        })}
      />
      <SchemaScript
        data={buildBreadcrumbSchema(breadcrumbItems, config.path)}
      />
      {config.faqs.length > 0 ? (
        <SchemaScript data={buildFaqSchema(config.faqs)} />
      ) : null}

      <Breadcrumbs items={breadcrumbItems} currentPath={config.path} />

      <article className="px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <section className="overflow-hidden rounded-3xl border border-accent/20 bg-gradient-to-br from-accent/10 via-surface to-background p-6 text-center sm:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
              {config.agentName} · Discord
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              {config.h1}
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-muted">
              {config.intro}
            </p>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted/80">
              Looking for Discord {config.agentName}, {config.agentName}{" "}
              Discord, or {config.agentName} finds Discord? You are in the right
              place.
            </p>
            <div className="mt-8">
              <a
                href={config.discordUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="community-btn community-btn--discord community-btn--cta inline-flex"
              >
                {config.ctaLabel}
              </a>
            </div>
          </section>

          {config.sections.length > 0 ? (
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
          ) : null}

          {config.faqs.length > 0 ? (
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
          ) : null}

          {config.relatedResourceLinks && config.relatedResourceLinks.length > 0 ? (
            <section className="mt-10 border-t border-border pt-8">
              <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-muted">
                {config.relatedResourcesTitle ?? `Related ${config.agentName} resources`}
              </h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {config.relatedResourceLinks.map((link) => (
                  <li key={link.href}>
                    <SmartLink
                      href={link.href}
                      className="rounded-full border border-border px-3 py-1.5 text-xs font-bold text-foreground/80 hover:border-accent/40 hover:text-accent"
                    >
                      {link.label}
                    </SmartLink>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <footer className="mt-10 border-t border-border pt-8">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-muted">
              More Discord guides
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {config.footerLinks.map((link) => (
                <li key={link.href}>
                  <SmartLink
                    href={link.href}
                    className="rounded-full border border-border px-3 py-1.5 text-xs font-bold text-foreground/80 hover:border-accent/40 hover:text-accent"
                  >
                    {link.label}
                  </SmartLink>
                </li>
              ))}
            </ul>
          </footer>
        </div>
      </article>
    </>
  );
}
