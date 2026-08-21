/** Scroll to the browse-all-finds grid (homepage catalog). */
export function scrollToCatalogResults(behavior: ScrollBehavior = "smooth") {
  const run = () => {
    const target =
      document.getElementById("catalog-product-grid") ??
      document.getElementById("browse");
    if (!target) return false;
    target.scrollIntoView({ behavior, block: "start" });
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
