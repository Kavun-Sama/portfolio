/** Marks the dock item whose section crosses the middle of the viewport. */
export function initSpy(): void {
  const items = [...document.querySelectorAll<HTMLElement>("[data-spy]")];
  if (!items.length || !("IntersectionObserver" in window)) return;

  const sections = items
    .map((item) => document.getElementById(item.dataset.spy as string))
    .filter((section): section is HTMLElement => section !== null);

  const mark = (id: string | null): void => {
    for (const item of items) {
      if (item.dataset.spy === id) item.setAttribute("aria-current", "location");
      else item.removeAttribute("aria-current");
    }
  };

  const visible = new Set<string>();
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target.id);
        else visible.delete(entry.target.id);
      }
      const current = sections.find((section) => visible.has(section.id));
      mark(current ? current.id : null);
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((section) => observer.observe(section));
}
