import { links, projects } from "../data/projects";
import { esc } from "./html";
import { icon } from "./icons";
import type { Page } from "./dock";
import { renderThemeControl } from "./theme-control";

interface Entry {
  label: string;
  hint: string;
  href: string;
  external?: boolean;
}

const sections = (page: Page): Entry[] =>
  page === "home"
    ? [
        { label: "Work", hint: "section", href: "#work" },
        { label: "Stack", hint: "section", href: "#stack" },
        { label: "How I work", hint: "section", href: "#practice" },
        { label: "Contact", hint: "section", href: "#contact" },
        { label: "Résumé", hint: "page", href: "/resume.html" }
      ]
    : [
        { label: "Portfolio", hint: "page", href: "/" },
        { label: "Stack", hint: "section", href: "#stack" },
        { label: "Work", hint: "section", href: "#work" },
        { label: "How I work", hint: "section", href: "#practice" }
      ];

const entries = (page: Page): Entry[] => [
  ...sections(page),
  ...projects.map((project): Entry => ({
    label: project.name,
    hint: `repo · ${project.stack}`,
    href: project.url,
    external: true
  })),
  { label: "Telegram", hint: "@kkkavun", href: links.telegram, external: true },
  { label: "GitHub profile", hint: "Kavun-Sama", href: links.github, external: true },
  { label: "Live site", hint: "try.kkkavun.pw", href: links.live, external: true }
];

const item = (entry: Entry): string => {
  const search = esc(`${entry.label} ${entry.hint}`.toLowerCase());
  const inner = `<span class="panel__label">${esc(entry.label)}</span><span class="panel__hint">${esc(entry.hint)}</span>`;
  const ext = entry.external ? ' target="_blank" rel="noopener"' : "";
  return `<li class="panel__item" data-search="${search}"><a class="panel__row" href="${esc(entry.href)}"${ext}>${inner}</a></li>`;
};

export const renderPalette = (page: Page): string => `<dialog class="panel" data-panel aria-labelledby="panel-title">
  <div class="panel__surface glass">
    <h2 class="sr-only" id="panel-title">Jump</h2>
    <div class="panel__field">
      ${icon("search")}
      <input class="panel__input" type="search" data-panel-input placeholder="Section, repo or contact" aria-label="Jump to a section, repo or contact" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="go">
      <button class="panel__close" type="button" data-panel-close>Close</button>
    </div>
    <ul class="panel__list" data-panel-list>
      ${entries(page).map(item).join("\n      ")}
    </ul>
    <p class="panel__empty" data-panel-empty hidden>Nothing matches that.</p>
    ${renderThemeControl("theme-panel", "seg--panel")}
  </div>
</dialog>`;
