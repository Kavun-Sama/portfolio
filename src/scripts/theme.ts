export type ThemeMode = "system" | "light" | "dark";

const STORAGE_KEY = "kk_theme";
const PAGE_BG = { light: "#f0f0f0", dark: "#0a0a0a" } as const;

const root = document.documentElement;
const systemDark = window.matchMedia("(prefers-color-scheme: dark)");

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

function setTheme(mode: ThemeMode): void {
  persist(mode);
  paint(mode);
}

export function initTheme(): void {
  paint(read());

  systemDark.addEventListener("change", () => {
    if (read() === "system") paint("system");
  });

  document.addEventListener("change", (event) => {
    const target = event.target;
    if (target instanceof HTMLInputElement && target.name === "theme") setTheme(target.value as ThemeMode);
  });

  document.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (target?.closest("[data-theme-toggle]")) {
      setTheme(resolve(read()) === "dark" ? "light" : "dark");
    }
  });
}
