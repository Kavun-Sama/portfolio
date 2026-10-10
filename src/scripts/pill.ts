import type { SectionChange } from "./spy";

type Box = { x: number; y: number; w: number; h: number };
type State = Box & { o: number; s: number };

export interface Pill {
  /** Moves the pill onto an item right away, for a click that is about to leave the page. */
  glideTo(item: HTMLElement): void;
  /** Re-measures without animating: after a resize, or when the page returns from the back/forward cache. */
  settle(): void;
}

const HIDDEN_SCALE = 0.7;
/** The pill stretches over both items first, then the trailing edge catches up: a liquid drop, not a slide. */
const STRETCH_AT = 0.4;

/**
 * The selection pill. One element glides between dock items as the current section changes. Geometry is animated with
 * the Web Animations API from the pill's live state, so a new target mid-flight continues from where the pill is
 * instead of snapping. With reduced motion it only moves, instantly.
 */
export function initPill(): Pill | null {
  const dock = document.querySelector<HTMLElement>("[data-dock]");
  const pill = dock?.querySelector<HTMLElement>("[data-pill]");
  const list = dock?.querySelector<HTMLElement>(".dock__list");
  const brand = dock?.querySelector<HTMLElement>(".dock__brand") ?? null;
  if (!dock || !pill || !list) return null;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const spring = getComputedStyle(document.documentElement).getPropertyValue("--ease-spring").trim() || "ease-out";

  let running: Animation | null = null;
  let wanted: string | null = null;
  let holdUntil = 0;

  const shown = (el: HTMLElement): boolean => el.getClientRects().length > 0;

  const boxOf = (el: HTMLElement): Box =>
    // The brand mark is narrower than the rail, so the pill borrows the width of the list under it.
    el === brand
      ? { x: list.offsetLeft, y: el.offsetTop, w: list.offsetWidth, h: el.offsetHeight }
      : { x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight };

  const read = (): State => {
    const style = getComputedStyle(pill);
    return {
      x: parseFloat(style.left),
      y: parseFloat(style.top),
      w: parseFloat(style.width),
      h: parseFloat(style.height),
      o: parseFloat(style.opacity),
      s: parseFloat(style.scale) || 1
    };
  };

  const frame = (box: Box, o: number, s: number): Keyframe => ({
    left: `${box.x}px`,
    top: `${box.y}px`,
    width: `${box.w}px`,
    height: `${box.h}px`,
    opacity: o,
    scale: s
  });

  const commit = (box: Box | null): void => {
    if (box) {
      pill.style.left = `${box.x}px`;
      pill.style.top = `${box.y}px`;
      pill.style.width = `${box.w}px`;
      pill.style.height = `${box.h}px`;
    }
    pill.style.opacity = box ? "1" : "0";
    pill.style.scale = box ? "1" : String(HIDDEN_SCALE);
  };

  const isColumn = (): boolean => getComputedStyle(list).flexDirection === "column";

  /** The union of two boxes along the travel axis; the other axis follows the target. */
  const stretched = (from: Box, to: Box): Box => {
    if (isColumn()) {
      const top = Math.min(from.y, to.y);
      return { x: to.x, w: to.w, y: top, h: Math.max(from.y + from.h, to.y + to.h) - top };
    }
    const left = Math.min(from.x, to.x);
    return { y: to.y, h: to.h, x: left, w: Math.max(from.x + from.w, to.x + to.w) - left };
  };

  const move = (target: Box | null, animate: boolean): void => {
    const from = read();
    running?.cancel();
    running = null;
    commit(target);
    if (!animate || reduced.matches) return;

    let keyframes: Keyframe[];
    let duration = 520;
    let easing = spring;
    if (target && from.o < 0.05) {
      // Appearing: a pop in place.
      keyframes = [frame(target, 0, HIDDEN_SCALE), frame(target, 1, 1)];
    } else if (!target) {
      keyframes = [frame(from, from.o, from.s), { ...frame(from, 0, HIDDEN_SCALE) }];
      duration = 240;
      easing = "cubic-bezier(0.2, 0.8, 0.2, 1)";
    } else {
      const travel = isColumn() ? Math.abs(target.y - from.y) : Math.abs(target.x - from.x);
      if (travel < 1 && Math.abs(target.h - from.h) < 1 && Math.abs(target.w - from.w) < 1) return;
      duration = Math.round(Math.min(760, 400 + travel * 0.9));
      keyframes = [
        { ...frame(from, from.o, from.s), easing: "cubic-bezier(0.3, 0.7, 0.2, 1)" },
        { ...frame(stretched(from, target), 1, 1), offset: STRETCH_AT, easing: spring },
        frame(target, 1, 1)
      ];
      easing = "linear";
    }
    running = pill.animate(keyframes, { duration, easing });
    running.onfinish = () => {
      running = null;
    };
  };

  const resolve = (id: string | null): HTMLElement | null => {
    if (id) {
      const item = dock.querySelector<HTMLElement>(`[data-spy="${CSS.escape(id)}"]`);
      return item && shown(item) ? item : null;
    }
    // Above the first section the pill rests on the brand mark. The bar has none, so it hides there.
    return brand && shown(brand) ? brand : null;
  };

  const settle = (): void => {
    const item = resolve(wanted);
    move(item ? boxOf(item) : null, false);
    dock.dataset.pillReady = "";
  };

  window.addEventListener("kk:section", (event) => {
    wanted = (event as SectionChange).detail.id;
    if (performance.now() < holdUntil) return;
    const item = resolve(wanted);
    move(item ? boxOf(item) : null, true);
  });

  const observer = new ResizeObserver(settle);
  observer.observe(dock);
  observer.observe(list);

  return {
    glideTo(item) {
      holdUntil = performance.now() + 1000;
      move(boxOf(item), true);
    },
    settle
  };
}
