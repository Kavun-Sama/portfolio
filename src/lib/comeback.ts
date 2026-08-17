import { $ } from "./dom";
import clipFirst from "../../clip_1.mp4";
import clipSecond from "../../clip_2.mp4";
import clipThird from "../../clip_3.mp4";

// Indexed by return count; the last one repeats from the third return on.
const CLIPS = [clipFirst, clipSecond, clipThird];
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
  const clip = $<HTMLVideoElement>("[data-comeback-clip]");
  const close = $("[data-comeback-close]");
  if (!sheet || !card) return;

  // The clips do not share an aspect ratio, so let each one size its own
  // frame instead of leaving bars around it. Read from the file rather than
  // hardcoding, so swapping a clip needs no code change.
  if (clip) {
    clip.addEventListener("loadedmetadata", () => {
      if (clip.videoWidth && clip.videoHeight) {
        clip.style.aspectRatio = `${clip.videoWidth} / ${clip.videoHeight}`;
      }
    });
  }

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
    const art = CLIPS[Math.min(returns - 1, CLIPS.length - 1)];
    if (clip && art) {
      if (clip.getAttribute("src") !== art) clip.src = art;
      // Autoplay is refused on some setups; the frame simply stays still then.
      void clip.play().catch(() => {});
    }
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
