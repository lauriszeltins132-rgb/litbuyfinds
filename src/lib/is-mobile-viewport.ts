/**
 * Coarse mobile viewport check for image-loader behavior.
 * Matches Tailwind `md` breakpoint (768px) — phone/narrow tablet only.
 */
export function isMobileViewport(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.matchMedia("(max-width: 767px)").matches;
  } catch {
    return false;
  }
}
