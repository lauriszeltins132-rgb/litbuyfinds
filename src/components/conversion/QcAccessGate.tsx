"use client";

import { useState } from "react";
import RegisterLink from "@/components/RegisterLink";
import { REGISTER_QC_CTA_LABEL } from "@/lib/constants";

type QcAccessGateProps = {
  qcLink: string;
  productName: string;
  onTrackQc: () => void;
};

export default function QcAccessGate({
  qcLink,
  productName,
  onTrackQc,
}: QcAccessGateProps) {
  const [open, setOpen] = useState(false);

  function continueToQc() {
    onTrackQc();
    window.open(qcLink, "_blank", "noopener,noreferrer");
    setOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center rounded-full border border-accent/30 bg-accent/10 px-6 py-3.5 text-sm font-bold text-accent"
      >
        View QC
      </button>

      {open ? (
        <div className="fixed inset-0 z-[160] flex items-end justify-center p-3 sm:items-center sm:p-4">
          <button
            type="button"
            aria-label="Close"
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="panel-shell relative w-full max-w-sm rounded-3xl border border-border bg-surface p-5 sm:p-6">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">
              QC access
            </p>
            <h3 className="mt-2 text-lg font-black">Register to unlock full QC references</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              LitBuy members get warehouse QC photos, order tracking, and verified
              buy links for {productName}.
            </p>
            <div className="mt-4 space-y-2">
              <RegisterLink
                location="qc_access_gate"
                className="inline-flex w-full items-center justify-center rounded-full bg-accent py-3 text-sm font-black text-background hover:bg-accent-hover"
                onClick={() => setOpen(false)}
              >
                {REGISTER_QC_CTA_LABEL}
              </RegisterLink>
              <button
                type="button"
                onClick={continueToQc}
                className="inline-flex w-full items-center justify-center rounded-full border border-border px-4 py-3 text-sm font-bold text-foreground hover:border-accent/40"
              >
                Continue to QC preview
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
