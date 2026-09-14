import HeroSearch from "@/components/HeroSearch";
import DiscoveryQuickLinks from "@/components/DiscoveryQuickLinks";
import LiveSiteSignals from "@/components/LiveSiteSignals";
import SmartLink from "@/components/SmartLink";
import { HERO_HEADLINE, HERO_SUBHEADLINE, SOCIAL_LINKS } from "@/lib/constants";
import { HERO_ENTITY_LINE } from "@/lib/brand-entity";
import { getFindsAuthorityStats } from "@/lib/finds-authority";
import { getSearchIndex } from "@/lib/search-suggestions";

/** External Google Sheet — View LitBuy Spreadsheet hero CTA. */
const LITBUY_SPREADSHEET_SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1uCskcK_kpAjJ82uAbHJ-do8jqLZ2_WBx4SRnhKDMmTA/edit?pli=1&gid=470997016#gid=470997016";

const HERO_CTA_BUTTONS = [
  {
    href: "/litbuy-coupons",
    label: "Claim LitBuy Coupon",
    primary: true,
  },
  {
    href: SOCIAL_LINKS.telegram,
    label: "Join LitBuy Telegram",
    primary: false,
  },
  {
    href: SOCIAL_LINKS.discord,
    label: "Join LitBuy Discord",
    primary: false,
  },
  {
    href: LITBUY_SPREADSHEET_SHEET_URL,
    label: "View LitBuy Spreadsheet",
    primary: false,
  },
] as const;

type DiscoveryHeroProps = {
  /** Compact mode shows headline + search only — AI and trust strip render elsewhere. */
  compact?: boolean;
};

export default function DiscoveryHero({ compact = false }: DiscoveryHeroProps) {
  const searchIndex = getSearchIndex().map(({ label, href, type, keywords, priority }) => ({
    label,
    href,
    type,
    keywords,
    priority,
  }));
  const stats = getFindsAuthorityStats();

  return (
    <section className="border-b border-border/50 px-4 pb-4 pt-4 sm:px-6 sm:pb-5 sm:pt-6">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
          Product finds · QC photos · Agent links
        </p>
        <h1 className="mt-2 text-[1.35rem] font-black leading-[1.12] tracking-tight sm:text-[1.75rem] lg:text-[2.1rem]">
          {HERO_HEADLINE}
        </h1>

        <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
          {HERO_SUBHEADLINE}
        </p>

        {!compact ? (
          <p className="mx-auto mt-2 max-w-2xl text-xs leading-relaxed text-muted/80 sm:text-sm">
            {HERO_ENTITY_LINE} Discover LitBuy finds organized by category — our catalog has{" "}
            {stats.totalFindsLabel}+ products with {stats.qcFindsLabel} QC-linked listings,
            updated weekly from the LitBuy spreadsheet.
          </p>
        ) : null}

        <LiveSiteSignals />

        <div className="mx-auto mt-3 grid max-w-xl grid-cols-1 gap-2 sm:grid-cols-2">
          {HERO_CTA_BUTTONS.map((cta) => (
            <SmartLink
              key={cta.label}
              href={cta.href}
              className={
                cta.primary
                  ? "control-btn-primary w-full text-sm"
                  : "control-btn w-full text-sm"
              }
            >
              {cta.label}
            </SmartLink>
          ))}
        </div>

        {!compact ? <DiscoveryQuickLinks /> : null}

        <div className="mx-auto mt-4 max-w-[700px]">
          <HeroSearch searchIndex={searchIndex} />
        </div>
      </div>
    </section>
  );
}
