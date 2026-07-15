import {
  LITBUY_OFFER_DESCRIPTION,
  LITBUY_OFFER_HEADLINE,
  LITBUY_SIGNUP_URL,
} from "./constants";

export type LitbuyCouponLandingConfig = {
  slug: string;
  path: string;
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

const PAGES = [
  {
    slug: "litbuy-coupons",
    title: "LitBuy Coupons 2026 | Best Promo & Discount Codes",
    metaDescription:
      "Get the latest verified LitBuy coupons, promo codes, and discounts for 2026. Click below to claim your savings instantly.",
    intro:
      "Save money on verified LitBuy finds and spreadsheet products using the latest LitBuy coupons. Click below to claim your discount.",
    keywordLine:
      "Looking for LitBuy coupons, LitBuy coupon codes, daily LitBuy coupon updates, or LitBuy savings? Start here.",
  },
  {
    slug: "best-litbuy-coupons",
    title: "Best LitBuy Coupons 2026 | Verified Promo & Discount Codes",
    metaDescription:
      "Find the best LitBuy coupons and verified promo codes for 2026. Claim shipping discounts and savings on your next haul.",
    intro:
      "Compare the best LitBuy coupons for verified finds, QC photos, and spreadsheet picks. Click below to claim the top LitBuy discount today.",
    keywordLine:
      "Searching for best LitBuy coupons, best LitBuy promo codes, or the best LitBuy deals in 2026? This page has you covered.",
  },
  {
    slug: "litbuy-coupons-2026",
    title: "LitBuy Coupons 2026 | Latest Promo Codes & Discounts",
    metaDescription:
      "Get LitBuy coupons 2026 with verified promo codes, shipping discounts, and voucher savings. Claim your offer in one click.",
    intro:
      "Use the latest LitBuy coupons 2026 on verified finds and spreadsheet products. Click below to claim your 2026 LitBuy discount.",
    keywordLine:
      "Need LitBuy coupons 2026, a current LitBuy voucher, or fresh LitBuy promo codes? Claim the latest offer below.",
  },
  {
    slug: "litbuy-discount",
    title: "LitBuy Discount 2026 | Coupons, Promo Codes & Savings",
    metaDescription:
      "Claim a verified LitBuy discount for shipping and checkout savings in 2026. Latest coupons, promo codes, and voucher deals.",
    intro:
      "Unlock LitBuy discount savings on verified finds, QC-approved products, and spreadsheet links. Click below to claim your coupon.",
    keywordLine:
      "Looking for a LitBuy discount, LitBuy savings, or LitBuy voucher codes? Claim the verified offer below.",
  },
  {
    slug: "litbuy-promo",
    title: "LitBuy Promo 2026 | Coupon Codes & Discount Offers",
    metaDescription:
      "Get the latest LitBuy promo codes, coupons, and discount offers for 2026. Click below to claim verified savings instantly.",
    intro:
      "Redeem the latest LitBuy promo on verified finds and spreadsheet products. Click below to claim your coupon and start saving.",
    keywordLine:
      "Searching for a LitBuy promo, LitBuy promo code, or daily LitBuy coupon? Claim the verified offer below.",
  },
] as const;

const SHARED_KEYWORDS = [
  "litbuy coupons",
  "best litbuy coupons",
  "litbuy coupons 2026",
  "litbuy discount",
  "litbuy promo",
  "litbuy voucher",
  "daily litbuy coupon",
  "litbuy coupon code",
  "litbuy savings",
  "litbuy deals",
];

function buildPageConfig(
  page: (typeof PAGES)[number]
): LitbuyCouponLandingConfig {
  return {
    slug: page.slug,
    path: `/${page.slug}`,
    title: page.title,
    metaDescription: page.metaDescription,
    h1: "LitBuy Coupons & Promo Codes",
    intro: page.intro,
    keywordLine: page.keywordLine,
    ctaLabel: "Claim LitBuy Coupon ✅",
    couponUrl: LITBUY_SIGNUP_URL,
    offerHeadline: LITBUY_OFFER_HEADLINE,
    offerDescription: LITBUY_OFFER_DESCRIPTION,
    keywords: SHARED_KEYWORDS,
    footerLinks: [
      { href: "/", label: "LitBuy Finds homepage" },
      { href: "/recently-added", label: "New finds" },
      { href: "/litbuy-finds", label: "LitBuy finds" },
      { href: "/deals", label: "Deals" },
      ...PAGES.filter((entry) => entry.slug !== page.slug).map((entry) => ({
        href: `/${entry.slug}`,
        label: entry.title.split(" | ")[0],
      })),
    ],
    relatedDeals: [
      { href: "/deals", label: "Best deals" },
      { href: "/recently-added", label: "Recently added finds" },
      { href: "/best-budget-finds", label: "Budget finds" },
      { href: "/litbuy-finds", label: "LitBuy finds catalog" },
    ],
  };
}

export const LITBUY_COUPON_LANDING_PAGES: Record<
  string,
  LitbuyCouponLandingConfig
> = Object.fromEntries(
  PAGES.map((page) => [page.slug, buildPageConfig(page)])
);

export const LITBUY_COUPON_LANDING_SLUGS = PAGES.map((page) => page.slug);

export function getLitbuyCouponLandingPage(
  slug: string
): LitbuyCouponLandingConfig | undefined {
  return LITBUY_COUPON_LANDING_PAGES[slug];
}
