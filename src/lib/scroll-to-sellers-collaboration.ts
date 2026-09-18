/** Homepage anchor for the sponsored sellers collaboration rail. */
export const SELLERS_COLLABORATION_SECTION_ID = "sellers-collaboration";

/** Smooth-scroll to the existing collaboration section (no new routes). */
export function scrollToSellersCollaboration(
  behavior: ScrollBehavior = "smooth"
) {
  const run = () => {
    const target = document.getElementById(SELLERS_COLLABORATION_SECTION_ID);
    if (!target) return false;
    target.scrollIntoView({ behavior, block: "start" });
    target.classList.add("sellers-collab-section--flash");
    window.setTimeout(() => {
      target.classList.remove("sellers-collab-section--flash");
    }, 1400);
    return true;
  };

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (run()) return;
      window.setTimeout(() => {
        run();
      }, 50);
    });
  });
}
