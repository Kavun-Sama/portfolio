/**
 * Fallback for browsers without scroll-driven animations (Firefox at the time of writing): the parts that CSS scrubs
 * with the scroll position instead come in once, on a timer, when they first reach the viewport. Elements already on
 * screen are left alone so nothing flashes, and everything stays visible if this never runs.
 * The selector list mirrors the scroll-driven block in motion.css.
 */
const TARGETS = ".plate, .section__head, .row, .langs, .notes__item, .contact > li, .doc-head, .doc-section__head, .entry";
const STAGGER_MS = 70;

export function initDepth(): void {
  if (CSS.supports("animation-timeline: view()")) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;

  const below = [...document.querySelectorAll<HTMLElement>(TARGETS)].filter(
    (el) => el.getBoundingClientRect().top > window.innerHeight * 0.92
  );
  if (!below.length) return;

  below.forEach((el) => el.classList.add("kk-pre"));
  const observer = new IntersectionObserver(
    (entries) => {
      entries
        .filter((entry) => entry.isIntersecting)
        .forEach((entry, index) => {
          const el = entry.target as HTMLElement;
          el.style.transitionDelay = `${index * STAGGER_MS}ms`;
          el.classList.replace("kk-pre", "kk-in");
          observer.unobserve(el);
        });
    },
    { rootMargin: "0px 0px -10% 0px" }
  );
  below.forEach((el) => observer.observe(el));
}
