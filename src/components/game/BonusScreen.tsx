interface BonusScreenProps {
  isLoading: boolean;
  onPickChest: (index: number) => void;
}

const BONUS_LABELS = ["Small Fortune", "Great Hoard", "Dark Secret"];

export default function BonusScreen({ isLoading, onPickChest }: BonusScreenProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="mx-4 flex w-full max-w-md flex-col items-center gap-6 rounded-2xl border border-[rgba(212,168,67,0.4)] bg-[rgba(17,24,39,0.95)] p-6">
        <h2
          className="text-xl font-bold text-[var(--color-gold-bright)]"
          style={{ fontFamily: "var(--font-cinzel)" }}
        >
          Bonus Vault
        </h2>
        <p className="text-center text-sm text-[var(--color-muted)]">
          Choose one chest. Fortune or curse awaits.
        </p>
        <div className="grid w-full grid-cols-3 gap-3">
          {[0, 1, 2].map((index) => (
            <button
              key={index}
              type="button"
              disabled={isLoading}
              onClick={() => onPickChest(index)}
              className="group flex flex-col items-center gap-2 rounded-xl border border-[rgba(212,168,67,0.3)] bg-[rgba(26,31,46,0.8)] p-4 transition hover:border-[rgba(212,168,67,0.6)] hover:bg-[rgba(212,168,67,0.1)] disabled:opacity-40"
            >
              <div
                className="flex h-16 w-full items-center justify-center rounded-lg text-2xl transition group-hover:scale-105"
                style={{
                  background:
                    "linear-gradient(180deg, #5a3d20 0%, #3d2817 100%)",
                  border: "2px solid #8b6914",
                }}
              >
                🏴‍☠️
              </div>
              <span className="text-xs text-[var(--color-muted)]">
                {BONUS_LABELS[index]}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
