import Link from "next/link";
import HeroSearch from "@/components/HeroSearch";
import PromoBanner from "@/components/PromoBanner";
import { HERO_TAGLINE } from "@/lib/constants";

export default function DiscoveryHero() {
  return (
    <section className="relative overflow-hidden px-4 pb-4 pt-5 sm:px-6 sm:pb-8 sm:pt-12 lg:pt-14">
      <div className="hero-glow pointer-events-none absolute inset-x-0 top-0 h-[480px]" />
      <div className="pointer-events-none absolute -left-20 top-24 h-64 w-64 rounded-full bg-accent/[0.07] blur-3xl animate-float" />
      <div className="pointer-events-none absolute -right-16 top-40 h-56 w-56 rounded-full bg-accent/[0.05] blur-3xl animate-float" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            Curated daily
          </p>

          <h1 className="text-[1.65rem] font-black leading-[1.08] tracking-tight sm:text-5xl">
            Discover the Best{" "}
            <span className="bg-gradient-to-r from-accent via-foreground to-accent bg-clip-text text-transparent">
              LitBuy Finds
            </span>
          </h1>

          <p className="mx-auto mt-2.5 max-w-2xl text-sm leading-relaxed text-muted sm:mt-4 sm:text-lg">
            {HERO_TAGLINE}
          </p>

          <div className="mt-5 sm:mt-7">
            <HeroSearch />
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-2 sm:mt-6 sm:gap-3">
            <Link
              href="/trending"
              className="inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface/60 px-4 py-2 text-xs font-bold text-foreground backdrop-blur transition-colors hover:border-accent/40 hover:text-accent sm:px-6 sm:py-3 sm:text-sm"
            >
              Trending Today
            </Link>
            <Link
              href="/recently-added"
              className="inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface/60 px-4 py-2 text-xs font-bold text-foreground backdrop-blur transition-colors hover:border-accent/40 hover:text-accent sm:px-6 sm:py-3 sm:text-sm"
            >
              Recently Added
            </Link>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-3xl lg:mt-10 lg:max-w-4xl">
          <PromoBanner variant="hero" priority />
        </div>
      </div>
    </section>
  );
}
