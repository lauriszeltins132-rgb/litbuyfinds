export default function AnimatedBackground() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-accent/[0.05] blur-3xl animate-float" />
        <div className="absolute -right-24 bottom-32 h-64 w-64 rounded-full bg-accent/[0.04] blur-3xl animate-float" />
      </div>
      <div aria-hidden className="scan-line" />
    </>
  );
}
