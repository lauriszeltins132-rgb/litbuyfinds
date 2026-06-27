"use client";

import CommunityButton from "./community/CommunityButton";

type CommunityLinksProps = {
  variant?: "header" | "inline" | "cta";
  location?: string;
  fullWidth?: boolean;
  showTelegramHandle?: boolean;
  className?: string;
};

export default function CommunityLinks({
  variant = "inline",
  location = variant,
  fullWidth = false,
  showTelegramHandle = false,
  className = "",
}: CommunityLinksProps) {
  const buttonVariant =
    variant === "header" ? "icon" : variant === "cta" ? "cta" : "pill";

  const layoutClass =
    variant === "cta"
      ? "flex flex-col gap-3 sm:flex-row sm:items-center"
      : variant === "header"
        ? "flex shrink-0 items-center gap-0.5 sm:gap-1"
      : fullWidth
        ? "flex w-full flex-col gap-2.5 sm:flex-row sm:justify-center"
        : "flex flex-wrap items-center gap-2";

  return (
    <div className={`${layoutClass} ${className}`}>
      <CommunityButton
        platform="discord"
        variant={buttonVariant}
        location={location}
        fullWidth={fullWidth}
      />
      <CommunityButton
        platform="telegram"
        variant={buttonVariant}
        location={location}
        fullWidth={fullWidth}
        showTelegramHandle={showTelegramHandle}
      />
    </div>
  );
}
