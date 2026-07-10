import { badgeClassName } from "@/lib/product-badge-ui";
import type { ProductBadgeKind } from "@/lib/types";

type DisplayBadge = {
  kind: ProductBadgeKind;
  label: string;
};

type ProductBadgesProps = {
  badges: DisplayBadge[];
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
