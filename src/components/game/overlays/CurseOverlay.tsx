import Button from "@/components/ui/Button";

interface CurseOverlayProps {
  onDismiss: () => void;
}

export default function CurseOverlay({ onDismiss }: CurseOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="curse-smoke mx-4 flex max-w-sm flex-col items-center gap-4 rounded-2xl border border-[rgba(107,33,168,0.5)] bg-[rgba(17,24,39,0.95)] p-8 text-center">
        <div className="text-6xl">🦑</div>
        <h2
          className="text-2xl font-bold text-[var(--color-curse-purple)]"
          style={{ fontFamily: "var(--font-cinzel)" }}
        >
          Cursed!
        </h2>
        <p className="text-[var(--color-muted)]">
          The kraken&apos;s curse claimed your treasure. Better luck next time.
        </p>
        <div
          className="h-16 w-full rounded-lg opacity-40"
          style={{
            background:
              "linear-gradient(180deg, rgba(107,33,168,0.4), rgba(22,163,74,0.2))",
          }}
        />
        <Button variant="secondary" className="mt-2 w-full" onClick={onDismiss}>
          Try Again
        </Button>
      </div>
    </div>
  );
}
