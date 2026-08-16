import { $, el, escapeHtml } from "./dom";

export type Command = { label: string; hint: string; run: () => void };

export function initPalette(commands: Command[]): void {
  const root = $("[data-palette]");
  const card = $("[data-palette-card]");
  const input = $<HTMLInputElement>("[data-palette-input]");
  const list = $("[data-palette-list]");
  const opener = $("[data-palette-open]");
  if (!root || !card || !input || !list) return;

  let open = false;
  let selected = 0;
  let matches = commands;

  const render = (): void => {
    const query = input.value.trim().toLowerCase();
    matches = query
      ? commands.filter((cmd) => `${cmd.label} ${cmd.hint}`.toLowerCase().includes(query))
      : commands;
    selected = Math.min(selected, Math.max(0, matches.length - 1));
    list.innerHTML = "";
    if (!matches.length) {
      list.append(el("p", "palette__empty", "Nothing matches that."));
      return;
    }
    matches.forEach((cmd, index) => {
      const row = el(
        "button",
        `palette__row${index === selected ? " is-selected" : ""}`,
        `<span>${escapeHtml(cmd.label)}</span><span class="muted">${escapeHtml(cmd.hint)}</span>`
      );
      row.addEventListener("mouseenter", () => { selected = index; render(); });
      row.addEventListener("click", () => { close(); cmd.run(); });
      list.append(row);
    });
  };

  const show = (): void => {
    open = true;
    root.removeAttribute("hidden");
    requestAnimationFrame(() => root.classList.add("is-open"));
    input.value = "";
    selected = 0;
    render();
    window.setTimeout(() => input.focus(), 60);
  };

  const close = (): void => {
    open = false;
    root.classList.remove("is-open");
    window.setTimeout(() => root.setAttribute("hidden", ""), 320);
  };

  opener?.addEventListener("click", show);
  root.addEventListener("click", (event) => { if (event.target === root) close(); });
  input.addEventListener("input", render);

  window.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();
    if (key === "k" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      open ? close() : show();
      return;
    }
    if (!open) return;
    if (key === "escape") { event.preventDefault(); close(); }
    if (key === "arrowdown") { event.preventDefault(); selected = Math.min(matches.length - 1, selected + 1); render(); }
    if (key === "arrowup") { event.preventDefault(); selected = Math.max(0, selected - 1); render(); }
    if (key === "enter") {
      event.preventDefault();
      const cmd = matches[selected];
      if (cmd) { close(); cmd.run(); }
    }
  });
}
