import { getDatasetSyncedIso } from "./catalog-meta";
import { LITBUY_INVITE_CODE, LITBUY_SIGNUP_URL } from "./constants";
import { formatContentDate } from "./content-dates";

export const LITBUY_COUPONS_PATH = "/litbuy-coupons";
export const LITBUY_COUPON_SIGNUP_URL = LITBUY_SIGNUP_URL;
export { LITBUY_INVITE_CODE };

/** LitBuy coupon URL variants — thin aliases still 301 to /litbuy-coupons */
export const LITBUY_COUPON_REDIRECT_SLUGS = [
  "litbuy-coupon",
  "litbuy-promo-code",
  "litbuy-referral-code",
  "litbuy-referral-bonus",
  "litbuy-discount",
  "litbuy-promo",
  "best-litbuy-coupon",
] as const;

/** Primary registration offer shown on the canonical LitBuy coupon page */
export const LITBUY_COUPONS_OFFER = {
  welcomePack: "$500",
  welcomePackLabel: "Welcome coupon pack",
  shippingDiscount: "40% OFF",
  shippingDiscountLabel: "International shipping",
  headline: "$500 Coupon Pack + 40% Off Shipping",
  subline:
    "Register through our verified LitBuy coupon link to unlock the new-user welcome pack and shipping discount.",
  disclaimer:
    "Offers apply to eligible new LitBuy accounts. Confirm the live coupon total on LitBuy checkout before paying.",
} as const;

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
      coupon: "LitBuy new-user coupon pack (registration)",
      discount: "Up to $500 in welcome coupons",
      status: "Active",
      updated,
    },
    {
      coupon: "LitBuy shipping coupon (referral link)",
      discount: "Up to 40% off international shipping",
      status: "Active",
      updated,
    },
    {
      coupon: "LitBuy referral / invite code (SMKS)",
      discount: "Bundles welcome coupons + shipping discount",
      status: "Active",
      updated,
    },
    {
      coupon: "Free LitBuy account",
      discount: "QC photos, order tracking, verified buy links",
      status: "Active",
      updated,
    },
  ];
}

export const LITBUY_COUPONS_METADATA = {
  title: "Best LitBuy Coupon Codes (2026) | $500 + 40% Off Promo",
  description:
    "Claim the working LitBuy coupon for 2026 — up to $500 in welcome coupons plus 40% off shipping when you register. Verified LitBuy coupon codes, promo offers and referral bonuses updated regularly.",
  h1: "Best LitBuy Coupon Codes",
  heroIntro:
    "This is the canonical LitBuy coupon page for litbuyfinds.io. New users who register through our verified link can unlock up to $500 in LitBuy welcome coupons plus up to 40% off international shipping. We track working LitBuy coupon codes and promo offers here — confirm the live discount on LitBuy checkout before paying.",
};

