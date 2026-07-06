import type { PickOutcome } from "@/lib/game/types";

type ChestState = "idle" | "selected" | "shaking" | "revealed";

interface ChestProps {
  index: number;
  state: ChestState;
  outcome?: PickOutcome | null;
  disabled?: boolean;
  onClick: () => void;
}

export default function Chest({
  index,
  state,
  outcome,
  disabled,
  onClick,
}: ChestProps) {
  const isRevealed = state === "revealed";
  const isShaking = state === "shaking";
  const isSelected = state === "selected";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || isRevealed}
      aria-label={`Chest ${index + 1}`}
      className={`
        relative flex aspect-square w-full max-w-[120px] flex-col items-center justify-center
        transition-all duration-200
        ${isShaking ? "chest-shake" : ""}
        ${isSelected ? "scale-105" : ""}
        ${disabled && !isRevealed ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
        ${!disabled && !isRevealed ? "hover:scale-105" : ""}
      `}
    >
      {/* Glow behind selected */}
      {isSelected && (
        <div className="pulse-glow absolute inset-0 rounded-2xl bg-[rgba(212,168,67,0.2)]" />
      )}

      {/* Chest body */}
      <div
        className="relative z-10 w-[85%] rounded-lg"
        style={{
          background: isRevealed && outcome === "curse"
            ? "linear-gradient(180deg, #2a1a10 0%, #1a0f08 100%)"
            : "linear-gradient(180deg, #5a3d20 0%, #3d2817 50%, #2a1a10 100%)",
          boxShadow: isRevealed
            ? outcome === "curse"
              ? "0 0 30px rgba(107,33,168,0.6), inset 0 2px 4px rgba(0,0,0,0.5)"
              : "0 0 30px rgba(212,168,67,0.5), inset 0 2px 4px rgba(0,0,0,0.5)"
            : "0 8px 24px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.1)",
          border: "2px solid",
          borderColor: isRevealed
            ? outcome === "curse"
              ? "#6b21a8"
              : "#c9a227"
            : isSelected
              ? "#f5c842"
              : "#8b6914",
          height: "70%",
        }}
      >
        {/* Lid */}
        <div
          className="absolute -top-[15%] left-[-2%] w-[104%] rounded-t-lg"
          style={{
            height: "30%",
            background: "linear-gradient(180deg, #6b4d2a 0%, #5a3d20 100%)",
            border: "2px solid #8b6914",
            borderBottom: "none",
            transform: isRevealed ? "rotateX(-40deg)" : "none",
            transformOrigin: "bottom center",
            transition: "transform 0.4s ease",
          }}
        />
        {/* Lock */}
        <div
          className="absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: 16,
            height: 16,
            background: "radial-gradient(circle, #f5c842, #c9a227)",
            boxShadow: "0 0 8px rgba(245,200,66,0.6)",
          }}
        />
        {/* Gold band */}
        <div
          className="absolute top-[40%] right-0 left-0 h-[3px]"
          style={{ background: "linear-gradient(90deg, transparent, #c9a227, transparent)" }}
        />
      </div>

      {/* Revealed outcome effects */}
      {isRevealed && outcome === "treasure" && (
        <div className="gold-burst pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="text-2xl">💎</span>
          {Array.from({ length: 3 }).map((_, i) => (
            <span
              key={i}
              className="coin-float absolute text-sm"
              style={{
                left: `${30 + i * 20}%`,
                animationDelay: `${i * 0.15}s`,
              }}
            >
              ✦
            </span>
          ))}
        </div>
      )}
      {isRevealed && outcome === "curse" && (
        <div className="curse-smoke pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="text-3xl">💀</span>
        </div>
      )}
      {isRevealed && outcome === "golden_key" && (
        <div className="key-rise pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="text-2xl">🗝️</span>
        </div>
      )}
      {isRevealed && outcome === "mystery" && (
        <div className="gold-burst pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="text-2xl">✨</span>
        </div>
      )}
    </button>
  );
}
