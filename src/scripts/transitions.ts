import type { Pill } from "./pill";

/** Where the next page grows from, as percentages of the viewport. Read by the inline `pagereveal` handler. */
const KEY = "kk_vt";
/** The pill needs this long to land on the clicked item before the page starts leaving. */
const GLIDE_MS = 300;

type Origin = { x: number; y: number };

const percent = (value: number, of: number): number => Math.round((value / of) * 1000) / 10;

/** The pointer for a mouse or touch click, the centre of the control for keyboard activation. */
function originOf(event: MouseEvent, link: HTMLElement): Origin {
  const box = link.getBoundingClientRect();
  const fromKeyboard = event.detail === 0 || (event.clientX === 0 && event.clientY === 0);
  const x = fromKeyboard ? box.left + box.width / 2 : event.clientX;
  const y = fromKeyboard ? box.top + box.height / 2 : event.clientY;
  return { x: percent(x, window.innerWidth), y: percent(y, window.innerHeight) };
}

/**
 * Between the portfolio and the résumé the browser runs a cross-document view transition (see motion.css): the next
 * page opens as a circle from the click. This records where the click was, and for a dock item lets the pill land
 * on it first. Browsers without the API navigate normally.
 */
export function initTransitions(pill: Pill | null): void {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

  document.addEventListener("click", (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
    if (!link || link.target === "_blank" || link.hasAttribute("download")) return;

    const url = new URL(link.href, window.location.href);
    if (url.origin !== window.location.origin || url.pathname === window.location.pathname) return;

    try {
      sessionStorage.setItem(KEY, JSON.stringify(originOf(event, link)));
    } catch {
      // Storage can be unavailable. The next page then opens from the centre of the screen.
    }

    const item = link.closest<HTMLElement>(".dock__item");
    if (!pill || !item || reduced.matches) return;
    event.preventDefault();
    pill.glideTo(item);
    window.setTimeout(() => window.location.assign(url), GLIDE_MS);
  });

  // Back from the back/forward cache the page is restored as it was left, with the pill on the clicked item.
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) pill?.settle();
  });
}
