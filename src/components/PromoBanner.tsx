import Image from "next/image";
import {
  PROMO_BANNER_ALT,
  PROMO_BANNER_MODAL,
  PROMO_BANNER_PROMO,
} from "@/lib/constants";

type PromoBannerVariant = "hero" | "card" | "modal";

type PromoBannerProps = {
  variant?: PromoBannerVariant;
  className?: string;
  priority?: boolean;
};

const VARIANTS: Record<
  PromoBannerVariant,
  { src: string; width: number; height: number; sizes: string }
> = {
  hero: {
    src: PROMO_BANNER_PROMO,
    width: 1600,
    height: 1066,
    sizes: "(max-width: 1024px) 100vw, 50vw",
  },
  card: {
    src: PROMO_BANNER_PROMO,
    width: 1600,
    height: 1066,
    sizes: "(max-width: 1024px) 100vw, 420px",
  },
  modal: {
    src: PROMO_BANNER_MODAL,
    width: 800,
    height: 533,
    sizes: "(max-width: 640px) 100vw, 400px",
  },
};

export default function PromoBanner({
  variant = "card",
  className = "",
  priority = false,
}: PromoBannerProps) {
  const config = VARIANTS[variant];

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-border/60 bg-panel ${className}`}
    >
      <Image
        src={config.src}
        alt={PROMO_BANNER_ALT}
        width={config.width}
        height={config.height}
        sizes={config.sizes}
        priority={priority}
        className="h-auto w-full object-contain"
      />
    </div>
  );
}
