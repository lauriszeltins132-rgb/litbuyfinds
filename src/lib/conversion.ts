/** Session thresholds for contextual signup nudges */
export const WISHLIST_UNLOCK_THRESHOLD = 3;
export const PRODUCT_VIEW_NUDGE_THRESHOLD = 20;
export const COUPON_AUTOOPEN_VIEW_THRESHOLD = 8;

export const CONVERSION_DISMISS_KEYS = {
  unlockVerified: "litbuy-dismiss-unlock-verified",
  browseNudge: "litbuy-dismiss-browse-nudge",
  stickyBenefit: "litbuy-dismiss-sticky-benefit",
  exitIntent: "litbuy-dismiss-exit-intent",
  qcPrompt: "litbuy-dismiss-qc-prompt",
} as const;

export const SAVE_FINDS_PROMPT_THRESHOLD = 2;

export const GUEST_VS_MEMBER_ROWS = [
  {
    feature: "Browse curated finds",
    guest: true,
    member: true,
  },
  {
    feature: "Verified buy links",
    guest: "Limited",
    member: true,
  },
  {
    feature: "QC photo access",
    guest: false,
    member: true,
  },
  {
    feature: "Save & sync wishlist",
    guest: "This device only",
    member: true,
  },
  {
    feature: "Order tracking",
    guest: false,
    member: true,
  },
  {
    feature: "Shipping coupons",
    guest: false,
    member: true,
  },
] as const;

export const LITBUY_MEMBER_BENEFITS = [
  {
    title: "Verified links you can trust",
    body: "Every buy button opens a tested LitBuy product page — no broken spreadsheets or mystery sellers.",
  },
  {
    title: "QC before you ship",
    body: "Members get full access to warehouse QC photos so you can approve items before they leave China.",
  },
  {
    title: "One account for your haul",
    body: "Track orders, manage shipping, and keep saved finds synced when you register on LitBuy.",
  },
] as const;
