"use client";

import BrowsingBenefitCard from "./BrowsingBenefitCard";
import ExitIntentSignup from "./ExitIntentSignup";
import ProductBrowseSignupNudge from "./ProductBrowseSignupNudge";
import UnlockVerifiedLinksPrompt from "./UnlockVerifiedLinksPrompt";

/** Global conversion nudges — contextual, dismissible, non-blocking. */
export default function ConversionLayer() {
  return (
    <>
      <UnlockVerifiedLinksPrompt />
      <ProductBrowseSignupNudge />
      <BrowsingBenefitCard />
      <ExitIntentSignup />
    </>
  );
}
