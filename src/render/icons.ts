export type IconName =
  | "work"
  | "stack"
  | "practice"
  | "message"
  | "resume"
  | "jump"
  | "theme"
  | "back"
  | "search";

/** Stroke icons on a 24 grid, drawn for this site. Always decorative: callers provide the text label. */
const PATHS: Record<IconName, string> = {
  work: '<rect x="3.5" y="3.5" width="7" height="7" rx="2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2"/><rect x="3.5" y="13.5" width="7" height="7" rx="2"/><rect x="13.5" y="13.5" width="7" height="7" rx="2"/>',
  stack:
    '<path d="M12 3.5 21 8l-9 4.5L3 8z"/><path d="m3 12.5 9 4.5 9-4.5"/><path d="m3 17 9 4.5 9-4.5"/>',
  practice: '<circle cx="12" cy="12" r="8.5"/><path d="m8.4 12.3 2.5 2.5 4.7-5.1"/>',
  message: '<path d="M20.5 3.5 10.2 13.8"/><path d="M20.5 3.5 14.3 20.5l-4.1-6.7-6.7-4.1z"/>',
  resume:
    '<path d="M7 3.5h7l4.5 4.5v11A1.5 1.5 0 0 1 17 20.5H7A1.5 1.5 0 0 1 5.5 19V5A1.5 1.5 0 0 1 7 3.5z"/><path d="M14 3.5V8h4.5"/><path d="M8.5 13h7M8.5 16.5h4.5"/>',
  jump: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>',
  theme: '<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5v17a8.5 8.5 0 0 0 0-17z" fill="currentColor"/>',
  back: '<path d="m14.5 5-7 7 7 7"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>'
};

export const icon = (name: IconName): string =>
  `<svg class="ico" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">${PATHS[name]}</svg>`;
