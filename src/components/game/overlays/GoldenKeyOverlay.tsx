import Button from "@/components/ui/Button";
import { formatCurrency, formatMultiplier } from "@/lib/game/win-tier";

interface GoldenKeyOverlayProps {
  multiplier: number;
  potentialWin: number;
  isLoading: boolean;
  onUseKey: () => void;
  onTakeWin: () => void;
}

export default function GoldenKeyOverlay({
  multiplier,
  potentialWin,
  isLoading,
  onUseKey,
  onTakeWin,
}: GoldenKeyOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="key-rise mx-4 flex max-w-sm flex-col items-center gap-4 rounded-2xl border border-[rgba(212,168,67,0.5)] bg-[rgba(17,24,39,0.95)] p-8 text-center">
        <div className="text-5xl">🗝️</div>
        <h2
          className="text-2xl font-bold text-[var(--color-gold-bright)]"
          style={{ fontFamily: "var(--font-cinzel)" }}
        >
          Golden Key Found!
        </h2>
        <p className="text-sm text-[var(--color-muted)]">
          Unlock the bonus vault for bigger rewards — or take your{" "}
          {formatMultiplier(multiplier)} win ({formatCurrency(potentialWin)}) now.
        </p>
        <Button
          variant="primary"
          className="w-full"
          disabled={isLoading}
          onClick={onUseKey}
        >
          Use Golden Key
        </Button>
        <Button
          variant="secondary"
          className="w-full"
          disabled={isLoading}
          onClick={onTakeWin}
        >
          Take Win ({formatCurrency(potentialWin)})
        </Button>
      </div>
    </div>
  );
}
