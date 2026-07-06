import { formatCurrency, formatMultiplier } from "@/lib/game/win-tier";

interface GameHeaderProps {
  multiplier: number;
  potentialWin: number;
  balance: number;
}

export default function GameHeader({
  multiplier,
  potentialWin,
  balance,
}: GameHeaderProps) {
  return (
    <header className="flex flex-col items-center gap-3 px-4 pt-6 pb-2">
      <h1
        className="text-center text-2xl font-bold tracking-widest sm:text-3xl"
        style={{
          fontFamily: "var(--font-cinzel)",
          background: "linear-gradient(135deg, #d4a843, #f5c842, #d4a843)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textShadow: "0 0 40px rgba(212,168,67,0.3)",
        }}
      >
        Cursed Chest
      </h1>

      <div className="flex w-full max-w-sm items-center justify-between rounded-xl border border-[rgba(212,168,67,0.2)] bg-[rgba(17,24,39,0.8)] px-4 py-2 backdrop-blur-sm">
        <div className="text-center">
          <p className="text-xs text-[var(--color-muted)] uppercase tracking-wider">
            Balance
          </p>
          <p className="text-sm font-semibold text-[var(--color-foreground)]">
            {formatCurrency(balance)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-[var(--color-muted)] uppercase tracking-wider">
            Multiplier
          </p>
          <p
            className="text-xl font-bold"
            style={{ color: "var(--color-gold-bright)" }}
          >
            {formatMultiplier(multiplier)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-[var(--color-muted)] uppercase tracking-wider">
            Potential
          </p>
          <p className="text-sm font-semibold text-[var(--color-gold)]">
            {formatCurrency(potentialWin)}
          </p>
        </div>
      </div>
    </header>
  );
}
