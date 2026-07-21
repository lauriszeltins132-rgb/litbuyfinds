import HeroSearch from "@/components/HeroSearch";
import LiveSiteSignals from "@/components/LiveSiteSignals";
import TrustStrip from "@/components/TrustStrip";
import AiHeroEntry from "@/components/ai/AiHeroEntry";
import { HERO_HEADLINE, HERO_SUBHEADLINE } from "@/lib/constants";
import { HERO_ENTITY_LINE } from "@/lib/brand-entity";
import { getSearchIndex } from "@/lib/search-suggestions";

export default function DiscoveryHero() {
  const searchIndex = getSearchIndex().map(({ label, href, type, keywords, priority }) => ({
    label,
    href,
    type,
    keywords,
    priority,
  }));

  return (
    <section className="border-b border-border/50 px-4 pb-6 pt-5 sm:px-6 sm:pb-8 sm:pt-10">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
          QC approved · Verified LitBuy links
        </p>
        <h1 className="mt-3 text-[1.35rem] font-black leading-[1.12] tracking-tight sm:text-[1.85rem] lg:text-[2.35rem]">
          {HERO_HEADLINE}
        </h1>

        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
          {HERO_SUBHEADLINE}
        </p>

        <p className="mx-auto mt-2 max-w-2xl text-xs leading-relaxed text-muted/80 sm:text-sm">
          {HERO_ENTITY_LINE}
        </p>

        <LiveSiteSignals />

        <div className="mx-auto mt-6 max-w-[700px] sm:mt-7">
          <AiHeroEntry />
        </div>

        <div className="mx-auto mt-4 max-w-[700px]">
          <HeroSearch searchIndex={searchIndex} />
        </div>
      </div>

      <div className="mx-auto mt-5 max-w-7xl sm:mt-6">
        <TrustStrip compact />
      </div>
    </section>
  );
}
