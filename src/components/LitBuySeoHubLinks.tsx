import Link from "next/link";
import { LITBUY_SEO_HUB_LINKS } from "@/lib/litbuy-seo-hub";

type LitBuySeoHubLinksProps = {
  title?: string;
  excludeHref?: string;
};

export default function LitBuySeoHubLinks({
  title = "LitBuy Finds SEO resources",
  excludeHref,
}: LitBuySeoHubLinksProps) {
  const links = LITBUY_SEO_HUB_LINKS.filter((link) => link.href !== excludeHref);

  return (
    <section className="litbuy-seo-hub-links mt-10 border-t border-border/60 pt-8">
      <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-accent">
        {title}
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
        Explore LitBuy Finds, LitBuy Telegram, LitBuy Discord, LitBuy Coupons, and
        the LitBuy Spreadsheet — all verified QC resources in one place.
      </p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="rounded-full border border-border px-3 py-1.5 text-xs font-bold text-foreground/80 transition hover:border-accent/40 hover:text-accent"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
