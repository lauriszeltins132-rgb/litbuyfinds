import { REGISTER_CTA_LABEL, SITE_NAME, SITE_TAGLINE } from "@/lib/constants";
import RegisterLink from "./RegisterLink";

type CatalogHeroProps = {
  badge?: string;
  title?: string;
  subtitle?: string;
};

export default function CatalogHero({
  badge = "Curated catalog",
  title = SITE_NAME,
  subtitle = "Every find verified. Every link tested. Built for people who actually buy.",
}: CatalogHeroProps) {
  return (
    <section className="relative overflow-hidden px-4 pb-6 pt-10 sm:px-6 sm:pt-12">
      <div className="glow-spot absolute inset-x-0 top-0 h-64" />

      <div className="relative mx-auto max-w-7xl text-center">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-accent">
          {badge}
        </p>

        <h1 className="mx-auto max-w-3xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
          <span className="bg-gradient-to-r from-foreground via-accent to-foreground bg-clip-text text-transparent">
            {title}
          </span>
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-base text-muted sm:text-lg">
          {subtitle}
        </p>

        <p className="mt-2 text-sm font-semibold text-muted">{SITE_TAGLINE}</p>

        <RegisterLink
          location="catalog_hero"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-black text-background transition-transform hover:scale-[1.03] hover:bg-accent-hover"
        >
          {REGISTER_CTA_LABEL}
          <span aria-hidden>→</span>
        </RegisterLink>
      </div>
    </section>
  );
}
