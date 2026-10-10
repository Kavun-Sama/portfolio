const options = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" }
];

export const FOOTER_NOTE = "Available for tooling, networking and reverse-engineering work";

const theme = `<fieldset class="seg" data-theme-group>
    <legend class="seg__legend">Theme</legend>
    ${options
      .map(
        (o) =>
          `<label class="seg__opt"><input class="seg__input" type="radio" name="theme" value="${o.value}"${o.value === "system" ? " checked" : ""}><span class="seg__face">${o.label}</span></label>`
      )
      .join("\n    ")}
  </fieldset>`;

export const renderFooter = (): string => `<footer class="foot">
  <p class="foot__note">${FOOTER_NOTE}</p>
  ${theme}
</footer>`;
