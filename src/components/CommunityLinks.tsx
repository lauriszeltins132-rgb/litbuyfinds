"use client";

import CommunityButton from "./community/CommunityButton";

type CommunityLinksProps = {
  variant?: "header" | "inline" | "cta";
  location?: string;
  fullWidth?: boolean;
  showTelegramHandle?: boolean;
};

export default function CommunityLinks({
  variant = "inline",
  location = variant,
  fullWidth = false,
  showTelegramHandle = false,
}: CommunityLinksProps) {
  const buttonVariant =
    variant === "header" ? "icon" : variant === "cta" ? "cta" : "pill";

  const layoutClass =
    variant === "cta"
      ? "flex flex-col gap-3 sm:flex-row sm:items-center"
      : variant === "header"
        ? "hidden shrink-0 items-center gap-1 sm:flex"
      : fullWidth
        ? "flex w-full flex-col gap-2.5 sm:flex-row sm:justify-center"
        : "flex flex-wrap items-center gap-2";

  return (
    <div className={layoutClass}>
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
