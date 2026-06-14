import { LITBUY_MEMBER_BENEFITS } from "@/lib/conversion";
import GuestVsMemberTable from "./GuestVsMemberTable";
import RegisterLink from "@/components/RegisterLink";
import { REGISTER_MODAL_CTA_LABEL } from "@/lib/constants";

type LitBuyMemberBenefitsProps = {
  location: string;
  showTable?: boolean;
  compact?: boolean;
};

export default function LitBuyMemberBenefits({
  location,
  showTable = true,
  compact = false,
}: LitBuyMemberBenefitsProps) {
  return (
    <div className={compact ? "space-y-4" : "space-y-6"}>
      <div className={compact ? "space-y-3" : "grid gap-4 sm:grid-cols-3"}>
        {LITBUY_MEMBER_BENEFITS.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-border/60 bg-surface/35 p-4"
          >
            <p className="text-sm font-bold text-foreground">{item.title}</p>
            <p className="mt-1.5 text-xs leading-relaxed text-muted sm:text-sm">
              {item.body}
            </p>
          </div>
        ))}
      </div>

      {showTable ? <GuestVsMemberTable compact={compact} /> : null}

      <div className={compact ? "" : "flex flex-wrap items-center gap-3"}>
        <RegisterLink
          location={location}
          className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-black text-background transition hover:bg-accent-hover"
        >
          {REGISTER_MODAL_CTA_LABEL}
        </RegisterLink>
        <p className="text-xs text-muted">Free to join · Takes under a minute</p>
      </div>
    </div>
  );
}
