import {
  SEO_AGENTS,
  type SeoAgentDefinition,
  buildCouponFooterLinks,
} from "./agent-seo-shared";

export type AgentCouponLandingConfig = {
  slug: string;
  path: string;
  agent: SeoAgentDefinition;
  title: string;
  metaDescription: string;
  h1: string;
  intro: string;
  keywordLine: string;
  ctaLabel: string;
  couponUrl: string;
  offerHeadline: string;
  offerDescription: string;
  keywords: string[];
  footerLinks: { href: string; label: string }[];
  relatedDeals: { href: string; label: string }[];
};

type CouponPageVariant = {
  slug: string;
  titleSuffix: string;
  metaDescription: string;
  intro: string;
  keywordLine: string;
};

const EXTRA_LITBUY_VARIANTS: CouponPageVariant[] = [
  {
    slug: "litbuy-discount",
    titleSuffix: "LitBuy Discount 2026 | Coupons, Promo Codes & Savings",
    metaDescription:
      "Claim a verified LitBuy discount for shipping and checkout savings in 2026. Latest coupons, promo codes, and voucher deals.",
    intro:
      "Unlock LitBuy discount savings on verified finds, QC-approved products, and spreadsheet links. Click below to claim your coupon.",
    keywordLine:
      "Looking for a LitBuy discount, LitBuy savings, or LitBuy voucher codes? Claim the verified offer below.",
  },
  {
    slug: "litbuy-promo",
    titleSuffix: "LitBuy Promo 2026 | Coupon Codes & Discount Offers",
    metaDescription:
      "Get the latest LitBuy promo codes, coupons, and discount offers for 2026. Click below to claim verified savings instantly.",
    intro:
      "Redeem the latest LitBuy promo on verified finds and spreadsheet products. Click below to claim your coupon and start saving.",
    keywordLine:
      "Searching for a LitBuy promo, LitBuy promo code, or daily LitBuy coupon? Claim the verified offer below.",
  },
];

function buildVariants(agent: SeoAgentDefinition): CouponPageVariant[] {
  return [
    {
      slug: `${agent.slug}-coupons`,
      titleSuffix: `${agent.name} Coupons 2026 | Best Promo & Discount Codes`,
      metaDescription: `Get the latest verified ${agent.name} coupons, promo codes, and discounts for 2026. Click below to claim your savings instantly.`,
      intro: `Save money on verified ${agent.name} finds and spreadsheet products using the latest ${agent.name} coupons. Click below to claim your discount.`,
      keywordLine: `Looking for ${agent.name} coupons, ${agent.name} coupon codes, or ${agent.name} savings? Start here.`,
    },
    {
      slug: `best-${agent.slug}-coupons`,
      titleSuffix: `Best ${agent.name} Coupons 2026 | Verified Promo & Discount Codes`,
      metaDescription: `Find the best ${agent.name} coupons and verified promo codes for 2026. Claim discounts and savings on your next haul.`,
      intro: `Compare the best ${agent.name} coupons for verified finds, QC photos, and spreadsheet picks. Click below to claim the top ${agent.name} discount today.`,
      keywordLine: `Searching for best ${agent.name} coupons, best ${agent.name} promo codes, or the best ${agent.name} deals in 2026? This page has you covered.`,
    },
    {
      slug: `${agent.slug}-coupons-2026`,
      titleSuffix: `${agent.name} Coupons 2026 | Latest Promo Codes & Discounts`,
      metaDescription: `Get ${agent.name} coupons 2026 with verified promo codes, discounts, and voucher savings. Claim your offer in one click.`,
      intro: `Use the latest ${agent.name} coupons 2026 on verified finds and spreadsheet products. Click below to claim your 2026 ${agent.name} discount.`,
      keywordLine: `Need ${agent.name} coupons 2026, a current ${agent.name} voucher, or fresh ${agent.name} promo codes? Claim the latest offer below.`,
    },
    ...(agent.slug === "litbuy" ? EXTRA_LITBUY_VARIANTS : []),
  ];
}

function buildKeywords(agent: SeoAgentDefinition): string[] {
  const agentLower = agent.name.toLowerCase();

  return [
    `${agentLower} coupons`,
    `best ${agentLower} coupons`,
    `${agentLower} coupons 2026`,
    `${agentLower} discount`,
    `${agentLower} promo`,
    `${agentLower} voucher`,
    `${agentLower} coupon code`,
    `${agentLower} savings`,
    `${agentLower} deals`,
  ];
}

function buildPageConfig(
  agent: SeoAgentDefinition,
  variant: CouponPageVariant,
  siblingVariants: CouponPageVariant[]
): AgentCouponLandingConfig {
  const path = `/${variant.slug}`;

  return {
    slug: variant.slug,
    path,
    agent,
    title: variant.titleSuffix,
    metaDescription: variant.metaDescription,
    h1: `${agent.name} Coupons & Promo Codes`,
    intro: variant.intro,
    keywordLine: variant.keywordLine,
    ctaLabel: `Claim ${agent.name} Coupon ✅`,
    couponUrl: agent.signupUrl,
    offerHeadline: agent.offerHeadline,
    offerDescription: agent.offerDescription,
    keywords: buildKeywords(agent),
    footerLinks: buildCouponFooterLinks(
      agent,
      path,
      siblingVariants.map((entry) => ({
        href: `/${entry.slug}`,
        label: entry.titleSuffix.split(" | ")[0],
      }))
    ),
    relatedDeals: [
      { href: "/deals", label: "Best deals" },
      { href: "/recently-added", label: "Recently added finds" },
      { href: agent.findsPath, label: `${agent.name} finds catalog` },
      { href: `/telegram-${agent.slug}`, label: `${agent.name} Telegram` },
      { href: `/discord-${agent.slug}`, label: `${agent.name} Discord` },
    ],
  };
}

const ALL_VARIANTS = SEO_AGENTS.flatMap((agent) => {
  const variants = buildVariants(agent);
  return variants.map((variant) =>
    buildPageConfig(agent, variant, variants)
  );
});

export const AGENT_COUPON_LANDING_PAGES: Record<string, AgentCouponLandingConfig> =
  Object.fromEntries(ALL_VARIANTS.map((page) => [page.slug, page]));

export const AGENT_COUPON_LANDING_SLUGS = ALL_VARIANTS.map((page) => page.slug);

export function getAgentCouponLandingPage(
  slug: string
): AgentCouponLandingConfig | undefined {
  return AGENT_COUPON_LANDING_PAGES[slug];
}
