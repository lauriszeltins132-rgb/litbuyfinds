import { getDatasetSyncedIso } from "./catalog-meta";
import type { AuthorityPage } from "./authority-page-types";
import {
  LITBUY_COUPON_SIGNUP_URL,
  LITBUY_COUPONS_OFFER,
  LITBUY_COUPONS_PATH,
  LITBUY_INVITE_CODE,
  getLitbuyCouponRows,
  getLitbuyCouponsLastUpdated,
} from "./litbuy-coupons-page";

const PUBLISHED = "2026-08-20T00:00:00.000Z";
const MODIFIED = getDatasetSyncedIso();

const COUPON_PARENT = {
  label: "LitBuy coupons",
  href: LITBUY_COUPONS_PATH,
} as const;

const SUPPORT_RELATED = [
  { href: LITBUY_COUPONS_PATH, label: "LitBuy coupons hub" },
  { href: "/telegram-litbuy", label: "LitBuy Telegram" },
  { href: "/litbuy-spreadsheet", label: "LitBuy spreadsheet" },
  { href: "/litbuy-shipping-coupon", label: "Shipping coupon guide" },
  { href: "/how-to-save-on-shipping", label: "Save on shipping" },
  { href: "/how-to-use-litbuy", label: "How to use LitBuy" },
] as const;

function codeRowsSummary(): string {
  return getLitbuyCouponRows()
    .map((row) => `${row.coupon}: ${row.discount} (${row.status})`)
    .join(" · ");
}

/**
 * Supporting SEO pages around the #1-ranked /litbuy-coupons hub.
 * Unique intent each — do not thin-duplicate the hub.
 */
