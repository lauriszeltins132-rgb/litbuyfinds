"use client";

import dynamic from "next/dynamic";
import CouponModal from "@/components/CouponModal";
import OfferPopupTriggers from "@/components/conversion/OfferPopupTriggers";

const ConversionLayer = dynamic(
  () => import("@/components/conversion/ConversionLayer"),
  { ssr: false }
);
const CouponAutoOpen = dynamic(() => import("@/components/CouponAutoOpen"), {
  ssr: false,
});
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
