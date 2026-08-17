import { $, el, escapeHtml } from "./dom";

export type Command = { label: string; hint: string; run: () => void };

/** Lets whoever composes the page dismiss the palette when another surface takes over. */
export type Palette = { close: () => void };

const noop: Palette = { close: () => {} };

export function initPalette(commands: Command[]): Palette {
  const root = $("[data-palette]");
  const card = $("[data-palette-card]");
  const input = $<HTMLInputElement>("[data-palette-input]");
  const list = $("[data-palette-list]");
  const opener = $("[data-palette-open]");
  if (!root || !card || !input || !list) return noop;

  let open = false;
  let selected = 0;
  let matches = commands;
  let rows: HTMLElement[] = [];

  // Highlighting is a class swap on the existing nodes, never a rebuild:
  // replacing the row between mousedown and mouseup would leave the two
  // events on different elements, and the browser then fires click on the
  // common ancestor instead of the row.
  const paint = (follow = false): void => {
    rows.forEach((row, index) => row.classList.toggle("is-selected", index === selected));
    if (follow) rows[selected]?.scrollIntoView({ block: "nearest" });
  };

  const build = (): void => {
    const query = input.value.trim().toLowerCase();
    matches = query
      ? commands.filter((cmd) => `${cmd.label} ${cmd.hint}`.toLowerCase().includes(query))
      : commands;
    selected = Math.min(selected, Math.max(0, matches.length - 1));

    list.innerHTML = "";
    rows = [];
    if (!matches.length) {
      list.append(el("p", "palette__empty", "Nothing matches that."));
      return;
    }

    matches.forEach((cmd, index) => {
      const row = el(
        "button",
        "palette__row",
        `<span>${escapeHtml(cmd.label)}</span><span class="muted">${escapeHtml(cmd.hint)}</span>`
      );
      row.addEventListener("mouseenter", () => { selected = index; paint(); });
      row.addEventListener("click", () => { close(); cmd.run(); });
      rows.push(row);
      list.append(row);
    });
    paint();
  };

  const show = (): void => {
    open = true;
    root.removeAttribute("hidden");
    requestAnimationFrame(() => root.classList.add("is-open"));
    input.value = "";
    selected = 0;
    build();
    window.setTimeout(() => input.focus(), 60);
  };

  const close = (): void => {
    open = false;
    root.classList.remove("is-open");
    window.setTimeout(() => root.setAttribute("hidden", ""), 320);
  };

  opener?.addEventListener("click", show);
  root.addEventListener("click", (event) => { if (event.target === root) close(); });
  input.addEventListener("input", build);

  window.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();
    if (key === "k" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      open ? close() : show();
      return;
    }
    if (!open) return;
    if (key === "escape") { event.preventDefault(); close(); }
    if (key === "arrowdown") { event.preventDefault(); selected = Math.min(matches.length - 1, selected + 1); paint(true); }
    if (key === "arrowup") { event.preventDefault(); selected = Math.max(0, selected - 1); paint(true); }
    if (key === "enter") {
      event.preventDefault();
      const cmd = matches[selected];
      if (cmd) { close(); cmd.run(); }
    }
  });

  return { close: () => { if (open) close(); } };
}