export const LITBUY_COUPONS_FAQS = [
  {
    question: "What are LitBuy coupons?",
    answer:
      "LitBuy coupons are registration and checkout discounts for LitBuy agent shoppers — typically a new-user welcome coupon pack plus shipping savings. On LitBuy Finds, the verified LitBuy coupons hub explains the current offer and links to official registration so you can confirm the live total before paying.",
  },
  {
    question: "What is the best LitBuy coupon code in 2026?",
    answer:
      "The best working LitBuy coupon on LitBuy Finds bundles a new-user welcome pack (up to $500 in coupons) with up to 40% off international shipping when you register through our verified referral link. LitBuy may show additional promo codes at checkout — always verify the live offer on litbuy.com.",
  },
  {
    question: "How do LitBuy coupon codes work?",
    answer:
      "Most LitBuy coupon value is unlocked at registration through a verified referral / invite link (invite code SMKS on this page). After signup, welcome coupons appear in your LitBuy account and shipping discounts apply at parcel checkout. Always confirm the live total on LitBuy before paying — third-party code dumps often list expired offers.",
  },
  {
    question: "Is there a working LitBuy promo code?",
    answer:
      "Yes. New users can claim the current LitBuy coupon by registering through the verified link on this page. The offer includes welcome coupons and a shipping discount — we remove codes from this page when they stop working at checkout.",
  },
  {
    question: "Does LitBuy give $500 in coupons when you register?",
    answer:
      "Eligible new accounts can receive up to $500 in LitBuy welcome coupons through the registration promotion linked on this page, plus shipping savings. The exact coupon breakdown appears in your LitBuy account after signup — confirm before your first haul.",
  },
  {
    question: "What is the difference between a LitBuy coupon and referral code?",
    answer:
      "A referral code (invite code) is tied to registration — it can unlock welcome coupon packs and account credits. A coupon is usually applied at checkout for shipping or fees. On LitBuy, registration through a referral link often combines both into one working LitBuy coupon offer.",
  },
  {
    question: "How do LitBuy shipping discounts work?",
    answer:
      "Eligible new accounts can unlock up to 40% off international shipping when registering through the verified LitBuy coupon link on this page. Shipping lines, weight, and destination still determine the final fee — confirm the discounted total in LitBuy checkout before you submit a parcel.",
  },
  {
    question: "Do LitBuy coupons expire?",
    answer:
      "LitBuy coupon and promo offers can change by season, region, and account type. We update the comparison table when we re-verify offers. If checkout does not show the expected $500 pack or shipping discount, check LitBuy's live promotions page.",
  },
  {
    question: "How are agent coupon updates tracked?",
    answer:
      "We re-check the LitBuy registration and shipping offer when catalog sync runs and when community reports change. Working LitBuy coupons stay listed as Active; expired or unverified codes are removed so this LitBuy coupons page stays accurate for shoppers.",
  },
  {
    question: "How much can I save with a LitBuy coupon?",
    answer:
      "New users may save with up to $500 in welcome coupons plus up to 40% off international shipping on registration. Product prices are separate — shipping is often the largest haul cost, so the shipping coupon alone can materially reduce your first parcel fee.",
  },
  {
    question: "Why use LitBuy Finds for coupon links?",
    answer:
      "We manually verify that LitBuy coupon links open the correct signup flow, update this page when offers change, and pair coupons with a searchable catalog of real finds, QC references, and LitBuy AI search.",
  },
  {
    question: "How do I use a LitBuy coupon?",
    answer:
      "Click the registration button on this page, create a LitBuy account, and confirm the welcome coupon pack and shipping discount appear at checkout before paying for your haul.",
  },
] as const;

export const LITBUY_COUPONS_INTERNAL_LINKS = [
  { href: "/", label: "Homepage" },
  { href: "/finds", label: "Finds hub" },
  { href: "/litbuy-finds", label: "LitBuy finds" },
  { href: "/litbuy-spreadsheet", label: "LitBuy spreadsheet" },
  { href: "/litbuy-discord", label: "LitBuy Discord" },
  { href: "/telegram-litbuy", label: "LitBuy Telegram" },
  { href: "/litbuy-shipping-coupon", label: "Shipping coupon guide" },
  { href: "/how-to-save-on-shipping", label: "Save on shipping" },
  { href: "/sneaker-finds", label: "Sneaker finds" },
  { href: "/clothing-finds", label: "Clothing finds" },
  { href: "/best-rep-finds", label: "Best rep finds" },
  { href: "/latest-finds", label: "Latest finds" },
  { href: "/guides", label: "Guides" },
  { href: "/litbuy-qc-photos", label: "QC photos guide" },
  { href: "/how-to-use-litbuy", label: "How to use LitBuy" },
] as const;

export const LITBUY_COUPONS_TRUST_SIGNALS = [
  "LitBuy coupons manually verified before listing",
  "Updated when catalog sync runs",
  "Community-tested registration flow",
  "No expired LitBuy coupon codes shown as active",
] as const;

export const LITBUY_COUPONS_CTA = {
  label: "Claim $500 Coupon + 40% Off",
  url: LITBUY_SIGNUP_URL,
  headline: LITBUY_COUPONS_OFFER.headline,
  description: LITBUY_COUPONS_OFFER.subline,
};
