/** Scroll to the browse-all-finds grid (homepage catalog). */
export function scrollToCatalogResults(behavior: ScrollBehavior = "smooth") {
  requestAnimationFrame(() => {
    const target =
      document.getElementById("catalog-product-grid") ??
      document.getElementById("browse");
    target?.scrollIntoView({ behavior, block: "start" });
  });
}
