import { getDatasetSyncedIso } from "./catalog-meta";
import {
  LITBUY_OFFER_DESCRIPTION,
  LITBUY_OFFER_HEADLINE,
  LITBUY_SIGNUP_URL,
} from "./constants";
import { formatContentDate } from "./content-dates";

export const LITBUY_COUPONS_PATH = "/litbuy-coupons";

/** LitBuy coupon URL variants — all 301 to /litbuy-coupons */
export const LITBUY_COUPON_REDIRECT_SLUGS = [
  "litbuy-coupon",
  "litbuy-coupon-code",
  "litbuy-promo-code",
  "litbuy-referral-code",
  "litbuy-referral-bonus",
  "litbuy-discount",
  "litbuy-discount-code",
  "litbuy-promo",
  "litbuy-coupons-2026",
  "best-litbuy-coupon",
  "best-litbuy-coupons",
] as const;

export type LitbuyCouponRow = {
  coupon: string;
  discount: string;
  status: "Active" | "Check at checkout";
  updated: string;
};

export function getLitbuyCouponsLastUpdated(): string {
  return formatContentDate(getDatasetSyncedIso());
}

export function getLitbuyCouponRows(): LitbuyCouponRow[] {
  const updated = getLitbuyCouponsLastUpdated();
  return [
    {
      coupon: "New user shipping discount (referral link)",
      discount: "Up to 30% off international shipping",
      status: "Active",
      updated,
    },
    {
      coupon: "Free LitBuy registration",
      discount: "QC photos, order tracking, verified buy links",
      status: "Active",
      updated,
    },
  ];
}

export const LITBUY_COUPONS_METADATA = {
  title: "Best LitBuy Coupon Codes (2026) | Working Promo Codes",
  description:
    "Get the latest verified LitBuy coupon codes and promo offers. Save on shipping, unlock discounts and find the best LitBuy coupons updated regularly.",
  h1: "Best LitBuy Coupon Codes",
  heroIntro:
    "LitBuy Finds tracks the current working LitBuy coupon and referral offer for new accounts — including the shipping discount available when you register through our verified referral link. Confirm the live total on LitBuy checkout before paying.",
};

export const LITBUY_COUPONS_FAQS = [
  {
    question: "What is the best LitBuy coupon code in 2026?",
    answer:
      "The primary offer promoted on LitBuy Finds is a new-user shipping discount when you register through our referral link. LitBuy may run additional promotions at checkout — always verify the live offer on litbuy.com before paying.",
  },
  {
    question: "Is there a working LitBuy promo code?",
    answer:
      "Yes. New users can claim the current shipping discount by registering through the verified link on this page. We remove offers from this page when they stop working at checkout.",
  },
  {
    question: "What is the difference between a LitBuy coupon and referral code?",
    answer:
      "A referral code (invite code) is tied to registration — it can unlock welcome shipping credits or account benefits. A coupon is usually applied at checkout for shipping or fees. On LitBuy, registration through a referral link often combines both.",
  },
  {
    question: "Do LitBuy coupons expire?",
    answer:
      "Promotions can change without notice. The table on this page is updated when we re-verify offers. If a discount does not apply at checkout, check LitBuy's promotions page directly.",
  },
  {
    question: "How much can I save with a LitBuy coupon?",
    answer:
      "Savings depend on your haul weight, shipping line, and whether you are a new user. Shipping is often a large share of total cost — a shipping discount on registration can materially reduce your first international parcel fee, but product prices are separate.",
  },
  {
    question: "Why use LitBuy Finds for coupon links?",
    answer:
      "We manually verify that registration links open the correct LitBuy signup flow, update this page when offers change, and pair coupons with a searchable catalog of real finds, QC references, and LitBuy AI search.",
  },
] as const;

export const LITBUY_COUPONS_INTERNAL_LINKS = [
  { href: "/", label: "Homepage" },
  { href: "/ai", label: "LitBuy AI" },
  { href: "/litbuy-spreadsheet", label: "LitBuy spreadsheet" },
  { href: "/latest", label: "Latest finds" },
  { href: "/guides", label: "Guides" },
  { href: "/litbuy-qc-photos", label: "QC photos guide" },
  { href: "/how-to-use-litbuy", label: "How to use LitBuy" },
  { href: "/litbuy-finds", label: "LitBuy Finds catalog" },
] as const;

export const LITBUY_COUPONS_TRUST_SIGNALS = [
  "Coupons manually verified before listing",
  "Updated when catalog sync runs",
  "Community-tested registration flow",
  "No expired codes shown as active",
] as const;

export const LITBUY_COUPONS_CTA = {
  label: "Claim LitBuy Coupon",
  url: LITBUY_SIGNUP_URL,
  headline: LITBUY_OFFER_HEADLINE,
  description: LITBUY_OFFER_DESCRIPTION,
};
