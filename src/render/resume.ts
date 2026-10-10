import { links, metaText, projects } from "../data/projects";
import { esc, externalLink } from "./html";
import { FOOTER_NOTE } from "./footer";
import { renderNotes } from "./practice";
import { legend, renderLanguages, renderSkillRows } from "./stack";

export const renderResumeHead = (): string => `<header class="doc-head" id="top">
  <h1 class="doc-head__title">kkkavun</h1>
  <p class="doc-head__lead">Backend and tooling engineer. Networking, reverse engineering, automation, and frontends that stay small.</p>
  <p class="doc-head__actions">${externalLink(links.telegram, "btn btn--primary", "Telegram")}${externalLink(links.github, "link", "GitHub")}</p>
</header>`;

export const renderResumeStack = (): string => `<section class="doc-section" id="stack" aria-labelledby="stack-title">
  <header class="doc-section__head">
    <h2 class="doc-section__title" id="stack-title">Stack</h2>
    ${legend}
  </header>
  ${renderSkillRows()}
  ${renderLanguages()}
</section>`;

const entry = (project: (typeof projects)[number]): string =>
  `<article class="entry"><p class="entry__head">${externalLink(project.url, "entry__name", project.name, `${project.name} on GitHub`)}<span class="entry__meta">${esc(metaText(project))}</span></p><p class="entry__body">${esc(project.resume)}</p></article>`;

export const renderResumeWork = (): string => `<section class="doc-section" id="work" aria-labelledby="work-title">
  <header class="doc-section__head">
    <h2 class="doc-section__title" id="work-title">Selected work</h2>
  </header>
  <div class="entries">${projects.map(entry).join("")}</div>
</section>`;

export const renderResumePractice = (): string => `<section class="doc-section" id="practice" aria-labelledby="practice-title">
  <header class="doc-section__head">
    <h2 class="doc-section__title" id="practice-title">How I work</h2>
  </header>
  ${renderNotes()}
</section>`;

export const renderResumeFoot = (): string => `<footer class="doc-foot">
  <p class="doc-foot__note">${FOOTER_NOTE}</p>
  ${externalLink(links.telegram, "link", "@kkkavun")}
</footer>`;
