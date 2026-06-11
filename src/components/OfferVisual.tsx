type OfferVisualProps = {
  className?: string;
  compact?: boolean;
};

export default function OfferVisual({
  className = "",
  compact = false,
}: OfferVisualProps) {
  return (
    <div
      className={`offer-visual ${compact ? "offer-visual--compact" : ""} ${className}`}
      aria-hidden
    >
      <div className="offer-visual__glow" />
      <div className="offer-visual__grid" />

      <div className="offer-visual__badge">40% Shipping</div>

      <svg
        className="offer-visual__box"
        viewBox="0 0 120 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 34L60 14L108 34V72L60 92L12 72V34Z"
          stroke="currentColor"
          strokeWidth="2"
          className="offer-visual__box-outline"
        />
        <path
          d="M12 34L60 54L108 34"
          stroke="currentColor"
          strokeWidth="2"
          className="offer-visual__box-outline"
        />
        <path
          d="M60 54V92"
          stroke="currentColor"
          strokeWidth="2"
          className="offer-visual__box-outline"
        />
        <circle cx="60" cy="48" r="6" className="offer-visual__box-accent" />
      </svg>

      <div className="offer-visual__silhouette offer-visual__silhouette--left" />
      <div className="offer-visual__silhouette offer-visual__silhouette--right" />
    </div>
  );
}
