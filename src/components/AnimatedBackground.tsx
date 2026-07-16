export default function AnimatedBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute -left-32 top-16 h-80 w-80 rounded-full bg-[#E8A84A]/[0.12] blur-3xl animate-float" />
      <div className="absolute -right-20 bottom-24 h-72 w-72 rounded-full bg-accent/[0.08] blur-3xl animate-float" />
      <div className="absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full bg-[#FFF5E6]/60 blur-3xl" />
    </div>
  );
}
