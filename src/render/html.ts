const ESCAPES: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" };

export const esc = (value: string): string => value.replace(/[&<>"]/g, (char) => ESCAPES[char] as string);

/** Link that opens in a new tab. `name` replaces the accessible name when the visible label is ambiguous out of context. */
export const externalLink = (href: string, className: string, label: string, name?: string): string => {
  const aria = name ? ` aria-label="${esc(name)}"` : "";
  return `<a class="${className}" href="${esc(href)}" target="_blank" rel="noopener"${aria}>${esc(label)}<span aria-hidden="true"> ↗</span></a>`;
};
