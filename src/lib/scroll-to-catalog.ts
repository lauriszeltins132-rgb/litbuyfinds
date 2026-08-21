/** Scroll to the browse-all-finds grid (homepage catalog). */
export function scrollToCatalogResults(behavior: ScrollBehavior = "smooth") {
  const run = () => {
    const target =
      document.getElementById("catalog-product-grid") ??
      document.getElementById("browse");
    if (!target) return;
    target.scrollIntoView({ behavior, block: "start" });
  };

  // Double rAF waits until after React commits + paints filtered results.
  requestAnimationFrame(() => {
    requestAnimationFrame(run);
  });
}
