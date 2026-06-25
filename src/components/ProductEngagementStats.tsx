type ProductEngagementStatsProps = {
  views?: number;
  saves?: number;
  trending?: boolean;
};

export default function ProductEngagementStats({
  views = 0,
  saves = 0,
  trending = false,
}: ProductEngagementStatsProps) {
  const items: { icon: string; label: string }[] = [];

  if (views > 0) {
    items.push({ icon: "👁", label: `${views.toLocaleString()} viewed` });
  }
  if (saves > 0) {
    items.push({ icon: "❤️", label: `${saves.toLocaleString()} saved` });
  }
  if (trending) {
    items.push({ icon: "🔥", label: "Trending" });
  }

  if (items.length === 0) return null;

  return (
    <div className="product-engagement">
      {items.map((item) => (
        <span key={item.label} className="product-engagement__item">
          <span aria-hidden>{item.icon}</span>
          {item.label}
        </span>
      ))}
    </div>
  );
}
