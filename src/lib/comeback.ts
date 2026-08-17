import { $ } from "./dom";

const AWAY_MS = 3000;
const TITLES = [
  "Welcome back",
  "Twice now. I am counting.",
  "Third time — just take the Telegram link.",
  "You keep leaving. The tunnel stays open anyway."
];
const QUIPS = [
  "Nothing dropped.",
  "Still nothing dropped.",
  "Zero packet loss, infinite patience.",
  "This is a very well-tested reconnect path."
];
const NAGS = ["← come back", "the tunnel is still open", "kkkavun is waiting"];

export type ComebackOptions = {
  /** Runs just before the sheet appears, so the page can dismiss whatever it covers. */
  onShow?: () => void;
};

export function initComeback({ onShow }: ComebackOptions = {}): void {
  const sheet = $("[data-comeback]");
  const card = $("[data-comeback-card]");
  const title = $("[data-comeback-title]");
  const quip = $("[data-comeback-quip]");
  const clock = $("[data-comeback-clock]");
  const close = $("[data-comeback-close]");
  if (!sheet || !card) return;

  let awayAt: number | null = null;
  let shown = false;
  let returns = 0;
  let pageTitle = document.title;
  let nagTimer = 0;

  const humanize = (seconds: number): string =>
    seconds < 60 ? `${seconds} seconds` : seconds < 3600 ? `${Math.round(seconds / 60)} minutes` : `${Math.round(seconds / 3600)} hours`;

  const show = (): void => {
    if (shown || awayAt === null) return;
    shown = true;
    onShow?.();
    returns += 1;
    const index = Math.min(returns - 1, TITLES.length - 1);
    if (title) title.textContent = TITLES[index]!;
    if (quip) quip.textContent = QUIPS[index]!;
    if (clock) clock.textContent = humanize(Math.max(2, Math.round((Date.now() - awayAt) / 1000)));
    sheet.removeAttribute("hidden");
    requestAnimationFrame(() => sheet.classList.add("is-open"));
  };

  const dismiss = (): void => {
    shown = false;
    sheet.classList.remove("is-open");
    window.setTimeout(() => sheet.setAttribute("hidden", ""), 460);
  };

  const leave = (): void => {
    if (awayAt === null) awayAt = Date.now();
  };

  const back = (): void => {
    if (document.hidden) return;
    if (awayAt !== null && Date.now() - awayAt > AWAY_MS) show();
    awayAt = null;
  };

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      leave();
      pageTitle = document.title;
      let n = 0;
      document.title = NAGS[0]!;
      nagTimer = window.setInterval(() => {
        n = (n + 1) % NAGS.length;
        document.title = NAGS[n]!;
      }, 1400);
      return;
    }
    window.clearInterval(nagTimer);
    document.title = pageTitle;
    back();
  });

  window.addEventListener("blur", leave);
  window.addEventListener("focus", back);
  close?.addEventListener("click", dismiss);
}
