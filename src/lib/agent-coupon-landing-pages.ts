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
  /** Optional distinct H1 — defaults to "{Agent} Coupons & Promo Codes". */
  h1?: string;
  ctaLabel?: string;
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

const EXTRA_BOONBUY_VARIANTS: CouponPageVariant[] = [
  {
    slug: "boonbuy-coupon-code",
    titleSuffix: "BoonBuy Coupon Code 2026 | Invite JOINUP & Promo Codes",
    h1: "BoonBuy Coupon Code",
    metaDescription:
      "Use BoonBuy coupon code / invite JOINUP for 2026 registration savings. Open the verified signup link, create your account, and confirm any live promo at checkout.",
    intro:
      "Looking for a BoonBuy coupon code or BoonBuy promo code? The verified path is invite registration with code JOINUP — not a random pasted checkout string. Open the signup link below, create your account, then confirm any welcome offer BoonBuy shows live.",
    keywordLine:
      "Searching for a BoonBuy coupon code, BoonBuy promo code, BoonBuy discount code, or invite JOINUP? Start with the verified registration link.",
    ctaLabel: "Claim BoonBuy Coupon",
  },
];

function buildVariants(agent: SeoAgentDefinition): CouponPageVariant[] {
  const isBoonBuy = agent.slug === "boonbuy";

  const variants: CouponPageVariant[] = [
    {
      slug: `${agent.slug}-coupons`,
      titleSuffix: isBoonBuy
        ? "BoonBuy Coupons 2026 | Promo Codes & Discounts"
        : `${agent.name} Coupons 2026 | Best Promo & Discount Codes`,
      h1: isBoonBuy ? "BoonBuy Coupons & Promo Codes" : undefined,
      metaDescription: isBoonBuy
        ? "Browse current BoonBuy coupons and promo options for 2026. Register with invite JOINUP, claim any live new-user offer, and shop verified finds from LitBuy Finds."
        : `Get the latest verified ${agent.name} coupons, promo codes, and discounts for 2026. Click below to claim your savings instantly.`,
      intro: isBoonBuy
        ? "BoonBuy coupons on LitBuy Finds start with verified registration — open the Claim BoonBuy Coupon button (invite JOINUP), create your account, then confirm any welcome or promo offer shown live on BoonBuy before you pay."
        : `Save money on verified ${agent.name} finds and spreadsheet products using the latest ${agent.name} coupons. Click below to claim your discount.`,
      keywordLine: isBoonBuy
        ? "Looking for BoonBuy coupons, a BoonBuy coupon, BoonBuy promo code, or BoonBuy discount code? This is the main BoonBuy coupons hub."
        : `Looking for ${agent.name} coupons, ${agent.name} coupon codes, or ${agent.name} savings? Start here.`,
      ctaLabel: isBoonBuy ? "Claim BoonBuy Coupon" : undefined,
    },
    {
      slug: `best-${agent.slug}-coupons`,
      titleSuffix: isBoonBuy
        ? "Best BoonBuy Coupons 2026 | Current Promo Options"
        : `Best ${agent.name} Coupons 2026 | Verified Promo & Discount Codes`,
      h1: isBoonBuy ? "Best BoonBuy Coupons" : undefined,
      metaDescription: isBoonBuy
        ? "Compare the best BoonBuy coupon options for 2026 — verified invite JOINUP registration, current promo paths, and links back to the main BoonBuy coupons hub."
        : `Find the best ${agent.name} coupons and verified promo codes for 2026. Claim discounts and savings on your next haul.`,
      intro: isBoonBuy
        ? "Compare the best BoonBuy coupon paths available through LitBuy Finds: verified invite signup with JOINUP, then any live new-user offer BoonBuy displays after registration. For the full hub, see all current BoonBuy coupons."
        : `Compare the best ${agent.name} coupons for verified finds, QC photos, and spreadsheet picks. Click below to claim the top ${agent.name} discount today.`,
      keywordLine: isBoonBuy
        ? "Searching for best BoonBuy coupons, best BoonBuy coupon codes, or the strongest current BoonBuy promo? Start here, then open the main coupons hub."
        : `Searching for best ${agent.name} coupons, best ${agent.name} promo codes, or the best ${agent.name} deals in 2026? This page has you covered.`,
      ctaLabel: isBoonBuy ? "Claim BoonBuy Coupon" : undefined,
    },
    {
      slug: `${agent.slug}-coupons-2026`,
      titleSuffix: isBoonBuy
        ? "BoonBuy Coupons 2026 | Latest Promo Codes"
        : `${agent.name} Coupons 2026 | Latest Promo Codes & Discounts`,
      h1: isBoonBuy ? "BoonBuy Coupons 2026" : undefined,
      metaDescription: isBoonBuy
        ? "Latest BoonBuy coupons 2026 — register with invite JOINUP and confirm live promo offers on BoonBuy. Fresh coupon-code wording for 2026 shoppers."
        : `Get ${agent.name} coupons 2026 with verified promo codes, discounts, and voucher savings. Claim your offer in one click.`,
      intro: isBoonBuy
        ? "Need BoonBuy coupons 2026 or a current BoonBuy coupon code? Use the verified JOINUP registration link below, then check BoonBuy for any live welcome promo. This page tracks 2026 wording — the main hub lives at BoonBuy coupons."
        : `Use the latest ${agent.name} coupons 2026 on verified finds and spreadsheet products. Click below to claim your 2026 ${agent.name} discount.`,
      keywordLine: isBoonBuy
        ? "Need BoonBuy coupons 2026, a BoonBuy coupon code 2026, or the latest BoonBuy coupons? Claim through JOINUP, then confirm the live offer."
        : `Need ${agent.name} coupons 2026, a current ${agent.name} voucher, or fresh ${agent.name} promo codes? Claim the latest offer below.`,
      ctaLabel: isBoonBuy ? "Claim BoonBuy Coupon" : undefined,
    },
    ...(agent.slug === "litbuy" ? EXTRA_LITBUY_VARIANTS : []),
    ...(isBoonBuy ? EXTRA_BOONBUY_VARIANTS : []),
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
    ...(agent.slug === "boonbuy"
      ? [
          "boonbuy coupon",
          "boonbuy promo code",
          "boonbuy discount code",
          "boonbuy invite code",
          "boonbuy JOINUP",
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

const BOONBUY_COUPON_SECTIONS: StaticPageSection[] = [
  {
    heading: "What BoonBuy coupon is available?",
    paragraphs: [
      "The current BoonBuy promotion path on LitBuy Finds is verified registration with invite code JOINUP. That invite unlocks account creation through our affiliate link — any welcome credit, coupon pack, or checkout promo is shown live on BoonBuy after signup.",
      "We do not invent pasted discount strings. If BoonBuy displays an extra checkout code after registration, use that live value inside your BoonBuy account.",
    ],
    links: [
      { href: "/boonbuy-coupons", label: "BoonBuy coupons hub" },
      { href: "/boonbuy-coupon-code", label: "BoonBuy coupon code" },
    ],
  },
  {
    heading: "How to claim BoonBuy coupons",
    paragraphs: [
      "1) Tap Claim BoonBuy Coupon to open the official registration page with invite JOINUP. 2) Create your BoonBuy account. 3) Check wallet, banners, or checkout for any new-user offer. 4) Import finds from LitBuy Finds and confirm the live total before paying.",
      "JOINUP is an invite / referral registration code, not a guaranteed free-shipping sticker. Always verify what BoonBuy shows for your region and account type.",
    ],
    links: [
      { href: "/boonbuy-finds", label: "BoonBuy finds" },
      { href: "/boonbuy-spreadsheet", label: "BoonBuy spreadsheet" },
      { href: "/telegram-boonbuy", label: "BoonBuy Telegram" },
    ],
  },
  {
    heading: "Useful BoonBuy resources",
    paragraphs: [
      "After you register, browse BoonBuy finds for searchable product pages, open the BoonBuy spreadsheet for sheet-style discovery, or join BoonBuy Telegram / Discord for community drops. Coupon savings pair best with a shortlist of verified listings.",
    ],
    links: [
      { href: "/boonbuy-finds", label: "BoonBuy finds catalog" },
      { href: "/boonbuy-spreadsheet", label: "BoonBuy spreadsheet" },
      { href: "/telegram-boonbuy", label: "BoonBuy Telegram" },
      { href: "/discord-boonbuy", label: "BoonBuy Discord" },
      { href: "/boonbuy-review", label: "BoonBuy review" },
    ],
  },
];

const BOONBUY_COUPON_FAQS = [
  {
    question: "What are BoonBuy coupons?",
    answer:
      "BoonBuy coupons on LitBuy Finds refer to registration and checkout promotions unlocked through the verified invite link (JOINUP). Exact welcome credits or checkout discounts appear live inside BoonBuy after you create an account.",
  },
  {
    question: "Is JOINUP a BoonBuy coupon code?",
    answer:
      "JOINUP is the invite / referral code used on the official BoonBuy registration URL. It is not a random pasted checkout string we invent — open the verified signup link, register, then confirm any promo BoonBuy shows on your account.",
  },
  {
    question: "How do I claim a BoonBuy promo code?",
    answer:
      "Click Claim BoonBuy Coupon on this page, finish registration with invite JOINUP, then check BoonBuy wallet or checkout for any active offer before paying.",
  },
  {
    question: "Are there BoonBuy coupons for 2026?",
    answer:
      "Yes — use the BoonBuy coupons 2026 page for year-focused wording, or this hub for the full cluster. Offers can change; always confirm the live total on BoonBuy.",
  },
  {
    question: "Where is the main BoonBuy coupons page?",
    answer:
      "The primary BoonBuy coupons hub is /boonbuy-coupons. Supporting pages for best coupons, 2026 wording, and coupon-code searches link back there.",
  },
] as const;

const BOONBUY_BEST_SECTIONS: StaticPageSection[] = [
  {
    heading: "Best BoonBuy coupon options right now",
    paragraphs: [
      "The strongest current path is verified invite registration with JOINUP, then whatever new-user promo BoonBuy displays live. That beats hunting unverified screenshots of random codes.",
      "Use this page to compare options; open the main BoonBuy coupons hub when you want the full claim guide, FAQ, and resource links.",
    ],
    links: [
      { href: "/boonbuy-coupons", label: "See all current BoonBuy coupons" },
      { href: "/boonbuy-coupon-code", label: "BoonBuy coupon code" },
      { href: "/boonbuy-coupons-2026", label: "BoonBuy coupons 2026" },
    ],
  },
];

const BOONBUY_2026_SECTIONS: StaticPageSection[] = [
  {
    heading: "BoonBuy coupons for 2026 shoppers",
    paragraphs: [
      "If you searched BoonBuy coupons 2026 or BoonBuy coupon code 2026, register with invite JOINUP and confirm any live promo on BoonBuy. We keep 2026 wording here without inventing fake “updated today” claims.",
      "For the complete hub — claim steps, resources, and FAQ — return to BoonBuy coupons.",
    ],
    links: [
      { href: "/boonbuy-coupons", label: "BoonBuy coupons" },
      { href: "/best-boonbuy-coupons", label: "Best BoonBuy coupons" },
    ],
  },
];

const BOONBUY_CODE_SECTIONS: StaticPageSection[] = [
  {
    heading: "How BoonBuy coupon codes work",
    paragraphs: [
      "Most BoonBuy savings on LitBuy Finds come from invite registration (JOINUP), not a manually typed checkout code. After signup, BoonBuy may show additional wallet or checkout promos — use those live values only.",
      "Do not trust random “working codes” lists. Start from the verified Claim BoonBuy Coupon button, then confirm totals inside BoonBuy.",
    ],
    links: [
      { href: "/boonbuy-coupons", label: "BoonBuy coupons hub" },
      { href: "/best-boonbuy-coupons", label: "Best BoonBuy coupons" },
    ],
  },
];

function buildPageConfig(
  agent: SeoAgentDefinition,
  variant: CouponPageVariant,
  siblingVariants: CouponPageVariant[]
): AgentCouponLandingConfig {
  const path = `/${variant.slug}`;
  const isLitbuy = agent.slug === "litbuy";
  const isBoonBuy = agent.slug === "boonbuy";
  const isBoonBuyHub = variant.slug === "boonbuy-coupons";
  const isBoonBuyBest = variant.slug === "best-boonbuy-coupons";
  const isBoonBuy2026 = variant.slug === "boonbuy-coupons-2026";
  const isBoonBuyCode = variant.slug === "boonbuy-coupon-code";

  const boonbuySections = isBoonBuyHub
    ? BOONBUY_COUPON_SECTIONS
    : isBoonBuyBest
      ? BOONBUY_BEST_SECTIONS
      : isBoonBuy2026
        ? BOONBUY_2026_SECTIONS
        : isBoonBuyCode
          ? BOONBUY_CODE_SECTIONS
          : undefined;

  return {
    slug: variant.slug,
    path,
    agent,
    title: variant.titleSuffix,
    metaDescription: variant.metaDescription,
    h1: variant.h1 ?? `${agent.name} Coupons & Promo Codes`,
    intro: variant.intro,
    keywordLine: variant.keywordLine,
    ctaLabel: variant.ctaLabel ?? `Claim ${agent.name} Coupon ✅`,
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
    ...(isBoonBuy && boonbuySections
      ? {
          sections: boonbuySections,
          faqs: isBoonBuyHub || isBoonBuyCode ? [...BOONBUY_COUPON_FAQS] : [
            {
              question: "Where are all current BoonBuy coupons?",
              answer:
                "See the main BoonBuy coupons hub at /boonbuy-coupons for claim steps, JOINUP registration, FAQs, and BoonBuy finds / spreadsheet / Telegram links.",
            },
            {
              question: "Is JOINUP a discount code I paste at checkout?",
              answer:
                "JOINUP is the invite code on the official BoonBuy registration URL. Register first, then confirm any live promo BoonBuy shows on your account or checkout.",
            },
          ],
        }
      : {}),
    footerLinks: buildCouponFooterLinks(
      agent,
      path,
      siblingVariants.map((entry) => ({
        href: `/${entry.slug}`,
        label:
          entry.h1 ??
          entry.titleSuffix.split(" | ")[0],
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
        : isBoonBuy
          ? [
              { href: "/boonbuy-coupons", label: "BoonBuy coupons hub" },
              { href: "/boonbuy-spreadsheet", label: "BoonBuy spreadsheet" },
              { href: "/telegram-boonbuy", label: "BoonBuy Telegram" },
              { href: "/discord-boonbuy", label: "BoonBuy Discord" },
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
