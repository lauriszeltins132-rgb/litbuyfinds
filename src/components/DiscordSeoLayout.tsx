import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import CommunityButton from "@/components/community/CommunityButton";
import SchemaScript from "@/components/SchemaScript";
import { SOCIAL_LINKS } from "@/lib/constants";
import {
  buildBreadcrumbSchema,
  buildDiscordJoinSchema,
  buildFaqSchema,
} from "@/lib/schema";
import type { DiscordSeoPageConfig } from "@/lib/discord-seo-pages";
import { SEO_AGENTS } from "@/lib/seo-agents";

type DiscordSeoLayoutProps = {
  config: DiscordSeoPageConfig;
};

const BENEFITS = [
  {
    title: "QC updates",
    body: "Warehouse QC photos and batch comparisons shared by the community before you ship.",
  },
  {
    title: "Spreadsheet finds",
    body: "New rows, restocks, and price changes posted as members spot them.",
  },
  {
    title: "Buyer discussion",
    body: "Ask questions, compare sellers, and get honest feedback from other buyers.",
  },
];

export default function DiscordSeoLayout({ config }: DiscordSeoLayoutProps) {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: `${config.agentName} Discord` },
  ];

  return (
    <>
      <SchemaScript
        data={buildDiscordJoinSchema({
          name: config.h1,
          description: config.metaDescription,
          path: config.path,
          discordUrl: SOCIAL_LINKS.discord,
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
              <CommunityButton
                platform="discord"
                variant="cta"
                location={`discord_seo_${config.slug}`}
                label={`Join ${config.agentName} Discord`}
              />
              <span className="text-xs font-bold uppercase tracking-[0.12em] text-muted">
                Free to join
              </span>
            </div>
          </section>

          <section className="mt-10 grid gap-4 sm:grid-cols-3">
            {BENEFITS.map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-2xl border border-border bg-surface/30 p-4"
              >
                <h2 className="text-sm font-black text-foreground">
                  {benefit.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {benefit.body}
                </p>
              </div>
            ))}
          </section>

          <section className="mt-10 rounded-2xl border border-border bg-surface/20 p-5">
            <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-muted">
              Other agent Discord communities
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              LitBuy Finds supports multiple shopping agents. Every agent has
              its own Discord, coupon, and spreadsheet page.
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {SEO_AGENTS.map((agent) => (
                <li key={agent.id}>
                  {agent.id === config.agentId ? (
                    <span className="rounded-full border border-accent/40 px-3 py-1.5 text-xs font-bold text-accent">
                      {agent.name} · this page
                    </span>
                  ) : (
                    <Link
                      href={agent.discordPath}
                      className="rounded-full border border-border px-3 py-1.5 text-xs font-bold text-foreground/85 hover:border-accent/40 hover:text-accent"
                    >
                      {agent.name} Discord
                    </Link>
                  )}
                </li>
              ))}
            </ul>
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
              Join {config.agentName} Discord today
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted">
              Get QC updates, spreadsheet finds, and community discussion.
              Free to join — tap below to open Discord.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <CommunityButton
                platform="discord"
                variant="cta"
                location={`discord_seo_cta_${config.slug}`}
                label={`Join ${config.agentName} Discord`}
              />
              <Link
                href={config.agentSlug === "litbuy" ? "/litbuy-finds" : `/${config.agentSlug}-finds`}
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
