import Image from "next/image";
import HeroSearch from "@/components/HeroSearch";
import HomepagePlatformCtas from "@/components/HomepagePlatformCtas";
import LiveSiteSignals from "@/components/LiveSiteSignals";
import TrustStrip from "@/components/TrustStrip";
import { HERO_HEADLINE, HERO_SUBHEADLINE } from "@/lib/constants";
import { LITBUY_HERO_SUBTITLE } from "@/lib/litbuy-seo-hub";
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
    <section className="litbuy-seo-hub-hero border-b border-accent/15 px-4 pb-6 pt-5 sm:px-6 sm:pb-8 sm:pt-10">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-accent/25 bg-[#141612] shadow-lg sm:h-16 sm:w-16">
          <Image
            src="/logo.svg"
            alt="LitBuy Finds logo — verified QC spreadsheet finds"
            width={40}
            height={40}
            priority
            className="h-9 w-9 sm:h-10 sm:w-10"
          />
        </div>
        <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
          QC approved · Verified LitBuy links
        </p>
        <h1 className="mt-3 text-[1.35rem] font-black leading-[1.12] tracking-tight text-[#f2f1ed] sm:text-[1.85rem] lg:text-[2.35rem]">
          {HERO_HEADLINE}
        </h1>

        <p className="mx-auto mt-3 max-w-2xl text-sm font-semibold leading-relaxed text-[#e8e6df] sm:text-base">
          {LITBUY_HERO_SUBTITLE}
        </p>

        <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-[#b8b6ae] sm:text-base">
          {HERO_SUBHEADLINE}
        </p>

        <p className="mx-auto mt-2 max-w-2xl text-xs leading-relaxed text-[#9a9890] sm:text-sm">
          {HERO_ENTITY_LINE}
        </p>

        <HomepagePlatformCtas />
        <LiveSiteSignals />

        <div className="mx-auto mt-6 max-w-[700px] sm:mt-7">
          <HeroSearch searchIndex={searchIndex} />
        </div>
      </div>

      <div className="mx-auto mt-5 max-w-7xl sm:mt-6">
        <TrustStrip compact />
      </div>
    </section>
  );
}
