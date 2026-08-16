import { $, prefersReducedMotion } from "./dom";

const KEY = "kk_tx";
const OUT_MS = 780;

const reach = (x: number, y: number): number =>
  Math.ceil(Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y)));

const readOrigin = (): { x: number; y: number } | null => {
  try {
    const raw = sessionStorage.getItem(KEY);
    sessionStorage.removeItem(KEY);
    return raw ? (JSON.parse(raw) as { x: number; y: number }) : null;
  } catch {
    return null;
  }
};

const hideCurtain = (curtain: HTMLElement): void => {
  curtain.setAttribute("hidden", "");
  curtain.style.transition = "none";
  curtain.style.opacity = "0";
  curtain.style.clipPath = "";
};

export function initTransitions(): void {
  const curtain = $("[data-curtain]");
  const label = $("[data-curtain-label]");
  const stage = $("[data-stage]");
  if (!curtain) return;

  playEnter(curtain, stage, readOrigin());

  // Restoring from bfcache replays the DOM as it was mid-navigation, with the
  // curtain fully expanded — clear it so the page is not left dimmed.
  window.addEventListener("pageshow", (event) => {
    if (!event.persisted) return;
    hideCurtain(curtain);
    stage?.classList.remove("stage--leaving", "stage--entering");
  });

  document.addEventListener("click", (event) => {
    const link = (event.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
    if (!link || link.target === "_blank") return;
    const href = link.getAttribute("href") ?? "";
    if (!/\.html$/.test(href)) return;

    event.preventDefault();
    const box = link.getBoundingClientRect();
    const x = (event as MouseEvent).clientX || box.left + box.width / 2;
    const y = (event as MouseEvent).clientY || box.top + box.height / 2;

    if (label) label.textContent = /resume/i.test(href) ? "Résumé" : "Portfolio";
    try {
      sessionStorage.setItem(KEY, JSON.stringify({ x: x / window.innerWidth, y: y / window.innerHeight }));
    } catch {
      /* private mode — the arriving page simply fades instead */
    }

    if (prefersReducedMotion()) {
      window.location.href = href;
      return;
    }

    curtain.removeAttribute("hidden");
    curtain.style.transition = "none";
    curtain.style.opacity = "1";
    curtain.style.clipPath = `circle(0px at ${x}px ${y}px)`;
    void curtain.offsetHeight;

    const play = (): void => {
      curtain.style.transition = "clip-path .8s cubic-bezier(.66,0,.24,1)";
      curtain.style.clipPath = `circle(${reach(x, y)}px at ${x}px ${y}px)`;
      stage?.classList.add("stage--leaving");
    };
    requestAnimationFrame(() => requestAnimationFrame(play));
    window.setTimeout(play, 50);
    window.setTimeout(() => { window.location.href = href; }, OUT_MS);
  });
}

function playEnter(curtain: HTMLElement, stage: HTMLElement | null, origin: { x: number; y: number } | null): void {
  stage?.classList.add("stage--entering");
  const settle: Array<() => void> = [
    () => stage?.classList.remove("stage--entering")
  ];

  if (!origin || prefersReducedMotion()) {
    hideCurtain(curtain);
  }

  if (origin && !prefersReducedMotion()) {
    const x = origin.x * window.innerWidth;
    const y = origin.y * window.innerHeight;
    curtain.removeAttribute("hidden");
    curtain.style.transition = "none";
    curtain.style.opacity = "1";
    curtain.style.clipPath = `circle(${reach(x, y)}px at ${x}px ${y}px)`;
    void curtain.offsetHeight;
    settle.push(() => {
      curtain.style.transition = "clip-path .9s cubic-bezier(.66,0,.24,1), opacity .45s ease .5s";
      curtain.style.clipPath = `circle(0px at ${x}px ${y}px)`;
      curtain.style.opacity = "0";
    });
    window.setTimeout(() => curtain.setAttribute("hidden", ""), 1150);
  }

  const run = (): void => settle.forEach((fn) => fn());
  requestAnimationFrame(run);
  window.setTimeout(run, 60);
  window.setTimeout(run, 1200);
}
