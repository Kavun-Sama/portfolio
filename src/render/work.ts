import { projects, metaText, type Fact, type Project } from "../data/projects";
import { esc, externalLink } from "./html";

/** Numerals and ranges get display size; words ("Adaptive", "AES-256-GCM") stay at text size. */
const isNumeric = (value: string): boolean => /^[≈\d.,–\s-]+$/.test(value);

const spec = (fact: Fact): string => {
  const kind = isNumeric(fact.value) ? "num" : "word";
  const unit = fact.unit ? `<span class="spec__unit"> ${esc(fact.unit)}</span>` : "";
  return `<div class="spec spec--${kind}"><dt class="spec__label">${esc(fact.label)}</dt><dd class="spec__value"><span class="spec__figure">${esc(fact.value)}</span>${unit}</dd></div>`;
};

const lead = (project: Project): string =>
  esc(project.lead).replace("{hl}", `<strong class="plate__hl">${esc(project.highlight)}</strong>`);

const plate = (project: Project): string => {
  const live = project.live
    ? externalLink(project.live.url, "link", "Open live site", `Open live site: ${project.live.label}`)
    : "";
  return `<li class="plate-item">
    <article class="plate" id="${esc(project.slug)}" aria-labelledby="${esc(project.slug)}-title">
      <p class="plate__meta"><span class="plate__n">${esc(project.n)}</span><span class="plate__kind">${esc(project.kind)}</span><span class="plate__tech">${esc(metaText(project))}</span></p>
      <h3 class="plate__title" id="${esc(project.slug)}-title">${esc(project.title)}</h3>
      <p class="plate__lead">${lead(project)}</p>
      <dl class="specs">${project.facts.map(spec).join("")}</dl>
      <p class="plate__links">${externalLink(project.url, "link", "Open on GitHub", `Open ${project.name} on GitHub`)}${live}</p>
    </article>
  </li>`;
};

export const renderWork = (): string => `<section class="section" id="work" aria-labelledby="work-title">
  <header class="section__head">
    <h2 class="section__title" id="work-title">Selected work</h2>
    <p class="section__lead">Four tools built end to end — networking, crawling, audio tooling, and a static frontend at catalog scale.</p>
  </header>
  <ol class="plates">
    ${projects.map(plate).join("\n    ")}
  </ol>
</section>`;
