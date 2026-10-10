import { practice } from "../data/projects";
import { esc } from "./html";

export const renderNotes = (): string =>
  `<ul class="notes">${practice.map((note) => `<li class="notes__item">${esc(note)}</li>`).join("")}</ul>`;

export const renderPractice = (): string => `<section class="section" id="practice" aria-labelledby="practice-title">
  <header class="section__head">
    <h2 class="section__title" id="practice-title">How I work</h2>
  </header>
  ${renderNotes()}
</section>`;
