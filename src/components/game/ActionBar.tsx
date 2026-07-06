import Button from "@/components/ui/Button";
import { formatCurrency } from "@/lib/game/win-tier";

interface ActionBarProps {
  canOpen: boolean;
  canCashOut: boolean;
  potentialWin: number;
  isLoading: boolean;
  onOpenChest: () => void;
  onCashOut: () => void;
}

export default function ActionBar({
  canOpen,
  canCashOut,
  potentialWin,
  isLoading,
  onOpenChest,
  onCashOut,
}: ActionBarProps) {
  return (
    <div className="flex w-full max-w-lg flex-col gap-3 px-4 pb-6">
      <Button
        variant="primary"
        className="w-full"
        disabled={!canOpen || isLoading}
        onClick={onOpenChest}
      >
        {isLoading ? "Opening..." : "Open Chest"}
      </Button>
      {canCashOut && (
        <Button
          variant="cashout"
          className="w-full"
          disabled={isLoading}
          onClick={onCashOut}
        >
          Cash Out {formatCurrency(potentialWin)}
        </Button>
      )}
    </div>
  );
}
