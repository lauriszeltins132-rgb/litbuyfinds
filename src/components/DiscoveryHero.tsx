import HeroSearch from "@/components/HeroSearch";
import { HERO_HEADLINE, HERO_SUBHEADLINE } from "@/lib/constants";

export default function DiscoveryHero() {
  return (
    <section className="border-b border-border/50 px-4 pb-6 pt-5 sm:px-6 sm:pb-8 sm:pt-10">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-[1.75rem] font-black leading-[1.08] tracking-tight sm:text-4xl lg:text-5xl">
          {HERO_HEADLINE}
        </h1>

        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
          {HERO_SUBHEADLINE}
        </p>

        <div className="mt-6 sm:mt-7">
          <HeroSearch />
        </div>
      </div>
    </section>
  );
}
