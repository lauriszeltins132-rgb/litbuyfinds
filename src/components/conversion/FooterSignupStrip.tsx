import Link from "next/link";
import RegisterLink from "@/components/RegisterLink";
import GuestVsMemberTable from "./GuestVsMemberTable";
import { BROWSE_FINDS_CTA_LABEL, REGISTER_MODAL_CTA_LABEL } from "@/lib/constants";

export default function FooterSignupStrip() {
  return (
    <section className="border-t border-border/60 bg-[#0c0c0e] px-4 py-10 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(280px,420px)] lg:items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
              Why create a LitBuy account
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              Buy with verified links, QC access, and order tracking
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
              LitBuy Finds helps you discover products. A free LitBuy account is
              where you actually buy, review QC photos, and ship your haul with
              confidence.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <RegisterLink
                location="footer_signup_strip"
                className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-black text-background transition hover:bg-accent-hover"
              >
                {REGISTER_MODAL_CTA_LABEL}
              </RegisterLink>
              <Link
                href="/#browse"
                className="inline-flex items-center justify-center rounded-full border border-border-strong px-6 py-3 text-sm font-bold text-foreground transition hover:border-accent/40 hover:text-accent"
              >
                {BROWSE_FINDS_CTA_LABEL}
              </Link>
            </div>
          </div>
          <GuestVsMemberTable compact />
        </div>
      </div>
    </section>
  );
}
