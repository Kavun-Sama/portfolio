import { $, $$ } from "./dom";

export function initNav(sectionIds: string[]): void {
  const nav = $("[data-nav]");
  const pill = $("[data-nav-pill]");
  if (!nav || !pill) return;

  const items = $$("[data-nav-item]", nav) as HTMLAnchorElement[];
  let active: HTMLElement | null = null;

  const move = (item: HTMLElement | null): void => {
    for (const node of items) node.classList.toggle("is-active", node === item);
    if (!item) {
      pill.style.opacity = "0";
      return;
    }
    pill.style.opacity = "1";
    pill.style.width = `${item.offsetWidth}px`;
    pill.style.transform = `translateX(${item.offsetLeft}px)`;
  };

  const sync = (): void => {
    const line = window.innerHeight * 0.42;
    let found: string | null = null;
    for (const id of sectionIds) {
      const section = document.getElementById(id);
      if (section && section.getBoundingClientRect().top <= line) found = id;
    }
    const item = found ? items.find((node) => node.dataset.navItem === found) ?? null : null;
    if (item !== active) {
      active = item;
      move(item);
    }
  };

  document.addEventListener("scroll", sync, { passive: true, capture: true });
  window.addEventListener("resize", () => move(active));
  window.setInterval(sync, 250);
  sync();
}
