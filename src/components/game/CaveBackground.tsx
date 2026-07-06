export default function CaveBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 100%, #1a2540 0%, #0a0e1a 50%, #050810 100%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 80%, rgba(107, 33, 168, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(22, 163, 74, 0.1) 0%, transparent 40%)",
        }}
      />

      {/* Gold particles */}
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="float-particle absolute h-1 w-1 rounded-full bg-[#d4a843]"
          style={{
            left: `${10 + (i * 7) % 80}%`,
            top: `${20 + (i * 11) % 60}%`,
            animationDelay: `${i * 0.4}s`,
            animationDuration: `${3 + (i % 3)}s`,
          }}
        />
      ))}

      {/* Kraken eyes */}
      <svg
        className="absolute bottom-[15%] left-[8%] opacity-20"
        width="40"
        height="20"
        viewBox="0 0 40 20"
      >
        <ellipse cx="12" cy="10" rx="8" ry="10" fill="#16a34a" />
        <ellipse cx="12" cy="10" rx="3" ry="5" fill="#0a0e1a" />
        <ellipse cx="28" cy="10" rx="8" ry="10" fill="#16a34a" />
        <ellipse cx="28" cy="10" rx="3" ry="5" fill="#0a0e1a" />
      </svg>
      <svg
        className="absolute right-[10%] bottom-[20%] opacity-15"
        width="40"
        height="20"
        viewBox="0 0 40 20"
      >
        <ellipse cx="12" cy="10" rx="8" ry="10" fill="#6b21a8" />
        <ellipse cx="12" cy="10" rx="3" ry="5" fill="#0a0e1a" />
        <ellipse cx="28" cy="10" rx="8" ry="10" fill="#6b21a8" />
        <ellipse cx="28" cy="10" rx="3" ry="5" fill="#0a0e1a" />
      </svg>

      {/* Curse smoke wisps */}
      <div
        className="absolute top-[30%] left-[5%] h-32 w-32 rounded-full opacity-10 blur-3xl"
        style={{ background: "radial-gradient(circle, #6b21a8, transparent)" }}
      />
      <div
        className="absolute top-[40%] right-[8%] h-24 w-24 rounded-full opacity-10 blur-2xl"
        style={{ background: "radial-gradient(circle, #16a34a, transparent)" }}
      />
    </div>
  );
}
