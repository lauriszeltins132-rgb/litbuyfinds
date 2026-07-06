import Button from "@/components/ui/Button";
import { formatCurrency } from "@/lib/game/win-tier";
import type { WinTier } from "@/lib/game/types";

interface WinOverlayProps {
  winAmount: number;
  tier: WinTier;
  onDismiss: () => void;
}

const TIER_LABELS: Record<WinTier, string> = {
  nice: "Nice Win!",
  big: "Big Win!",
  epic: "Epic Win!",
};

const TIER_COLORS: Record<WinTier, string> = {
  nice: "#d4a843",
  big: "#22c55e",
  epic: "#f5c842",
};

export default function WinOverlay({ winAmount, tier, onDismiss }: WinOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="win-fly-up mx-4 flex max-w-sm flex-col items-center gap-4 rounded-2xl border border-[rgba(212,168,67,0.4)] bg-[rgba(17,24,39,0.95)] p-8 text-center">
        <div className="text-5xl">🏆</div>
        <h2
          className="text-3xl font-bold"
          style={{
            fontFamily: "var(--font-cinzel)",
            color: TIER_COLORS[tier],
          }}
        >
          {TIER_LABELS[tier]}
        </h2>
        <p className="text-2xl font-bold text-[var(--color-foreground)]">
          {formatCurrency(winAmount)}
        </p>
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className="coin-float absolute text-[var(--color-gold)]"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 2) * 20}%`,
              animationDelay: `${i * 0.1}s`,
            }}
          >
            ✦
          </span>
        ))}
        <Button variant="primary" className="mt-2 w-full" onClick={onDismiss}>
          Continue
        </Button>
      </div>
    </div>
  );
}
