export type ThemeMode = "system" | "light" | "dark";

const STORAGE_KEY = "kk_theme";
const PAGE_BG = { light: "#f0f0f0", dark: "#0a0a0a" } as const;

const root = document.documentElement;
const systemDark = window.matchMedia("(prefers-color-scheme: dark)");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function read(): ThemeMode {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === "light" || value === "dark" ? value : "system";
  } catch {
    return "system";
  }
}

function persist(mode: ThemeMode): void {
  try {
    if (mode === "system") localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // Storage can be unavailable (private mode, blocked site data). The choice then lasts for this page only.
  }
}

const resolve = (mode: ThemeMode): "light" | "dark" =>
  mode === "system" ? (systemDark.matches ? "dark" : "light") : mode;

function paint(mode: ThemeMode): void {
  if (mode === "system") root.removeAttribute("data-theme");
  else root.dataset.theme = mode;

  document.querySelectorAll<HTMLInputElement>('input[name="theme"]').forEach((input) => {
    input.checked = input.value === mode;
  });
  const dark = resolve(mode) === "dark";
  document.querySelectorAll<HTMLElement>("[data-theme-toggle]").forEach((button) => {
    button.setAttribute("aria-pressed", String(dark));
  });
  document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((meta) => {
    meta.dataset.system ??= meta.content;
    meta.content = mode === "system" ? (meta.dataset.system as string) : PAGE_BG[mode];
  });
}

/**
 * The new theme opens as a circle from the control that was used (a same-document view transition, see motion.css).
 * Without the API, or with reduced motion, it simply applies.
 */
function reveal(origin: Element | null, update: () => void): void {
  if (!origin || typeof document.startViewTransition !== "function" || reducedMotion.matches) {
    update();
    return;
  }
  const box = origin.getBoundingClientRect();
  const x = box.left + box.width / 2;
  const y = box.top + box.height / 2;
  root.style.setProperty("--kk-x", `${(x / window.innerWidth) * 100}%`);
  root.style.setProperty("--kk-y", `${(y / window.innerHeight) * 100}%`);
  root.style.setProperty(
    "--kk-r",
    `${Math.ceil(Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y)))}px`
  );
  root.dataset.vt = "theme";
  const transition = document.startViewTransition(update);
  void transition.finished.finally(() => {
    delete root.dataset.vt;
  });
}

function setTheme(mode: ThemeMode, origin: Element | null): void {
  persist(mode);
  reveal(origin, () => paint(mode));
}

export function initTheme(): void {
  paint(read());

  systemDark.addEventListener("change", () => {
    if (read() === "system") paint("system");
  });

  document.addEventListener("change", (event) => {
    const target = event.target;
    if (target instanceof HTMLInputElement && target.name === "theme") {
      setTheme(target.value as ThemeMode, target.closest(".seg__opt") ?? target);
    }
  });

  document.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target : null;
    const toggle = target?.closest("[data-theme-toggle]");
    if (toggle) setTheme(resolve(read()) === "dark" ? "light" : "dark", toggle);
  });
}
