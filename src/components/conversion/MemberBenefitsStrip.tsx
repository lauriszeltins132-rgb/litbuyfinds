import RegisterLink from "@/components/RegisterLink";
import GuestVsMemberTable from "@/components/conversion/GuestVsMemberTable";
import { REGISTER_MODAL_CTA_LABEL } from "@/lib/constants";

const BENEFITS = [
  { title: "Unlock QC Photos", body: "Review warehouse photos before you ship." },
  { title: "Unlock Verified Links", body: "Buy through tested LitBuy product pages." },
  { title: "Track Orders", body: "Follow your haul from buy to delivery." },
  { title: "Save Hauls", body: "Keep finds and orders in one account." },
] as const;

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
    <section className="member-benefits-strip rounded-2xl border border-border/80 bg-surface/30 p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">
            LitBuy member benefits
          </p>
          <h3 className="mt-1 text-lg font-black text-foreground sm:text-xl">
            Unlock QC photos, verified links &amp; order tracking
          </h3>
        </div>
        <RegisterLink
          location={location}
          className="inline-flex shrink-0 items-center justify-center rounded-full bg-accent px-5 py-2.5 text-sm font-black text-background hover:bg-accent-hover"
        >
          {REGISTER_MODAL_CTA_LABEL}
        </RegisterLink>
      </div>

      <div
        className={`mt-5 grid gap-3 ${
          compact ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-4"
        }`}
      >
        {BENEFITS.map((benefit) => (
          <div
            key={benefit.title}
            className="rounded-xl border border-border/60 bg-background/40 px-3 py-3"
          >
            <p className="text-sm font-bold text-foreground">{benefit.title}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted">{benefit.body}</p>
          </div>
        ))}
      </div>

      {showTable ? (
        <div className="mt-5">
          <GuestVsMemberTable compact />
        </div>
      ) : null}
    </section>
  );
}
