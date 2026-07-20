import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import CommunityButton from "@/components/community/CommunityButton";
import SchemaScript from "@/components/SchemaScript";
import {
  SOCIAL_LINKS,
  TELEGRAM_CHANNEL_NAME,
  TELEGRAM_HANDLE,
  TELEGRAM_MEMBER_LABEL,
} from "@/lib/constants";
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildTelegramJoinWebPageSchema,
  buildWebPageSchema,
} from "@/lib/schema";
import type { TelegramSeoPageConfig } from "@/lib/telegram-seo-pages";
import { TELEGRAM_SUPPORTED_AGENTS } from "@/lib/telegram-seo-pages";

type TelegramSeoLayoutProps = {
  config: TelegramSeoPageConfig;
};

const BENEFITS = [
  {
    title: "Daily finds",
    body: "Fresh spreadsheet rows, restocks, and agent product links posted throughout the day.",
  },
  {
    title: "QC references",
    body: "Community QC photos and warehouse albums to sanity-check batches before you ship.",
  },
  {
    title: "Multi-agent links",
    body: "LitBuy, MuleBuy, OopBuy, ACBuy, and Kakobuy finds in one active channel.",
  },
];

export default function TelegramSeoLayout({ config }: TelegramSeoLayoutProps) {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Telegram", href: "/telegram" },
    { label: config.h1 },
  ];
  const joinLabel = config.joinCtaLabel ?? `Join ${TELEGRAM_CHANNEL_NAME} on Telegram`;

  return (
    <>
      <SchemaScript
        data={
          config.useJoinSchema
            ? buildTelegramJoinWebPageSchema({
                name: config.h1,
                description: config.metaDescription,
                path: config.path,
                joinUrl: SOCIAL_LINKS.telegram,
                joinLabel,
              })
            : buildWebPageSchema({
                name: config.h1,
                description: config.metaDescription,
                path: config.path,
              })
        }
      />
      <SchemaScript
        data={buildBreadcrumbSchema(breadcrumbItems, config.path)}
      />
      <SchemaScript data={buildFaqSchema(config.faqs)} />

      <Breadcrumbs
        items={breadcrumbItems}
        currentPath={config.path}
      />

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
            {config.slug === "litbuy-telegram" ? (
              <p className="mt-3 text-sm leading-relaxed text-muted/90">
                Searching <strong className="text-foreground">litbuy telegram</strong> or{" "}
                <strong className="text-foreground">telegram litbuy</strong>? You are on the
                official join page for the LitBuy Telegram community.
              </p>
            ) : null}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <CommunityButton
                platform="telegram"
                variant="cta"
                location={`telegram_seo_${config.slug}`}
                label={joinLabel}
              />
              <span className="text-xs font-bold uppercase tracking-[0.12em] text-muted">
                {TELEGRAM_HANDLE} · {TELEGRAM_MEMBER_LABEL}
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
              Supported agents in {TELEGRAM_CHANNEL_NAME}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              LitBuy may be recommended on LitBuy Finds for verified catalog
              links, but the Telegram community is multi-agent. Members share
              finds for all supported platforms below.
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {TELEGRAM_SUPPORTED_AGENTS.map((agent) => (
                <li key={agent}>
                  <span className="rounded-full border border-border px-3 py-1.5 text-xs font-bold text-foreground/85">
                    {agent}
                    {agent === "LitBuy" ? " · recommended on site" : ""}
                  </span>
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
              Join {TELEGRAM_MEMBER_LABEL} on Telegram
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted">
              Get daily finds, QC photos, spreadsheet updates, and agent links
              in {TELEGRAM_CHANNEL_NAME}. Free to join — tap below to open
              Telegram.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <CommunityButton
                platform="telegram"
                variant="cta"
                location={`telegram_seo_cta_${config.slug}`}
                label={config.joinCtaLabel ?? "View daily finds on Telegram"}
              />
              <a
                href={SOCIAL_LINKS.telegram}
                className="inline-flex items-center rounded-full border border-border px-4 py-2.5 text-sm font-bold text-foreground/85 hover:border-accent/40 hover:text-accent"
              >
                Open {TELEGRAM_HANDLE}
              </a>
            </div>
          </section>

          {config.relatedLinks.length > 0 ? (
            <section className="mt-10 border-t border-border pt-8">
              <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-muted">
                Related Telegram guides
              </h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {config.relatedLinks.map((link) => {
                  const isExternal = link.href.startsWith("http");
                  return (
                    <li key={link.href}>
                      {isExternal ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-full border border-border px-3 py-1.5 text-xs font-bold text-foreground/80 hover:border-accent/40 hover:text-accent"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="rounded-full border border-border px-3 py-1.5 text-xs font-bold text-foreground/80 hover:border-accent/40 hover:text-accent"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          ) : null}
        </div>
      </article>
    </>
  );
}
