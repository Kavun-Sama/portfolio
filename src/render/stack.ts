import { languages, skills, type Skill } from "../data/projects";
import { esc } from "./html";

const level = (core: boolean): string =>
  `<span class="level level--${core ? "core" : "known"}" role="img" aria-label="${core ? "Daily driver" : "Working knowledge"}"></span>`;

export const legend = `<p class="legend"><span class="level level--core" aria-hidden="true"></span>Daily driver<span class="level level--known" aria-hidden="true"></span>Working knowledge</p>`;

const row = (skill: Skill): string =>
  `<li class="row${skill.core ? "" : " row--soft"}"><h3 class="row__title">${level(skill.core)}${esc(skill.title)}</h3><p class="row__body">${esc(skill.body)}</p></li>`;

const langs = (): string =>
  languages
    .map(
      (lang) =>
        `<li class="langs__item${lang.core ? "" : " langs__item--soft"}">${esc(lang.name)}${lang.core ? "" : '<span class="sr-only"> (working knowledge)</span>'}</li>`
    )
    .join("");

export const renderLanguages = (): string =>
  `<div class="langs"><h3 class="langs__label">Languages</h3><ul class="langs__list">${langs()}</ul></div>`;

export const renderSkillRows = (): string => `<ul class="rows">${skills.map(row).join("")}</ul>`;

export const renderStack = (): string => `<section class="section" id="stack" aria-labelledby="stack-title">
  <header class="section__head">
    <h2 class="section__title" id="stack-title">Stack</h2>
    <p class="section__lead">Point me at something weird.</p>
    ${legend}
  </header>
  ${renderSkillRows()}
  ${renderLanguages()}
</section>`;
