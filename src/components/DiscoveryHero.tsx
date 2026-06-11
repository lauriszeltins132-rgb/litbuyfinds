import Link from "next/link";
import { HERO_TAGLINE } from "@/lib/constants";

export default function DiscoveryHero() {
  return (
    <section className="relative overflow-hidden px-4 pb-4 pt-12 sm:px-6 sm:pt-16">
      <div className="hero-glow pointer-events-none absolute inset-x-0 top-0 h-[420px]" />
      <div className="pointer-events-none absolute -left-20 top-24 h-64 w-64 rounded-full bg-accent/[0.07] blur-3xl animate-float" />
      <div className="pointer-events-none absolute -right-16 top-40 h-56 w-56 rounded-full bg-accent/[0.05] blur-3xl animate-float" />

      <div className="relative mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            Curated daily
          </p>

          <h1 className="text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Discover the Best{" "}
            <span className="bg-gradient-to-r from-accent via-foreground to-accent bg-clip-text text-transparent">
              LitBuy Finds
            </span>
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            {HERO_TAGLINE}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/#browse"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-black text-background transition-transform hover:scale-[1.02] hover:bg-accent-hover"
            >
              Browse Finds
              <span aria-hidden>→</span>
            </Link>
            <Link
              href="/trending"
              className="inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface/60 px-6 py-3.5 text-sm font-bold text-foreground backdrop-blur transition-colors hover:border-accent/40 hover:text-accent"
            >
              Trending Today
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
