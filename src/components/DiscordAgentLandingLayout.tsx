import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import SchemaScript from "@/components/SchemaScript";
import {
  buildBreadcrumbSchema,
  buildDiscordAgentWebPageSchema,
} from "@/lib/schema";
import type { DiscordAgentLandingConfig } from "@/lib/discord-agent-landing-pages";

type DiscordAgentLandingLayoutProps = {
  config: DiscordAgentLandingConfig;
};

export default function DiscordAgentLandingLayout({
  config,
}: DiscordAgentLandingLayoutProps) {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
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

      <Breadcrumbs items={breadcrumbItems} currentPath={config.path} />

      <article className="px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <section className="overflow-hidden rounded-3xl border border-accent/20 bg-gradient-to-br from-accent/10 via-[#121214] to-[#0d1210] p-6 text-center sm:p-10">
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
              Looking for Discord {config.agentName}, {config.agentName} Discord,
              or {config.agentName} finds Discord? You are in the right place.
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

          <footer className="mt-10 border-t border-border pt-8">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-muted">
              More Discord guides
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
