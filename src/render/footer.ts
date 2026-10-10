import { renderThemeControl } from "./theme-control";

export const FOOTER_NOTE = "Available for tooling, networking and reverse-engineering work";

export const renderFooter = (): string => `<footer class="foot">
  <p class="foot__note">${FOOTER_NOTE}</p>
  ${renderThemeControl("theme")}
</footer>`;
