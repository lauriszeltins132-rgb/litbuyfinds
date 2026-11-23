import RegisterLink from "@/components/RegisterLink";
import GuestVsMemberTable from "@/components/conversion/GuestVsMemberTable";
import { LITBUY_INVITE_CODE } from "@/lib/constants";
import { LITBUY_CLAIM_COUPON_LABEL } from "@/lib/litbuy-coupons-page";

const BENEFITS = [
  {
    title: "QC Photos",
    body: "Review warehouse photos before shipping.",
    icon: "photo",
  },
  {
    title: "Verified Buy Links",
    body: "Open tested LitBuy product links.",
    icon: "link",
  },
  {
    title: "Order Tracking",
    body: "Follow your haul from warehouse to delivery.",
    icon: "track",
  },
  {
    title: "Save Finds",
    body: "Keep products together for later.",
    icon: "save",
  },
] as const;

function BenefitIcon({ name }: { name: (typeof BENEFITS)[number]["icon"] }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    className: "h-4 w-4",
  };
  if (name === "photo") {
    return (
      <svg {...common}>
        <path d="M4 8.5h2.2l1.2-2h9.2l1.2 2H20a1 1 0 0 1 1 1V18a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5a1 1 0 0 1 1-1Z" />
        <circle cx="12" cy="13.5" r="3" />
      </svg>
    );
  }
  if (name === "link") {
    return (
      <svg {...common}>
        <path d="M10 13a5 5 0 0 0 7.1.1l1.4-1.4a5 5 0 0 0-7.1-7.1L10 6" />
        <path d="M14 11a5 5 0 0 0-7.1-.1L5.5 12.3a5 5 0 0 0 7.1 7.1L14 18" />
      </svg>
    );
  }
  if (name === "track") {
    return (
      <svg {...common}>
        <path d="M3 7h11v8H3z" />
        <path d="M14 10h4l3 3v2h-7" />
        <circle cx="7" cy="17.5" r="1.5" />
        <circle cx="17" cy="17.5" r="1.5" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M7 4h10a1 1 0 0 1 1 1v15l-6-3-6 3V5a1 1 0 0 1 1-1Z" />
    </svg>
  );
}

type MemberBenefitsStripProps = {
  location: string;
  showTable?: boolean;
  compact?: boolean;
};

export default function MemberBenefitsStrip({
  location,
  showTable = true,
  compact = false,
}: MemberBenefitsStripProps) {
  return (
    <section className="member-benefits-strip rounded-3xl border border-border p-4 sm:p-6">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
        LitBuy member benefits
      </p>
      <h3 className="mt-2 text-xl font-black leading-tight text-foreground sm:text-2xl">
        Unlock more with a free LitBuy account
      </h3>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
        Use invite code {LITBUY_INVITE_CODE} to access the current new-user offer
        and member tools.
      </p>
      <RegisterLink
        location={location}
        className="mt-4 inline-flex min-h-11 items-center justify-center rounded-full bg-accent px-5 text-sm font-black text-background hover:bg-accent-hover"
      >
        {LITBUY_CLAIM_COUPON_LABEL}
      </RegisterLink>

      <div
        className={`mt-5 grid gap-3 ${
          compact ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-4"
        }`}
      >
        {BENEFITS.map((benefit) => (
          <div
            key={benefit.title}
            className="rounded-2xl border border-border bg-background px-3 py-3"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent/15 text-accent">
              <BenefitIcon name={benefit.icon} />
            </span>
            <p className="mt-2 text-sm font-bold text-foreground">{benefit.title}</p>
            <p className="mt-1 text-xs leading-relaxed text-foreground/75">
              {benefit.body}
            </p>
          </div>
        ))}
      </div>

      {showTable ? (
        <div className="mt-5">
          <GuestVsMemberTable compact />
        </div>
      ) : null}

      <div className="mt-5 rounded-2xl border border-accent/25 bg-accent/8 px-4 py-4">
        <RegisterLink
          location={location}
          className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-accent px-5 text-sm font-black text-background hover:bg-accent-hover sm:w-auto"
        >
          {LITBUY_CLAIM_COUPON_LABEL}
        </RegisterLink>
        <p className="mt-2 text-xs leading-relaxed text-muted">
          Create a free LitBuy account with invite code {LITBUY_INVITE_CODE}.
        </p>
      </div>
    </section>
  );
}
