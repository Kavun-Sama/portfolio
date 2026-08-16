import { $$, prefersReducedMotion } from "./dom";

const SHOWN = "is-revealed";

export function initReveal(selector = "[data-reveal]"): void {
  if (prefersReducedMotion()) return;
  let pending = $$(selector);
  pending.forEach((node) => node.classList.add("will-reveal"));

  const check = (): void => {
    const limit = window.innerHeight * 0.92;
    let shown = 0;
    pending = pending.filter((node) => {
      if (node.getBoundingClientRect().top > limit) return true;
      const delay = shown++ * 70;
      window.setTimeout(() => node.classList.add(SHOWN), delay);
      return false;
    });
    if (!pending.length) window.clearInterval(timer);
  };

  const timer = window.setInterval(check, 200);
  document.addEventListener("scroll", check, { passive: true, capture: true });
  check();
}
