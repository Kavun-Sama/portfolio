import { $, prefersReducedMotion } from "./dom";

type Layer = { node: HTMLElement; mx: number; my: number; ms: number };

export function initBlooms(): void {
  if (prefersReducedMotion()) return;
  const layers: Layer[] = [
    { node: $("[data-bloom='a']")!, mx: 90, my: 70, ms: 0.07 },
    { node: $("[data-bloom='b']")!, mx: -120, my: -90, ms: 0.045 },
    { node: $("[data-bloom='c']")!, mx: 70, my: -60, ms: 0.09 }
  ].filter((layer) => layer.node);

  if (!layers.length) return;

  const target = { x: 0.5, y: 0.5 };
  const eased = { x: 0.5, y: 0.5 };

  window.addEventListener("pointermove", (event) => {
    target.x = event.clientX / window.innerWidth;
    target.y = event.clientY / window.innerHeight;
  });

  const frame = (): void => {
    eased.x += (target.x - eased.x) * 0.045;
    eased.y += (target.y - eased.y) * 0.045;
    const dx = eased.x - 0.5;
    const dy = eased.y - 0.5;
    const scrolled = window.scrollY;
    for (const layer of layers) {
      layer.node.style.transform = `translate3d(${(dx * layer.mx).toFixed(1)}px, ${(dy * layer.my - scrolled * layer.ms).toFixed(1)}px, 0)`;
    }
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}
