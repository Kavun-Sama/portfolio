import { links } from "../data/projects";
import { esc } from "./html";
import { icon, type IconName } from "./icons";

export type Page = "home" | "resume";

type Item = {
  label: string;
  icon: IconName;
  href: string;
  /** Section id observed by the scroll spy. */
  spy?: string;
  /** Shown in the side rail only; the bottom bar has room for five items. */
  railOnly?: boolean;
  external?: boolean;
  prominent?: boolean;
  name?: string;
};

const link = (item: Item): string => {
  const cls = [
    "dock__item",
    item.prominent && "dock__item--prominent"
  ].filter(Boolean).join(" ");
  const attrs = [
    `href="${esc(item.href)}"`,
    item.spy && `data-spy="${esc(item.spy)}"`,
    item.external && 'target="_blank" rel="noopener"',
    item.name && `aria-label="${esc(item.name)}"`
  ].filter(Boolean).join(" ");
  return `<li class="dock__li${item.railOnly ? " dock__li--rail" : ""}"><a class="${cls}" ${attrs}><span class="dock__glyph">${icon(item.icon)}</span><span class="dock__label">${esc(item.label)}</span></a></li>`;
};

const message: Item = {
  label: "Message",
  icon: "message",
  href: links.telegram,
  external: true,
  prominent: true,
  name: "Message on Telegram"
};

const jump = `<li class="dock__li"><button class="dock__item" type="button" data-panel-open aria-haspopup="dialog" aria-keyshortcuts="Control+K Meta+K"><span class="dock__glyph">${icon("jump")}</span><span class="dock__label">Jump</span></button></li>`;

const dark = `<li class="dock__li dock__li--rail"><button class="dock__item" type="button" data-theme-toggle aria-pressed="false"><span class="dock__glyph">${icon("theme")}</span><span class="dock__label">Dark</span></button></li>`;

const sections: Record<Page, Item[]> = {
  home: [
    { label: "Work", icon: "work", href: "#work", spy: "work" },
    { label: "Stack", icon: "stack", href: "#stack", spy: "stack" },
    { label: "Practice", icon: "practice", href: "#practice", spy: "practice" }
  ],
  resume: [
    { label: "Portfolio", icon: "back", href: "/", name: "Back to the portfolio" },
    { label: "Stack", icon: "stack", href: "#stack", spy: "stack" },
    { label: "Work", icon: "work", href: "#work", spy: "work" },
    { label: "Practice", icon: "practice", href: "#practice", spy: "practice", railOnly: true }
  ]
};

const pageLink: Record<Page, Item[]> = {
  home: [{ label: "Résumé", icon: "resume", href: "/resume.html", railOnly: true, name: "Résumé, one page" }],
  resume: []
};

export function renderDock(page: Page): string {
  const brand =
    page === "home"
      ? `<a class="dock__brand" href="#top" aria-label="kkkavun, top of the page">kkkavun</a>`
      : `<a class="dock__brand" href="/" aria-label="kkkavun, portfolio home">kkkavun</a>`;

  return `<nav class="dock glass" aria-label="Primary" data-dock>
  ${brand}
  <ul class="dock__list">
    ${sections[page].map(link).join("\n    ")}
    ${link(message)}
    <li class="dock__sep" role="presentation"></li>
    ${pageLink[page].map(link).join("\n    ")}
    ${jump}
    ${dark}
  </ul>
</nav>`;
}
