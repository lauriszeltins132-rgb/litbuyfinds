import { BET_STEPS, MAX_BET, MIN_BET } from "@/lib/game/constants";
import { formatCurrency } from "@/lib/game/win-tier";
import Button from "@/components/ui/Button";

interface BetControlsProps {
  bet: number;
  balance: number;
  disabled: boolean;
  onBetChange: (bet: number) => void;
  onStartRound: () => void;
}

export default function BetControls({
  bet,
  balance,
  disabled,
  onBetChange,
  onStartRound,
}: BetControlsProps) {
  function stepBet(direction: "up" | "down") {
    const currentIdx = BET_STEPS.findIndex((s) => s >= bet);
    const idx = currentIdx === -1 ? BET_STEPS.length - 1 : currentIdx;
    if (direction === "up") {
      const next = BET_STEPS[Math.min(idx + 1, BET_STEPS.length - 1)];
      onBetChange(Math.min(next, balance, MAX_BET));
    } else {
      const prev = BET_STEPS[Math.max(idx - 1, 0)];
      onBetChange(Math.max(prev, MIN_BET));
    }
  }

  return (
    <div className="flex w-full max-w-lg flex-col items-center gap-3 px-4">
      <div className="flex w-full items-center justify-between rounded-xl border border-[rgba(212,168,67,0.15)] bg-[rgba(17,24,39,0.6)] px-4 py-3">
        <span className="text-sm text-[var(--color-muted)]">Bet Amount</span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => stepBet("down")}
            disabled={disabled || bet <= MIN_BET}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[rgba(212,168,67,0.3)] text-lg font-bold text-[var(--color-gold)] transition hover:bg-[rgba(212,168,67,0.1)] disabled:opacity-30"
            aria-label="Decrease bet"
          >
            −
          </button>
          <span className="min-w-[80px] text-center text-lg font-bold text-[var(--color-gold-bright)]">
            {formatCurrency(bet)}
          </span>
          <button
            type="button"
            onClick={() => stepBet("up")}
            disabled={disabled || bet >= Math.min(balance, MAX_BET)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[rgba(212,168,67,0.3)] text-lg font-bold text-[var(--color-gold)] transition hover:bg-[rgba(212,168,67,0.1)] disabled:opacity-30"
            aria-label="Increase bet"
          >
            +
          </button>
        </div>
      </div>

      <Button
        variant="primary"
        className="w-full"
        disabled={disabled || bet > balance}
        onClick={onStartRound}
      >
        Place Bet & Start
      </Button>
    </div>
  );
}
