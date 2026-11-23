"use client";

import dynamic from "next/dynamic";
import CouponModal from "@/components/CouponModal";

const ConversionLayer = dynamic(
  () => import("@/components/conversion/ConversionLayer"),
  { ssr: false }
);
const CouponAutoOpen = dynamic(() => import("@/components/CouponAutoOpen"), {
  ssr: false,
});
const OfferPopupTriggers = dynamic(
  () => import("@/components/conversion/OfferPopupTriggers"),
  { ssr: false }
);
const AiLauncher = dynamic(() => import("@/components/ai/AiLauncher"), {
  ssr: false,
});

export default function DeferredClientChrome() {
  return (
    <>
      <CouponModal />
      <CouponAutoOpen />
      <OfferPopupTriggers />
      <ConversionLayer />
      <AiLauncher />
    </>
  );
}
