/** Scroll to the browse-all-finds grid (homepage catalog). */
export function scrollToCatalogResults(
  behavior: ScrollBehavior = "smooth",
  anchorId?: string
) {
  const run = () => {
    const anchored = anchorId ? document.getElementById(anchorId) : null;
    const target =
      anchored ??
      document.getElementById("catalog-product-grid") ??
      document.getElementById("browse");
    if (!target) return false;
    const motion: ScrollBehavior =
      anchorId &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : behavior;
    target.scrollIntoView({ behavior: motion, block: "start" });
    return true;
  };

  // Wait for React commit/paint; retry briefly if the grid isn't mounted yet.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (run()) return;
      window.setTimeout(() => {
        run();
      }, 50);
    });
  });
}
