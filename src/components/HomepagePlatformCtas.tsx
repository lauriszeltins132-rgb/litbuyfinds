import Link from "next/link";
import { LITBUY_PLATFORM_CTAS } from "@/lib/litbuy-seo-hub";

const VARIANT_CLASS: Record<(typeof LITBUY_PLATFORM_CTAS)[number]["variant"], string> = {
  telegram: "community-btn community-btn--telegram",
  discord: "community-btn community-btn--discord",
  coupon: "litbuy-seo-cta litbuy-seo-cta--accent",
  spreadsheet: "litbuy-seo-cta litbuy-seo-cta--outline",
};

export default function HomepagePlatformCtas() {
  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
      {LITBUY_PLATFORM_CTAS.map((cta) => {
        const className = `${VARIANT_CLASS[cta.variant]} inline-flex min-h-[2.75rem] items-center justify-center px-4 py-2.5 text-xs font-black sm:px-5 sm:text-sm`;

        if (cta.external) {
          return (
            <a
              key={cta.label}
              href={cta.href}
              target="_blank"
              rel="noopener noreferrer"
              className={className}
            >
              {cta.label}
            </a>
          );
        }

        return (
          <Link key={cta.label} href={cta.href} className={className}>
            {cta.label}
          </Link>
        );
      })}
    </div>
  );
}
