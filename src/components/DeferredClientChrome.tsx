"use client";

import dynamic from "next/dynamic";

const ConversionLayer = dynamic(
  () => import("@/components/conversion/ConversionLayer"),
  { ssr: false }
);
const CouponModal = dynamic(() => import("@/components/CouponModal"), {
  ssr: false,
});
const CouponAutoOpen = dynamic(() => import("@/components/CouponAutoOpen"), {
  ssr: false,
});

export default function DeferredClientChrome() {
  return (
    <>
      <CouponModal />
      <CouponAutoOpen />
      <ConversionLayer />
    </>
  );
}
