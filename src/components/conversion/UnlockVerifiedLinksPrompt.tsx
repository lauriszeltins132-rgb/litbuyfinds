"use client";

import RegisterLink from "@/components/RegisterLink";
import { useWishlist } from "@/context/WishlistContext";
import { useConversion } from "@/context/ConversionContext";
import {
  CONVERSION_DISMISS_KEYS,
  WISHLIST_UNLOCK_THRESHOLD,
} from "@/lib/conversion";
import { REGISTER_MODAL_CTA_LABEL } from "@/lib/constants";

export default function UnlockVerifiedLinksPrompt() {
  const { wishlist } = useWishlist();
  const { isNudgeDismissed, dismissNudge } = useConversion();

  if (wishlist.length < WISHLIST_UNLOCK_THRESHOLD) return null;
  if (isNudgeDismissed(CONVERSION_DISMISS_KEYS.unlockVerified)) return null;

  return (
    <div className="conversion-unlock-prompt" role="status">
      <div className="conversion-unlock-prompt__inner">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-foreground">
            You&apos;ve saved {wishlist.length} finds
          </p>
          <p className="mt-0.5 text-[11px] leading-relaxed text-muted sm:text-xs">
            Unlock verified buy links, QC photos, and order tracking when you
            create your LitBuy account.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <RegisterLink
            location="unlock_verified_links"
            className="inline-flex rounded-full bg-accent px-3 py-2 text-[11px] font-black text-background hover:bg-accent-hover sm:px-4 sm:text-xs"
          >
            {REGISTER_MODAL_CTA_LABEL}
          </RegisterLink>
          <button
            type="button"
            aria-label="Dismiss"
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted hover:text-foreground"
            onClick={() => dismissNudge(CONVERSION_DISMISS_KEYS.unlockVerified)}
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
