import type { ProductBadge } from "@/lib/product-badges";
import { badgeClassName } from "@/lib/product-badges";

type ProductBadgesProps = {
  badges: ProductBadge[];
  className?: string;
};

export default function ProductBadges({
  badges,
  className = "",
}: ProductBadgesProps) {
  if (badges.length === 0) return null;

  return (
    <div className={`product-card-badges ${className}`.trim()}>
      {badges.map((badge) => (
        <span key={badge.kind} className={badgeClassName(badge.kind)}>
          {badge.label}
        </span>
      ))}
    </div>
  );
}
