"use client";

import { SOCIAL_LINKS, TELEGRAM_HANDLE } from "@/lib/constants";
import { trackDiscordClick, trackTelegramClick } from "@/lib/analytics-events";
import { DiscordIcon, TelegramIcon } from "./SocialIcons";

export type CommunityPlatform = "discord" | "telegram";
export type CommunityButtonVariant = "icon" | "pill" | "cta";

type CommunityButtonProps = {
  platform: CommunityPlatform;
  variant?: CommunityButtonVariant;
  location?: string;
  className?: string;
  label?: string;
  showTelegramHandle?: boolean;
  fullWidth?: boolean;
};

const PLATFORM_CONFIG = {
  discord: {
    href: SOCIAL_LINKS.discord,
    defaultLabel: "Join Discord",
    track: trackDiscordClick,
    ariaLabel: "Join Discord",
    btnClass: "community-btn--discord",
  },
  telegram: {
    href: SOCIAL_LINKS.telegram,
    defaultLabel: "Join Telegram",
    track: trackTelegramClick,
    ariaLabel: "Join Telegram",
    btnClass: "community-btn--telegram",
  },
} as const;

export default function CommunityButton({
  platform,
  variant = "pill",
  location = "community",
  className = "",
  label,
  showTelegramHandle = false,
  fullWidth = false,
}: CommunityButtonProps) {
  const config = PLATFORM_CONFIG[platform];
  const Icon = platform === "discord" ? DiscordIcon : TelegramIcon;

  const text =
    label ??
    (platform === "telegram" && showTelegramHandle
      ? `Join Telegram ${TELEGRAM_HANDLE}`
      : config.defaultLabel);

  const variantClass =
    variant === "icon"
      ? "community-btn--icon"
      : variant === "cta"
        ? "community-btn--cta"
        : "community-btn--pill";

  const iconSize =
    variant === "icon" ? "h-[1.05rem] w-[1.05rem]" : "h-4 w-4";

  return (
    <a
      href={config.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={variant === "icon" ? config.ariaLabel : undefined}
      onClick={() => config.track(location)}
      className={`community-btn ${config.btnClass} ${variantClass} ${
        fullWidth ? "community-btn--full" : ""
      } ${className}`}
    >
      <Icon className={iconSize} />
      {variant !== "icon" ? <span>{text}</span> : null}
    </a>
  );
}
