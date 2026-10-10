const options = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" }
] as const;

/**
 * The System / Light / Dark control. Each instance needs its own radio `name`: in one document a shared name would
 * make the page footer and the jump panel a single group. theme.ts finds the inputs by `data-theme-mode`.
 */
export const renderThemeControl = (name: string, modifier = ""): string => `<fieldset class="seg${modifier ? ` ${modifier}` : ""}" data-theme-group>
    <legend class="sr-only">Theme</legend>
    ${options
      .map(
        (o) =>
          `<label class="seg__opt"><input class="seg__input" type="radio" name="${name}" value="${o.value}" data-theme-mode${o.value === "system" ? " checked" : ""}><span class="seg__face">${o.label}</span></label>`
      )
      .join("\n    ")}
  </fieldset>`;
