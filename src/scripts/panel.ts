const PANEL_WIDTH = 640;

/** Case- and accent-insensitive, so "resume" finds "Résumé". */
const fold = (value: string): string => value.normalize("NFD").replace(/\p{M}+/gu, "").toLowerCase();
const PANEL_TOP = 0.12;

export function initPanel(): void {
  const dialog = document.querySelector<HTMLDialogElement>("[data-panel]");
  const input = dialog?.querySelector<HTMLInputElement>("[data-panel-input]");
  const empty = dialog?.querySelector<HTMLElement>("[data-panel-empty]");
  if (!dialog || !input || !empty || typeof dialog.showModal !== "function") return;

  const items = [...dialog.querySelectorAll<HTMLElement>("[data-search]")];
  const haystack = new Map(items.map((item) => [item, fold(item.dataset.search as string)]));
  const rows = (): HTMLElement[] =>
    items.filter((item) => !item.hidden).map((item) => item.firstElementChild as HTMLElement);

  const filter = (): void => {
    const terms = fold(input.value).split(/\s+/).filter(Boolean);
    let shown = 0;
    for (const item of items) {
      const hit = terms.every((term) => (haystack.get(item) as string).includes(term));
      item.hidden = !hit;
      if (hit) shown += 1;
    }
    empty.hidden = shown > 0;
  };

  /** The panel grows out of the control that opened it: transform-origin is that control's centre. */
  const originFrom = (opener: Element | null): void => {
    if (!opener) return;
    const box = opener.getBoundingClientRect();
    const width = Math.min(window.innerWidth - 24, PANEL_WIDTH);
    const left = (window.innerWidth - width) / 2;
    dialog.style.setProperty("--ox", `${box.left + box.width / 2 - left}px`);
    dialog.style.setProperty("--oy", `${box.top + box.height / 2 - window.innerHeight * PANEL_TOP}px`);
  };

  const open = (opener: Element | null): void => {
    if (dialog.open) return;
    originFrom(opener);
    input.value = "";
    filter();
    dialog.showModal();
    input.focus();
  };

  document.addEventListener("click", (event) => {
    const opener = event.target instanceof Element ? event.target.closest("[data-panel-open]") : null;
    if (opener) open(opener);
  });

  window.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      if (dialog.open) dialog.close();
      else open(document.querySelector("[data-panel-open]"));
    }
  });

  input.addEventListener("input", filter);

  dialog.addEventListener("keydown", (event) => {
    // A search field consumes Escape to clear itself, so the dialog's own cancel never fires from the input.
    if (event.key === "Escape") {
      event.preventDefault();
      dialog.close();
      return;
    }
    // The theme control is a radio group: the arrow keys belong to it.
    if (document.activeElement instanceof HTMLInputElement && document.activeElement.type === "radio") return;
    const list = rows();
    const index = list.indexOf(document.activeElement as HTMLElement);
    if (event.key === "ArrowDown") {
      event.preventDefault();
      list[Math.min(list.length - 1, index + 1)]?.focus();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (index <= 0) input.focus();
      else list[index - 1]?.focus();
    } else if (event.key === "Enter" && document.activeElement === input) {
      event.preventDefault();
      list[0]?.click();
    }
  });

  dialog.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;
    if (target === dialog || target.closest("[data-panel-close]")) {
      dialog.close();
      return;
    }
    if (target.closest(".panel__row")) dialog.close();
  });
}
