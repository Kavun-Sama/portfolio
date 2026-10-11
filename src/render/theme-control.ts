const options = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" }
] as const;

/**
 * The System / Light / Dark control. It is the only place that can return to "System"; the round button in the
 * corner (theme-toggle.ts) flips between light and dark. theme.ts finds the inputs by `data-theme-mode`.
 */
export const renderThemeControl = (name: string): string => `<fieldset class="seg" data-theme-group>
    <legend class="sr-only">Theme</legend>
    ${options
      .map(
        (o) =>
          `<label class="seg__opt"><input class="seg__input" type="radio" name="${name}" value="${o.value}" data-theme-mode${o.value === "system" ? " checked" : ""}><span class="seg__face">${o.label}</span></label>`
      )
      .join("\n    ")}
  </fieldset>`;
