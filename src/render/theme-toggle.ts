import { icon } from "./icons";

/**
 * The round light / dark switch in the top-right corner. theme.ts owns `aria-pressed` (true while the page is dark),
 * so the name stays constant and the state is announced by the control, not by its label.
 */
export const renderThemeToggle = (): string =>
  `<button class="theme-btn glass" type="button" data-theme-toggle aria-pressed="false" aria-label="Dark theme"><span class="theme-btn__glyph">${icon("theme")}</span></button>`;
