"use client";

import { useGameSession } from "./hooks/useGameSession";
import CaveBackground from "./CaveBackground";
import GameHeader from "./GameHeader";
import ChestGrid from "./ChestGrid";
import BetControls from "./BetControls";
import ActionBar from "./ActionBar";
import BonusScreen from "./BonusScreen";
import WinOverlay from "./overlays/WinOverlay";
import CurseOverlay from "./overlays/CurseOverlay";
import GoldenKeyOverlay from "./overlays/GoldenKeyOverlay";

export default function GameShell() {
  const game = useGameSession();

  const showBetControls = game.clientPhase === "idle";
  const showChestGrid =
    game.clientPhase !== "idle" &&
    game.clientPhase !== "won" &&
    game.clientPhase !== "lost";
  const showActionBar =
    game.clientPhase === "round_active" || game.clientPhase === "chest_selected";

  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-between">
      <CaveBackground />

      <GameHeader
        multiplier={game.multiplier}
        potentialWin={game.potentialWin}
        balance={game.balance}
      />

      {showChestGrid && (
        <ChestGrid
          openedChests={game.openedChests}
          selectedChest={game.selectedChest}
          revealingChest={game.revealingChest}
          lastOutcome={game.lastOutcome}
          disabled={
            game.isLoading ||
            game.clientPhase === "revealing" ||
            game.clientPhase === "golden_key_offer" ||
            game.clientPhase === "bonus_active"
          }
          onSelectChest={game.selectChest}
        />
      )}

      {showBetControls && (
        <BetControls
          bet={game.bet}
          balance={game.balance}
          disabled={game.isLoading}
          onBetChange={game.setBet}
          onStartRound={game.startRound}
        />
      )}

      {showActionBar && (
        <ActionBar
          canOpen={game.selectedChest !== null && !game.isLoading}
          canCashOut={game.canCashOut}
          potentialWin={game.potentialWin}
          isLoading={game.isLoading}
          onOpenChest={game.openChest}
          onCashOut={game.cashOut}
        />
      )}

      {game.error && (
        <div className="fixed bottom-4 left-4 right-4 z-40 rounded-lg border border-red-500/50 bg-red-900/80 px-4 py-2 text-center text-sm text-red-200">
          {game.error}
        </div>
      )}

      {game.clientPhase === "golden_key_offer" && (
        <GoldenKeyOverlay
          multiplier={game.multiplier}
          potentialWin={game.potentialWin}
          isLoading={game.isLoading}
          onUseKey={game.acceptGoldenKey}
          onTakeWin={game.cashOut}
        />
      )}

      {game.clientPhase === "bonus_active" && (
        <BonusScreen
          isLoading={game.isLoading}
          onPickChest={game.pickBonusChest}
        />
      )}

      {game.clientPhase === "won" && game.winAmount !== null && game.winTier && (
        <WinOverlay
          winAmount={game.winAmount}
          tier={game.winTier}
          onDismiss={game.resetRound}
        />
      )}

      {game.clientPhase === "lost" && (
        <CurseOverlay onDismiss={game.resetRound} />
      )}

      <div
        className="pb-[env(safe-area-inset-bottom,0px)]"
        aria-hidden
      />
    </main>
  );
}
