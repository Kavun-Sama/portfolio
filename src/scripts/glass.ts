/** Feeds the pointer position to the glass highlight. Pure CSS reads --mx/--my; nothing here touches layout. */
export function initGlass(): void {
  const canTrack = window.matchMedia("(hover: hover) and (prefers-reduced-motion: no-preference)");
  if (!canTrack.matches) return;

  document.querySelectorAll<HTMLElement>(".glass").forEach((surface) => {
    surface.addEventListener("pointermove", (event) => {
      const rect = surface.getBoundingClientRect();
      surface.style.setProperty("--mx", `${event.clientX - rect.left}px`);
      surface.style.setProperty("--my", `${event.clientY - rect.top}px`);
    });
  });
}
