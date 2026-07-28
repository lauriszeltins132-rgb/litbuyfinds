import Link from "next/link";
import SmartLink from "@/components/SmartLink";
import { LITBUY_AUTHORITY_LINKS } from "@/lib/litbuy-authority-hub";

export default function HomepageAuthorityHub() {
  return (
    <section className="px-4 py-6 sm:px-6" aria-labelledby="litbuy-authority-heading">
      <div className="mx-auto max-w-7xl rounded-2xl border border-border/80 bg-panel/60 p-5 sm:p-7">
        <h2
          id="litbuy-authority-heading"
          className="text-lg font-black sm:text-xl"
        >
          LitBuy resources
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">
          Official-style guides for LitBuy Finds, the LitBuy spreadsheet, QC photos,
          coupons, community channels, and LitBuy AI — all crawlable, server-rendered
          pages with real catalog links.
        </p>
        <ul className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {LITBUY_AUTHORITY_LINKS.map((link) => (
            <li key={link.href}>
              <SmartLink
                href={link.href}
                className="block rounded-xl border border-border/70 bg-background/50 px-4 py-3 text-sm font-semibold text-foreground transition hover:border-accent hover:text-accent"
              >
                {link.label}
              </SmartLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