export const LITBUY_COUPON_SUPPORT_PAGES: Record<string, AuthorityPage> = {
  "litbuy-coupon-codes": {
    slug: "litbuy-coupon-codes",
    path: "/litbuy-coupon-codes",
    title: "LitBuy Coupon Codes – How to Apply Working Codes",
    metaDescription:
      "LitBuy coupon codes explained: available welcome and shipping codes, how to apply them at registration and checkout, and where to verify live offers. Links to the main LitBuy coupons hub.",
    badge: "Coupon codes",
    h1: "LitBuy coupon codes",
    directAnswer:
      "LitBuy coupon codes are registration and checkout discounts for LitBuy agent shoppers — most value comes from a verified invite / referral signup rather than random pasted strings. Eligible new accounts can unlock a welcome coupon pack (up to $500) plus international shipping savings (up to 40% off) when they register through a verified link. Always confirm the live total on LitBuy before paying.",
    summary:
      "Use verified LitBuy coupon codes from the main coupons hub — not expired dumps. Apply at signup (invite code) and again when you pay international freight. Product prices and shipping discounts are separate line items.",
    parentCrumb: COUPON_PARENT,
    primaryCta: {
      href: LITBUY_COUPON_SIGNUP_URL,
      label: "Claim LitBuy coupon codes",
    },
    sections: [
      {
        heading: "Available LitBuy coupon codes right now",
        paragraphs: [
          `As of ${getLitbuyCouponsLastUpdated()}, LitBuy Finds tracks these working offers (confirm live on LitBuy checkout): ${codeRowsSummary()}.`,
          `The invite / referral code used with our verified registration link is ${LITBUY_INVITE_CODE}. That path is how most shoppers unlock the ${LITBUY_COUPONS_OFFER.headline} bundle — not by pasting unrelated codes from forums.`,
          "“LitBuy coupons codes” searches (plural wording) point to the same offers. Free LitBuy account access is included with registration; welcome coupons and shipping discounts still depend on new-user eligibility.",
        ],
        links: [
          { href: LITBUY_COUPONS_PATH, label: "Full LitBuy coupons table" },
          { href: "/litbuy-coupons-2026", label: "LitBuy coupons 2026" },
        ],
      },
      {
        heading: "How to apply LitBuy coupon codes",
        paragraphs: [
          "1) Open the verified registration link from LitBuy Finds. 2) Create your LitBuy account so the invite code attaches at signup. 3) Check your LitBuy wallet or promotions panel for the welcome coupon pack. 4) Add finds to your warehouse cart as usual. 5) When you submit an international parcel, confirm the shipping discount appears on the freight total before you pay.",
          "Shipping coupon codes reduce international freight — they do not rewrite Weidian or Taobao item prices. If checkout does not show the expected welcome pack or shipping percentage, stop and verify on LitBuy’s live promotions screen rather than retrying random third-party codes.",
        ],
        links: [
          { href: "/how-to-use-litbuy", label: "How to use LitBuy" },
          { href: "/how-to-save-on-shipping", label: "Save on shipping" },
        ],
      },
      {
        heading: "Relationship to the main LitBuy coupons page",
        paragraphs: [
          "This page is a focused guide for shoppers who specifically searched for LitBuy coupon codes or LitBuy coupons codes. The canonical ranking hub for all LitBuy coupon offers, verification notes, and the full comparison table remains /litbuy-coupons.",
          "Use this codes guide for apply-steps and eligibility; use the main hub when you want the complete offer overview and discovery links into the catalog.",
        ],
        links: [
          { href: LITBUY_COUPONS_PATH, label: "LitBuy coupons (canonical)" },
          { href: "/litbuy-spreadsheet", label: "LitBuy spreadsheet" },
          { href: "/telegram-litbuy", label: "LitBuy Telegram" },
        ],
      },
      {
        heading: "Avoid expired code dumps",
        paragraphs: [
          "Lists of dozens of LitBuy free coupons pasted without a registration path are usually outdated. LitBuy Finds only highlights offers we can re-check against registration and checkout behavior. If a code does not change your live total, treat it as inactive and return to the verified hub.",
        ],
        links: [
          { href: "/litbuy-coupon-code-reddit", label: "Reddit-style coupon questions" },
          { href: "/is-litbuy-safe", label: "Is LitBuy safe" },
        ],
      },
    ],
    faqs: [
      {
        question: "What LitBuy coupon codes are available?",
        answer: `Eligible new users can unlock up to ${LITBUY_COUPONS_OFFER.welcomePack} in welcome coupons plus up to ${LITBUY_COUPONS_OFFER.shippingDiscount} on international shipping via verified registration (invite code ${LITBUY_INVITE_CODE}). Confirm the live offer on LitBuy checkout.`,
      },
      {
        question: "How do I apply a LitBuy coupon code?",
        answer:
          "Register through a verified LitBuy Finds referral link so the invite attaches at signup, then confirm welcome coupons in your account and shipping savings when you pay international freight.",
      },
      {
        question: "Are LitBuy coupon codes the same as promo codes?",
        answer:
          "In practice yes — shoppers use “coupon codes,” “coupons codes,” and “promo codes” interchangeably. On LitBuy, most durable savings still come from the new-user registration bundle rather than one-off pasted strings.",
      },
      {
        question: "Where is the main LitBuy coupons page?",
        answer:
          "The canonical LitBuy coupons hub is /litbuy-coupons on LitBuy Finds. This coupon-codes page is a supporting guide that links back there.",
      },
    ],
    relatedLinks: [...SUPPORT_RELATED],
    publishedTime: PUBLISHED,
    modifiedTime: MODIFIED,
  },

  "litbuy-free-shipping-coupons": {
    slug: "litbuy-free-shipping-coupons",
    path: "/litbuy-free-shipping-coupons",
    title: "LitBuy Free Shipping Coupons – Shipping Discount Guide",
    metaDescription:
      "LitBuy free shipping coupons and shipping discounts explained: how freight coupons work, what “free shipping” searches usually mean, and how to cut haul shipping costs. Verify live terms on LitBuy.",
    badge: "Shipping coupons",
    h1: "LitBuy free shipping coupons",
    directAnswer:
      "Shoppers searching for LitBuy free shipping coupons usually want cheaper international freight — not a permanent zero-cost worldwide rate. LitBuy’s working shipping offer for eligible new accounts is up to 40% off international shipping when you register through a verified link, often paired with a welcome coupon pack. True “free shipping forever” codes are not something we list; confirm any freight discount on LitBuy checkout for your destination.",
    summary:
      "Shipping coupons lower international freight. Combine them with consolidated hauls and smarter line choices. Always verify the live shipping total — destination and line rules matter.",
    parentCrumb: COUPON_PARENT,
    primaryCta: {
      href: LITBUY_COUPON_SIGNUP_URL,
      label: "Claim LitBuy shipping coupon",
    },
    sections: [
      {
        heading: "LitBuy shipping discounts vs “free shipping”",
        paragraphs: [
          `The live LitBuy shipping coupon tracked on LitBuy Finds is up to ${LITBUY_COUPONS_OFFER.shippingDiscount} on ${LITBUY_COUPONS_OFFER.shippingDiscountLabel.toLowerCase()} for eligible new users — bundled with the ${LITBUY_COUPONS_OFFER.welcomePack} welcome pack when you use verified registration.`,
          "Search phrases like LitBuy free shipping coupons or LitBuy shipping coupons usually map to that freight discount, not unlimited free parcels. Permanent free international shipping is rare and often a scam signal when promised without checkout proof.",
        ],
        links: [
          { href: LITBUY_COUPONS_PATH, label: "LitBuy coupons hub" },
          { href: "/litbuy-shipping-coupon", label: "Shipping coupon overview" },
        ],
      },
      {
        heading: "How LitBuy shipping coupons work",
        paragraphs: [
          "Shipping coupons apply when you submit an international parcel from the LitBuy warehouse — after domestic delivery and optional QC. They reduce the freight line, not each Weidian or Taobao item price.",
          "Eligibility can depend on account age, destination country, and the shipping line you pick. If the discount does not appear on the parcel payment screen, the offer may not apply to that route or account type.",
        ],
        links: [
          { href: "/guides/how-shipping-works-with-agents", label: "How agent shipping works" },
          { href: "/how-to-use-litbuy", label: "How to use LitBuy" },
        ],
      },
      {
        heading: "How to reduce shipping costs further",
        paragraphs: [
          "Even with a shipping coupon, freight stays weight- and volume-driven. Consolidate items into one haul, remove unnecessary packaging when safe, prefer economy lines when timing allows, and avoid shipping a single heavy pair alone.",
          "Browse the LitBuy spreadsheet / catalog so you fill a parcel with finds you actually want — coupon savings matter more on a planned haul than on one-off emergency ships.",
        ],
        links: [
          { href: "/how-to-save-on-shipping", label: "Save on shipping tips" },
          { href: "/litbuy-spreadsheet", label: "LitBuy spreadsheet" },
          { href: "/telegram-litbuy", label: "LitBuy Telegram" },
        ],
      },
      {
        heading: "Verify before you pay freight",
        paragraphs: [
          "Screenshot or note the shipping total with and without the expected discount. The LitBuy checkout screen is the source of truth — supporting pages on LitBuy Finds explain offers but do not process payments.",
        ],
        links: [
          { href: LITBUY_COUPONS_PATH, label: "Verify on coupons hub" },
          { href: "/is-litbuy-safe", label: "Safety tips" },
        ],
      },
    ],
    faqs: [
      {
        question: "Is there a LitBuy free shipping coupon?",
        answer:
          "We do not advertise permanent free international shipping. Eligible new users can unlock up to 40% off international shipping through verified registration — confirm the live freight total on LitBuy for your destination.",
      },
      {
        question: "Do LitBuy shipping coupons work worldwide?",
        answer:
          "Terms vary by promotion, shipping line, and country. Always check the parcel checkout screen for your address before paying.",
      },
      {
        question: "How else can I lower LitBuy shipping?",
        answer:
          "Consolidate items, choose economical lines when timing allows, and avoid shipping single heavy parcels. Pair those habits with the verified shipping coupon when eligible.",
      },
      {
        question: "Where do I find all LitBuy coupon offers?",
        answer:
          "Start at /litbuy-coupons for the canonical offer table, then return here for shipping-focused guidance.",
      },
    ],
    relatedLinks: [...SUPPORT_RELATED],
    publishedTime: PUBLISHED,
    modifiedTime: MODIFIED,
  },

  "litbuy-coupons-2026": {
    slug: "litbuy-coupons-2026",
    path: "/litbuy-coupons-2026",
    title: "LitBuy Coupons 2026 – Latest Discounts & Updates",
    metaDescription:
      "LitBuy coupons 2026: latest welcome and shipping discounts, last-verified update date, and how this year’s offers connect to the main LitBuy coupons hub. Confirm live totals on LitBuy.",
    badge: "2026 coupons",
    h1: "LitBuy coupons 2026",
    directAnswer:
      `LitBuy coupons in 2026 still center on new-user registration value: up to ${LITBUY_COUPONS_OFFER.welcomePack} in welcome coupons plus up to ${LITBUY_COUPONS_OFFER.shippingDiscount} off international shipping when you sign up through a verified LitBuy Finds link. Offers can change through the year — use the update timestamp below and always re-check LitBuy checkout before you pay.`,
    summary:
      `Last verified on LitBuy Finds: ${getLitbuyCouponsLastUpdated()}. Current headline offer: ${LITBUY_COUPONS_OFFER.headline}. Canonical details stay on /litbuy-coupons.`,
    parentCrumb: COUPON_PARENT,
    primaryCta: {
      href: LITBUY_COUPON_SIGNUP_URL,
      label: "Claim 2026 LitBuy coupons",
    },
    sections: [
      {
        heading: "Updated 2026 coupon information",
        paragraphs: [
          `Update timestamp: ${getLitbuyCouponsLastUpdated()} (refreshed when LitBuy Finds re-checks registration and shipping offers against catalog sync).`,
          `For 2026, the working bundle we highlight is ${LITBUY_COUPONS_OFFER.subline} Live status for each row: ${codeRowsSummary()}.`,
          LITBUY_COUPONS_OFFER.disclaimer,
        ],
        links: [
          { href: LITBUY_COUPONS_PATH, label: "Main LitBuy coupons page" },
          { href: "/litbuy-coupon-codes", label: "Coupon codes guide" },
        ],
      },
      {
        heading: "Latest discounts shoppers look for in 2026",
        paragraphs: [
          "Year-based searches (“LitBuy coupons 2026”) usually want confirmation that an offer is still current — not a different product. In 2026 that means verifying the welcome pack amount, the shipping percentage, and whether your account type still qualifies.",
          "Seasonal LitBuy promos may appear inside the LitBuy app in addition to the registration bundle. Treat in-app flash codes as temporary; the registration path remains the durable starting point for new buyers.",
        ],
        links: [
          { href: "/litbuy-free-shipping-coupons", label: "Free shipping coupons" },
          { href: "/best-litbuy-coupons", label: "Best LitBuy coupons" },
        ],
      },
      {
        heading: "Link back to the main coupon page",
        paragraphs: [
          "This 2026 page is a year-intent landing that answers “are LitBuy coupons still good this year?” The full comparison table, FAQ set, and primary ranking page remain /litbuy-coupons — bookmark that hub for ongoing updates.",
          "After you claim coupons, browse the LitBuy spreadsheet catalog and Telegram community updates so your first haul uses the shipping discount efficiently.",
        ],
        links: [
          { href: LITBUY_COUPONS_PATH, label: "LitBuy coupons hub" },
          { href: "/litbuy-spreadsheet", label: "LitBuy spreadsheet" },
          { href: "/telegram-litbuy", label: "LitBuy Telegram" },
        ],
      },
    ],
    faqs: [
      {
        question: "Are LitBuy coupons still working in 2026?",
        answer: `Yes — as of ${getLitbuyCouponsLastUpdated()}, LitBuy Finds still tracks the ${LITBUY_COUPONS_OFFER.headline} registration offer for eligible new users. Confirm the live total on LitBuy checkout.`,
      },
      {
        question: "What is the latest LitBuy discount in 2026?",
        answer: `The latest verified bundle is up to ${LITBUY_COUPONS_OFFER.welcomePack} in welcome coupons plus up to ${LITBUY_COUPONS_OFFER.shippingDiscount} off international shipping via verified registration.`,
      },
      {
        question: "How often is this 2026 page updated?",
        answer:
          "The update timestamp refreshes when LitBuy Finds re-verifies coupon status during catalog sync and offer checks. If checkout no longer matches, trust LitBuy’s live screen and return to /litbuy-coupons.",
      },
      {
        question: "Should I use this page or /litbuy-coupons?",
        answer:
          "Use this page for year-based searches and the dated summary. Use /litbuy-coupons as the canonical hub for the full table and ongoing verification.",
      },
    ],
    relatedLinks: [...SUPPORT_RELATED],
    publishedTime: PUBLISHED,
    modifiedTime: MODIFIED,
  },

  "litbuy-coupon-code-reddit": {
    slug: "litbuy-coupon-code-reddit",
    path: "/litbuy-coupon-code-reddit",
    title: "LitBuy Coupon Code Reddit – What Shoppers Usually Ask",
    metaDescription:
      "What people look for when searching LitBuy coupon code Reddit or LitBuy coupons Reddit: common questions, how to verify codes, and official LitBuy coupon resources. Not affiliated with Reddit.",
    badge: "Community searches",
    h1: "LitBuy coupon code Reddit searches",
    directAnswer:
      "People searching “LitBuy coupon code Reddit” or “LitBuy coupons Reddit” usually want a working invite, confirmation that a code is not expired, and a trustworthy registration link — not a Reddit thread itself. LitBuy Finds is not Reddit and is not affiliated with Reddit. This page summarizes the questions those searches imply and points you to verified LitBuy coupon resources you can check yourself.",
    summary:
      "Reddit-style searches = trust + verification. Use official LitBuy checkout totals and the LitBuy Finds coupons hub. Ignore unpaid “DM me for codes” posts and permanent free-shipping promises.",
    parentCrumb: COUPON_PARENT,
    primaryCta: {
      href: LITBUY_COUPON_SIGNUP_URL,
      label: "Open verified LitBuy coupon link",
    },
    sections: [
      {
        heading: "What users usually look for in Reddit coupon searches",
        paragraphs: [
          "Typical intent behind LitBuy coupon code Reddit queries: (1) a working invite / referral path, (2) whether welcome coupons still pay out, (3) whether shipping discounts still apply in their country, and (4) whether a random pasted code is a scam.",
          "Community threads can help with haul tips, but coupon amounts change. Treat any code you saw in a screenshot as unverified until LitBuy checkout shows the same savings on your account.",
        ],
        links: [
          { href: LITBUY_COUPONS_PATH, label: "Verified LitBuy coupons hub" },
          { href: "/litbuy-coupon-codes", label: "How to apply codes" },
        ],
      },
      {
        heading: "Common questions from coupon threads",
        paragraphs: [
          "“Does invite code X still work?” — Only if registration still attaches benefits; verify after signup in your LitBuy wallet.",
          "“Can I stack every code?” — Usually not. Welcome packs and shipping discounts follow LitBuy’s rules for new accounts and parcel checkout.",
          "“Who has free LitBuy coupons?” — Free account signup is normal; large “free coupon” piles without a referral path are often expired lists.",
          "“Is this link safe?” — Prefer links that land on LitBuy registration and whose savings appear at checkout. LitBuy Finds documents the offer we re-check; we do not process your payment.",
        ],
        links: [
          { href: "/telegram-litbuy", label: "LitBuy Telegram updates" },
          { href: "/is-litbuy-legit", label: "Is LitBuy legit" },
        ],
      },
      {
        heading: "How to verify a LitBuy coupon yourself",
        paragraphs: [
          "1) Use a verified registration link from the LitBuy coupons hub. 2) Create the account and note whether welcome coupons appear. 3) Build a small test cart / parcel estimate and see whether shipping savings apply. 4) If numbers do not match a screenshot from a forum post, trust LitBuy’s live total.",
          `Current invite code referenced on LitBuy Finds: ${LITBUY_INVITE_CODE}. Current headline offer we track: ${LITBUY_COUPONS_OFFER.headline}.`,
        ],
        links: [
          { href: LITBUY_COUPONS_PATH, label: "Official coupons resource on LitBuy Finds" },
          { href: "/litbuy-coupons-2026", label: "2026 coupon update" },
        ],
      },
      {
        heading: "Official LitBuy coupon resources (not Reddit)",
        paragraphs: [
          "Bookmark /litbuy-coupons for the canonical table and FAQs. Use /litbuy-coupon-codes for apply steps, /litbuy-free-shipping-coupons for freight-focused questions, and /litbuy-spreadsheet plus /telegram-litbuy when you are ready to shop finds after claiming coupons.",
          "This page exists so Reddit-intent searches land on clear verification guidance — without pretending to be a Reddit community or quoting scraped threads.",
        ],
        links: [
          { href: LITBUY_COUPONS_PATH, label: "LitBuy coupons" },
          { href: "/litbuy-spreadsheet", label: "LitBuy spreadsheet" },
          { href: "/telegram-litbuy", label: "LitBuy Telegram" },
        ],
      },
    ],
    faqs: [
      {
        question: "Is this page affiliated with Reddit?",
        answer:
          "No. LitBuy Finds is an independent discovery site. This page answers what people typically want when they search LitBuy coupon terms with “Reddit” — it is not a Reddit community and does not repost Reddit threads.",
      },
      {
        question: "Where can I verify a LitBuy coupon from a forum post?",
        answer:
          "Register through the verified link on /litbuy-coupons, then confirm welcome coupons and shipping discounts on LitBuy’s own checkout screens before paying.",
      },
      {
        question: "Why do Reddit coupon codes fail?",
        answer:
          "Screenshots go stale, regional rules differ, and some posts share unrelated codes. If LitBuy checkout does not show the discount, the code is inactive for your account.",
      },
      {
        question: "What is a safer alternative to random code dumps?",
        answer: `Use the verified registration path LitBuy Finds tracks (invite ${LITBUY_INVITE_CODE}) and re-check the live ${LITBUY_COUPONS_OFFER.headline} offer at checkout.`,
      },
    ],
    relatedLinks: [...SUPPORT_RELATED],
    publishedTime: PUBLISHED,
    modifiedTime: MODIFIED,
  },
};

export const LITBUY_COUPON_SUPPORT_SLUGS = Object.keys(
  LITBUY_COUPON_SUPPORT_PAGES
);
