import Chest from "./Chest";
import type { PickOutcome } from "@/lib/game/types";

interface ChestGridProps {
  openedChests: number[];
  selectedChest: number | null;
  revealingChest: number | null;
  lastOutcome: PickOutcome | null;
  disabled: boolean;
  onSelectChest: (index: number) => void;
}

export default function ChestGrid({
  openedChests,
  selectedChest,
  revealingChest,
  lastOutcome,
  disabled,
  onSelectChest,
}: ChestGridProps) {
  const topRow = [0, 1, 2];
  const bottomRow = [3, 4];

  function getChestState(index: number) {
    if (revealingChest === index) return "shaking" as const;
    if (openedChests.includes(index)) return "revealed" as const;
    if (selectedChest === index) return "selected" as const;
    return "idle" as const;
  }

  function getOutcome(index: number): PickOutcome | null {
    if (!openedChests.includes(index)) return null;
    if (openedChests[openedChests.length - 1] === index) return lastOutcome;
    return "treasure";
  }

  function renderChest(index: number) {
    return (
      <Chest
        key={index}
        index={index}
        state={getChestState(index)}
        outcome={getOutcome(index)}
        disabled={disabled || openedChests.includes(index)}
        onClick={() => onSelectChest(index)}
      />
    );
  }

  return (
    <div className="flex w-full max-w-lg flex-col items-center gap-4 px-4 py-4 sm:py-6">
      {/* Mobile: 3+2 layout */}
      <div className="flex w-full flex-col gap-4 sm:hidden">
        <div className="flex justify-center gap-3">
          {topRow.map(renderChest)}
        </div>
        <div className="flex justify-center gap-6">
          {bottomRow.map(renderChest)}
        </div>
      </div>
      {/* Desktop: single row */}
      <div className="hidden w-full justify-center gap-4 sm:flex">
        {[0, 1, 2, 3, 4].map(renderChest)}
      </div>
    </div>
  );
}
