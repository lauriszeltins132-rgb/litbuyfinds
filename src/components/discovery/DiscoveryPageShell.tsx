import Link from "next/link";
import ContentFreshness, {
  type ContentFreshnessVariant,
} from "@/components/ContentFreshness";
import DiscoveryBrowseRails from "@/components/discovery/DiscoveryBrowseRails";
import DiscoveryRail from "@/components/DiscoveryRail";
import ProductGrid from "@/components/ProductGrid";
import AgentLogo from "@/components/agents/AgentLogo";
import { DISCOVERY_PRODUCT_LIMIT } from "@/lib/catalog-page-size";
import type { AgentId } from "@/lib/agents";
import type { StaticPageSection } from "@/lib/static-pages";
import {
  getDiscoveryHeroStats,
  getHeroIntro,
} from "@/lib/discovery-page-utils";
import type { Product } from "@/lib/types";

export type DiscoveryCompareGroup = {
  label: string;
  products: Product[];
};

type DiscoveryPageShellProps = {
  path: string;
  badge: string;
  h1: string;
  intro: string;
  freshnessVariant?: ContentFreshnessVariant | null;
  products: Product[];
  productSectionTitle?: string;
  productLimit?: number;
  compareGroups?: DiscoveryCompareGroup[];
  sections?: StaticPageSection[];
  faqs?: { question: string; answer: string }[];
  relatedLinks?: { href: string; label: string }[];
  brandLinks?: string[];
  categoryLinks?: string[];
  browseSlug: string;
  browseCategories?: string[];
  /** Optional agent logo for agent spreadsheet / finds landings. */
  agentId?: AgentId;
};

export default function DiscoveryPageShell({
  path,
  badge,
  h1,
  intro,
  freshnessVariant,
  products,
  productSectionTitle,
  productLimit = DISCOVERY_PRODUCT_LIMIT,
  compareGroups = [],
  sections = [],
  faqs,
  relatedLinks = [],
  brandLinks = [],
  categoryLinks = [],
  browseSlug,
  browseCategories = [],
  agentId,
}: DiscoveryPageShellProps) {
  const heroIntro = getHeroIntro(intro);
  const qcCount = products.filter((product) => product.qc_link).length;
  const heroStats = getDiscoveryHeroStats(
    Math.min(products.length, productLimit),
    { qcCount }
  );
  const displayedProducts = products.slice(0, productLimit);
  const hasCompareGroups = compareGroups.some((group) => group.products.length > 0);
  const hasPrimaryProducts = displayedProducts.length > 0 && !hasCompareGroups;
  const heroStatLine = heroStats.map((stat) => stat.value).join(" · ");

  return (
    <>
      <section className="px-4 pb-2 pt-4 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-2">
            {agentId ? <AgentLogo agentId={agentId} size="sm" /> : null}
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
              {badge}
            </p>
          </div>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            {h1}
          </h1>
          {heroIntro ? (
            <p className="mt-2 max-w-xl text-sm text-muted">{heroIntro}</p>
          ) : null}
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-muted">
            <span>{heroStatLine}</span>
            {freshnessVariant ? (
              <ContentFreshness variant={freshnessVariant} display="badge" />
            ) : null}
          </div>
        </div>
      </section>

      {hasPrimaryProducts ? (
        <DiscoveryRail
          title={productSectionTitle ?? "Browse finds"}
          subtitle="Tap a product to view photos, price, and buy link"
          href={path}
          products={displayedProducts.slice(0, 12)}
          preloadImages
          tight
        />
      ) : null}

      {hasCompareGroups
        ? compareGroups.map((group) =>
            group.products.length > 0 ? (
              <section key={group.label} className="px-4 pb-4 pt-2 sm:px-6">
                <div className="mx-auto max-w-7xl">
                  <h2 className="text-xl font-black sm:text-2xl">{group.label}</h2>
                  <div className="mt-4">
                    <ProductGrid products={group.products} />
                  </div>
                </div>
              </section>
            ) : null
          )
        : null}

      {hasPrimaryProducts ? (
        <section className="px-4 pb-6 pt-2 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-lg font-black sm:text-xl">All picks</h2>
            <p className="mt-1 text-sm text-muted">
              {displayedProducts.length.toLocaleString()} curated listings with verified buy links
            </p>
            <div className="mt-4">
              <ProductGrid products={displayedProducts} priorityCount={0} />
            </div>
          </div>
        </section>
      ) : null}

      <DiscoveryBrowseRails
        slug={browseSlug}
        path={path}
        primaryProducts={displayedProducts}
        categories={browseCategories}
      />

      <article className="border-t border-border px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-muted">
            About this page
          </h2>
          {intro ? (
            <p className="mt-3 text-base leading-relaxed text-muted">{intro}</p>
          ) : null}

          {sections.length > 0 ? (
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
          ) : null}

          {brandLinks.length > 0 || categoryLinks.length > 0 ? (
            <section className="mt-10 rounded-2xl border border-border bg-surface/30 p-5">
              {brandLinks.length > 0 ? (
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-muted">
                    Popular brands
                  </h2>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {brandLinks.map((slug) => (
                      <li key={slug}>
                        <Link
                          href={`/brands/${slug}`}
                          className="rounded-full border border-border px-3 py-1.5 text-xs font-bold capitalize text-foreground/80 hover:border-accent/40 hover:text-accent"
                        >
                          {slug.replace(/-/g, " ")}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {categoryLinks.length > 0 ? (
                <div className={brandLinks.length > 0 ? "mt-5" : undefined}>
                  <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-muted">
                    Browse categories
                  </h2>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {categoryLinks.map((slug) => (
                      <li key={slug}>
                        <Link
                          href={`/categories/${slug}`}
                          className="rounded-full border border-border px-3 py-1.5 text-xs font-bold text-foreground/80 hover:border-accent/40 hover:text-accent"
                        >
                          {slug.replace(/-/g, " ")}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </section>
          ) : null}

          {faqs && faqs.length > 0 ? (
            <section className="mt-12 rounded-2xl border border-border bg-surface/40 p-6">
              <h2 className="text-xl font-black">Frequently asked questions</h2>
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

          {relatedLinks.length > 0 ? (
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
