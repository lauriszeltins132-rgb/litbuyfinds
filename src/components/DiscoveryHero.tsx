import HeroSearch from "@/components/HeroSearch";
import DiscoveryQuickLinks from "@/components/DiscoveryQuickLinks";
import LiveSiteSignals from "@/components/LiveSiteSignals";
import { HERO_HEADLINE, HERO_SUBHEADLINE } from "@/lib/constants";
import { HERO_ENTITY_LINE } from "@/lib/brand-entity";
import { getFindsAuthorityStats } from "@/lib/finds-authority";
import { getSearchIndex } from "@/lib/search-suggestions";

type DiscoveryHeroProps = {
  /** Compact mode shows headline + search only — AI and trust strip render elsewhere. */
  compact?: boolean;
};

export default function DiscoveryHero({ compact = false }: DiscoveryHeroProps) {
  const searchIndex = getSearchIndex().map(({ label, href, type, keywords, priority }) => ({
    label,
    href,
    type,
    keywords,
    priority,
  }));
  const stats = getFindsAuthorityStats();

  return (
    <section className="border-b border-border/50 px-4 pb-4 pt-4 sm:px-6 sm:pb-5 sm:pt-6">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
          Product finds · QC photos · Agent links
        </p>
        <h1 className="mt-2 text-[1.35rem] font-black leading-[1.12] tracking-tight sm:text-[1.75rem] lg:text-[2.1rem]">
          {HERO_HEADLINE}
        </h1>

        <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
          {HERO_SUBHEADLINE}
        </p>

        {!compact ? (
          <p className="mx-auto mt-2 max-w-2xl text-xs leading-relaxed text-muted/80 sm:text-sm">
            {HERO_ENTITY_LINE} Discover LitBuy finds organized by category — our catalog has{" "}
            {stats.totalFindsLabel}+ products with {stats.qcFindsLabel} QC-linked listings,
            updated weekly from the LitBuy spreadsheet.
          </p>
        ) : null}

        <LiveSiteSignals />

        {!compact ? <DiscoveryQuickLinks /> : null}

        <div className="mx-auto mt-4 max-w-[700px]">
          <HeroSearch searchIndex={searchIndex} />
        </div>
      </div>
    </section>
  );
}
