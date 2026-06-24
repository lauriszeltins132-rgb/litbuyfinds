import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import SchemaScript from "@/components/SchemaScript";
import {
  SOCIAL_LINKS,
  TELEGRAM_CHANNEL_NAME,
  TELEGRAM_COLLAB_CONTACT,
  TELEGRAM_COLLAB_URL,
  TELEGRAM_MEMBER_LABEL,
} from "@/lib/constants";
import {
  ADVERTISE_FAQS,
  ADVERTISE_OPTIONS,
  ADVERTISE_PAGE_PATH,
  ADVERTISE_SECTIONS,
  ADVERTISE_STATS,
} from "@/lib/advertise-page";
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildWebPageSchema,
} from "@/lib/schema";

export default function AdvertisePageLayout() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Advertise with RN Finds" },
  ];

  return (
    <>
      <SchemaScript
        data={buildWebPageSchema({
          name: "Advertise with RN Finds",
          description:
            "Promote your products, agent service, or seller store to RN Finds Telegram members.",
          path: ADVERTISE_PAGE_PATH,
        })}
      />
      <SchemaScript
        data={buildBreadcrumbSchema(breadcrumbItems, ADVERTISE_PAGE_PATH)}
      />
      <SchemaScript data={buildFaqSchema([...ADVERTISE_FAQS])} />

      <Breadcrumbs items={breadcrumbItems} currentPath={ADVERTISE_PAGE_PATH} />

      <article className="px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <section className="overflow-hidden rounded-3xl border border-accent/20 bg-gradient-to-br from-accent/10 via-[#121214] to-[#0d1210] p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
              Business · Collaborate
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Advertise with {TELEGRAM_CHANNEL_NAME}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted">
              Reach {TELEGRAM_MEMBER_LABEL} on Telegram with sponsored posts,
              product promotions, and seller spotlights. {TELEGRAM_CHANNEL_NAME}{" "}
              is a shopping finds community for sneakers, fashion, QC photos,
              spreadsheets, and multi-agent links — contact for pricing on every
              package.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={TELEGRAM_COLLAB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-full bg-accent px-5 py-2.5 text-sm font-black text-background transition hover:opacity-90"
              >
                Contact on Telegram {TELEGRAM_COLLAB_CONTACT}
              </a>
              <a
                href={SOCIAL_LINKS.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-full border border-border px-5 py-2.5 text-sm font-bold text-foreground/90 hover:border-accent/40 hover:text-accent"
              >
                View {TELEGRAM_CHANNEL_NAME} Telegram
              </a>
            </div>
          </section>

          <section className="mt-10 grid gap-4 sm:grid-cols-2">
            {ADVERTISE_STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-border bg-surface/30 p-5"
              >
                <p className="text-2xl font-black text-accent">{stat.value}</p>
                <p className="mt-1 text-sm font-bold text-foreground">
                  {stat.label}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-muted">
                  {stat.detail}
                </p>
              </div>
            ))}
          </section>

          <section className="mt-12">
            <h2 className="text-xl font-black text-foreground">
              Collaboration options
            </h2>
            <p className="mt-2 text-sm text-muted">
              RN Finds advertising packages are tailored to your goals. All
              pricing is shared privately — contact for pricing.
            </p>
            <ul className="mt-6 space-y-4">
              {ADVERTISE_OPTIONS.map((option) => (
                <li
                  key={option.title}
                  className="rounded-2xl border border-border bg-surface/20 p-5"
                >
                  <h3 className="font-bold text-foreground">{option.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {option.body}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          <div className="mt-12 space-y-10">
            {ADVERTISE_SECTIONS.map((section) => (
              <section key={section.heading}>
                <h2 className="text-xl font-black text-foreground">
                  {section.heading}
                </h2>
                <div className="mt-3 space-y-3 text-base leading-relaxed text-muted">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                {"links" in section && section.links ? (
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {section.links.map((link) => {
                      const external = link.href.startsWith("http");
                      return (
                        <li key={link.href}>
                          {external ? (
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
                ) : null}
              </section>
            ))}
          </div>

          <section className="mt-12 rounded-2xl border border-border bg-surface/40 p-6">
            <h2 className="text-xl font-black">Frequently asked questions</h2>
            <dl className="mt-5 space-y-5">
              {ADVERTISE_FAQS.map((faq) => (
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
              Ready to promote on Telegram?
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted">
              Message {TELEGRAM_COLLAB_CONTACT} for sponsored Telegram post
              options, seller promotion, and agent promotion packages. View the
              channel first to see the community tone and content style.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a
                href={TELEGRAM_COLLAB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-full bg-accent px-5 py-2.5 text-sm font-black text-background"
              >
                Contact {TELEGRAM_COLLAB_CONTACT}
              </a>
              <a
                href={SOCIAL_LINKS.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-full border border-border px-5 py-2.5 text-sm font-bold text-foreground/90 hover:border-accent/40 hover:text-accent"
              >
                View {TELEGRAM_CHANNEL_NAME}
              </a>
            </div>
          </section>

          <section className="mt-10 border-t border-border pt-8">
            <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-muted">
              Related
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              <li>
                <Link
                  href="/telegram"
                  className="rounded-full border border-border px-3 py-1.5 text-xs font-bold text-foreground/80 hover:border-accent/40 hover:text-accent"
                >
                  RN Finds Telegram hub
                </Link>
              </li>
              <li>
                <Link
                  href="/rn-finds"
                  className="rounded-full border border-border px-3 py-1.5 text-xs font-bold text-foreground/80 hover:border-accent/40 hover:text-accent"
                >
                  About RN Finds
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="rounded-full border border-border px-3 py-1.5 text-xs font-bold text-foreground/80 hover:border-accent/40 hover:text-accent"
                >
                  General contact
                </Link>
              </li>
            </ul>
          </section>
        </div>
      </article>
    </>
  );
}
