/** Fired on `window` whenever the section in the middle of the viewport changes. `id` is null above the first section. */
export type SectionChange = CustomEvent<{ id: string | null }>;

const BAND = "-45% 0px -50% 0px";
/** After a click on a section link the smooth scroll passes other sections; they are ignored until it ends. */
const LOCK_FALLBACK_MS = 1400;

/** Marks the dock item whose section crosses the middle of the viewport and announces the change to the pill. */
export function initSpy(): void {
  const items = [...document.querySelectorAll<HTMLElement>("[data-spy]")];
  if (!items.length || !("IntersectionObserver" in window)) return;

  const sections = items
    .map((item) => document.getElementById(item.dataset.spy as string))
    .filter((section): section is HTMLElement => section !== null)
    .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));

  let current: string | null | undefined;
  let lock: string | null = null;
  let unlock = 0;

  const mark = (id: string | null): void => {
    if (id === current) return;
    current = id;
    for (const item of items) {
      if (item.dataset.spy === id) item.setAttribute("aria-current", "location");
      else item.removeAttribute("aria-current");
    }
    window.dispatchEvent(new CustomEvent("kk:section", { detail: { id } }));
  };

  const visible = new Set<string>();
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target.id);
        else visible.delete(entry.target.id);
      }
      if (lock) return;
      const hit = sections.find((section) => visible.has(section.id));
      if (hit) return mark(hit.id);
      // Between sections, and below the last one, the previous section stays current. Only above the first one
      // (the hero) is there no current section, and the pill rests on the brand mark.
      const first = sections[0];
      if (first && first.getBoundingClientRect().top > window.innerHeight * 0.5) mark(null);
    },
    { rootMargin: BAND }
  );
  sections.forEach((section) => observer.observe(section));

  const release = (): void => {
    if (!lock) return;
    lock = null;
    window.clearTimeout(unlock);
    const hit = sections.find((section) => visible.has(section.id));
    if (hit) mark(hit.id);
  };

  // Clicking Work, Stack or Practice moves the pill straight to that item instead of hopping over the sections
  // the smooth scroll passes on the way. Any manual scroll input hands control back to the observer.
  document.addEventListener("click", (event) => {
    const link = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-spy]") : null;
    if (!link || !link.dataset.spy) return;
    lock = link.dataset.spy;
    mark(lock);
    window.clearTimeout(unlock);
    unlock = window.setTimeout(release, LOCK_FALLBACK_MS);
  });
  window.addEventListener("scrollend", release);
  for (const type of ["wheel", "touchstart", "keydown"] as const) {
    window.addEventListener(type, release, { passive: true });
  }
}
