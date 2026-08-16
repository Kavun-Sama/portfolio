import { $ } from "./dom";

const GIF_KEY = "kk_comeback_gif";
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

export function initComeback(): void {
  const sheet = $("[data-comeback]");
  const card = $("[data-comeback-card]");
  const title = $("[data-comeback-title]");
  const quip = $("[data-comeback-quip]");
  const clock = $("[data-comeback-clock]");
  const close = $("[data-comeback-close]");
  if (!sheet || !card) return;

  initGifSlot();

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

function initGifSlot(): void {
  const slot = $("[data-gif-slot]");
  const img = $<HTMLImageElement>("[data-gif-img]");
  const hint = $("[data-gif-hint]");
  const input = $<HTMLInputElement>("[data-gif-input]");
  if (!slot || !img || !input) return;

  const paint = (url: string): void => {
    img.src = url;
    img.removeAttribute("hidden");
    hint?.setAttribute("hidden", "");
    slot.classList.add("is-filled");
  };

  // Read as a data URL rather than re-encoding through a canvas: canvas would
  // freeze an animated GIF on its first frame.
  const ingest = (file: File | undefined): void => {
    if (!file || !file.type.startsWith("image/")) return;
    if (file.size > 6 * 1024 * 1024) {
      if (hint) hint.textContent = "Under 6 MB, please";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const url = String(reader.result);
      paint(url);
      try {
        localStorage.setItem(GIF_KEY, url);
      } catch {
        if (hint) hint.textContent = "Too large to remember";
      }
    };
    reader.readAsDataURL(file);
  };

  try {
    const saved = localStorage.getItem(GIF_KEY);
    if (saved) paint(saved);
  } catch {
    /* storage blocked — the slot just starts empty */
  }

  slot.addEventListener("click", () => input.click());
  input.addEventListener("change", () => ingest(input.files?.[0]));
  slot.addEventListener("dragover", (event) => { event.preventDefault(); slot.classList.add("is-hot"); });
  slot.addEventListener("dragleave", () => slot.classList.remove("is-hot"));
  slot.addEventListener("drop", (event) => {
    event.preventDefault();
    slot.classList.remove("is-hot");
    ingest(event.dataTransfer?.files?.[0]);
  });
}
