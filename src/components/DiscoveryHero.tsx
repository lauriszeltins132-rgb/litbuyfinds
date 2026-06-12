import Link from "next/link";
import PromoBanner from "@/components/PromoBanner";
import { HERO_TAGLINE } from "@/lib/constants";

export default function DiscoveryHero() {
  return (
    <section className="relative overflow-hidden px-4 pb-2 pt-5 sm:px-6 sm:pb-4 sm:pt-12 lg:pt-16">
      <div className="hero-glow pointer-events-none absolute inset-x-0 top-0 h-[420px]" />
      <div className="pointer-events-none absolute -left-20 top-24 h-64 w-64 rounded-full bg-accent/[0.07] blur-3xl animate-float" />
      <div className="pointer-events-none absolute -right-16 top-40 h-56 w-56 rounded-full bg-accent/[0.05] blur-3xl animate-float" />

      <div className="relative mx-auto grid max-w-7xl gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
        <div className="max-w-xl">
          <p className="mb-3 hidden items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-accent sm:mb-5 sm:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            Curated daily
          </p>

          <h1 className="text-[1.65rem] font-black leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.25rem]">
            Discover the Best{" "}
            <span className="bg-gradient-to-r from-accent via-foreground to-accent bg-clip-text text-transparent">
              LitBuy Finds
            </span>
          </h1>

          <p className="mt-2.5 max-w-xl text-sm leading-relaxed text-muted sm:mt-5 sm:text-lg">
            {HERO_TAGLINE}
          </p>

          <div className="mt-4 flex flex-wrap gap-2 sm:mt-8 sm:gap-3">
            <Link
              href="/#browse"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2.5 text-xs font-black text-background transition-transform hover:scale-[1.02] hover:bg-accent-hover sm:px-6 sm:py-3.5 sm:text-sm"
            >
              Browse Finds
              <span aria-hidden>→</span>
            </Link>
            <Link
              href="/trending"
              className="hidden items-center gap-2 rounded-full border border-border-strong bg-surface/60 px-6 py-3.5 text-sm font-bold text-foreground backdrop-blur transition-colors hover:border-accent/40 hover:text-accent sm:inline-flex"
            >
              Trending Today
            </Link>
          </div>
        </div>

        <PromoBanner variant="hero" priority className="mx-auto w-full max-w-xl lg:max-w-none" />
      </div>
    </section>
  );
}
