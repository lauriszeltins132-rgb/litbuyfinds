import type { StaticPageSection } from "./static-pages";
import {
  SEO_AGENTS,
  type SeoAgentDefinition,
  buildCouponFooterLinks,
} from "./agent-seo-shared";
import { LITBUY_COUPONS_PATH } from "./litbuy-coupons-page";

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
  sections?: StaticPageSection[];
  faqs?: { question: string; answer: string }[];
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
    slug: "litbuy-coupon-code",
    titleSuffix: "LitBuy Coupon Code 2026 | Working Promo & Referral Codes",
    metaDescription:
      "Get a working LitBuy coupon code for 2026 — welcome coupons, shipping discounts, and verified referral codes. Claim your LitBuy coupon code in one click.",
    intro:
      "Redeem the latest LitBuy coupon code on verified finds and spreadsheet products. Register through our link to unlock welcome coupons and shipping savings.",
    keywordLine:
      "Searching for a LitBuy coupon code, LitBuy promo code, or LitBuy referral code? Claim the verified offer below.",
  },
  {
    slug: "litbuy-discount-code",
    titleSuffix: "LitBuy Discount Code 2026 | Coupons & Shipping Savings",
    metaDescription:
      "Claim a LitBuy discount code for shipping and checkout savings in 2026. Verified coupons, promo offers, and new-user welcome packs.",
    intro:
      "Use the current LitBuy discount code to save on international shipping and welcome coupons when you register. Always confirm the live offer on LitBuy checkout.",
    keywordLine:
      "Looking for a LitBuy discount code, LitBuy discount, or LitBuy savings code? Start with the verified registration link below.",
  },
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
  const variants: CouponPageVariant[] = [
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

  // Year page is an authority support landing with unique 2026 intent.
  if (agent.slug === "litbuy") {
    return variants.filter((variant) => variant.slug !== "litbuy-coupons-2026");
  }

  return variants;
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
    ...(agent.slug === "litbuy"
      ? [
          "litbuy shipping coupon",
          "litbuy discount code",
          "litbuy coupon code",
        ]
      : []),
  ];
}

const LITBUY_COUPON_SECTIONS: StaticPageSection[] = [
  {
    heading: "How to redeem LitBuy coupons",
    paragraphs: [
      "Click the registration button on this page and create a LitBuy account through the verified referral link. After signup, check your LitBuy wallet or checkout screen for the welcome coupon pack and shipping discount.",
      "Add finds from LitBuy Finds to your cart on LitBuy, confirm the live coupon total at checkout, then pay. Shipping coupons apply when you submit an international parcel — product prices are separate from freight savings.",
    ],
    links: [
      { href: LITBUY_COUPONS_PATH, label: "Canonical LitBuy coupons" },
      { href: "/how-to-save-on-shipping", label: "Save on shipping guide" },
      { href: "/litbuy-shipping-coupon", label: "Shipping coupon guide" },
    ],
  },
  {
    heading: "Shipping savings with LitBuy coupons",
    paragraphs: [
      "International shipping is often the largest haul cost. LitBuy shipping coupons can reduce freight on your first parcel — especially when combined with the new-user welcome pack. Always compare the live shipping line total on LitBuy before paying.",
      "Pair coupons with verified finds from the LitBuy spreadsheet catalog — shipping savings matter more when your cart has multiple items ready to ship together.",
    ],
    links: [
      { href: "/litbuy-spreadsheet", label: "LitBuy spreadsheet" },
      { href: "/sneaker-finds", label: "Sneaker finds" },
      { href: "/clothing-finds", label: "Clothing finds" },
    ],
  },
];

const LITBUY_COUPON_FAQS = [
  {
    question: "What is the best LitBuy coupon code?",
    answer:
      "The best working LitBuy coupon bundles a new-user welcome pack with shipping savings when you register through our verified link. Confirm the live offer on LitBuy checkout — promo codes can change by region and account type.",
  },
  {
    question: "How do I use a LitBuy discount code?",
    answer:
      "Register through the verified link on this page, create your LitBuy account, and check that welcome coupons appear in your wallet or at checkout. Shipping discounts apply when you pay international freight on a parcel.",
  },
  {
    question: "Is there a LitBuy shipping coupon?",
    answer:
      "Yes. New users can unlock shipping savings through the registration promotion linked on this page. Shipping coupons reduce international freight — they do not change individual product prices on Weidian or Taobao.",
  },
  {
    question: "Do LitBuy coupons expire?",
    answer:
      "LitBuy coupon and promo offers can change by season and account type. We update coupon pages when offers stop working at checkout. Always verify the live total before paying.",
  },
  {
    question: "Where is the canonical LitBuy coupons page?",
    answer:
      "The main LitBuy coupons hub lives at /litbuy-coupons on LitBuy Finds — this page is a focused variant for specific search terms like coupon code or discount code.",
  },
] as const;

function buildPageConfig(
  agent: SeoAgentDefinition,
  variant: CouponPageVariant,
  siblingVariants: CouponPageVariant[]
): AgentCouponLandingConfig {
  const path = `/${variant.slug}`;
  const isLitbuy = agent.slug === "litbuy";

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
    ...(isLitbuy
      ? {
          sections: LITBUY_COUPON_SECTIONS,
          faqs: [...LITBUY_COUPON_FAQS],
        }
      : {}),
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
      ...(isLitbuy
        ? [
            { href: LITBUY_COUPONS_PATH, label: "LitBuy coupons hub" },
            { href: "/litbuy-spreadsheet", label: "LitBuy spreadsheet" },
            { href: "/latest-finds", label: "Latest finds" },
          ]
        : [
            { href: `/telegram-${agent.slug}`, label: `${agent.name} Telegram` },
            { href: `/discord-${agent.slug}`, label: `${agent.name} Discord` },
          ]),
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
