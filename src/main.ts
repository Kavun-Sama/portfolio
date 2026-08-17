import { $, el, escapeHtml } from "./lib/dom";
import { links, projects, skills } from "./data/projects";
import { initBlooms } from "./lib/blooms";
import { initComeback } from "./lib/comeback";
import { initNav } from "./lib/nav";
import { initPalette, type Command } from "./lib/palette";
import { initReveal } from "./lib/reveal";
import { initTransitions } from "./lib/transitions";

function renderProjects(): void {
  const grid = $("[data-project-grid]");
  if (!grid) return;
  for (const project of projects) {
    const lead = escapeHtml(project.lead).replace(
      "{hl}",
      `<b>${escapeHtml(project.highlight)}</b>`
    );
    const facts = project.facts.map((fact) => `<span class="tag">${escapeHtml(fact)}</span>`).join("");
    const card = el("a", "card", `
      <p class="card__meta"><span class="badge badge--accent">${project.n} · ${escapeHtml(project.name)}</span><span class="muted">${escapeHtml(project.meta)}</span></p>
      <h3 class="card__title">${escapeHtml(project.title)}</h3>
      <p class="card__lead">${lead}</p>
      <div class="tags">${facts}</div>
      <span class="card__link">Open on GitHub ↗</span>`);
    card.setAttribute("href", project.url);
    card.setAttribute("target", "_blank");
    card.setAttribute("rel", "noopener");
    card.setAttribute("data-reveal", "");
    grid.append(card);
  }
}

function renderSkills(): void {
  const grid = $("[data-stack-grid]");
  if (!grid) return;
  for (const skill of skills) {
    const tile = el("article", `tile${skill.core ? "" : " tile--soft"}`, `
      <h3 class="tile__title"><span class="dot ${skill.core ? "dot--solid" : "dot--hollow"}"></span>${escapeHtml(skill.title)}</h3>
      <p class="tile__body">${escapeHtml(skill.body)}</p>`);
    tile.setAttribute("data-reveal", "");
    grid.append(tile);
  }
}

function commands(): Command[] {
  const jump = (id: string) => () => {
    document.getElementById(id)?.scrollIntoView({ block: "start", behavior: "smooth" });
  };
  const open = (url: string) => () => window.open(url, "_blank", "noopener");
  return [
    { label: "Work", hint: "section", run: jump("work") },
    { label: "Stack", hint: "section", run: jump("stack") },
    { label: "Contact", hint: "section", run: jump("contact") },
    { label: "Résumé", hint: "page", run: () => $<HTMLAnchorElement>(".cta")?.click() },
    ...projects.map((project) => ({
      label: project.name,
      hint: `repo · ${project.meta.split(" · ")[0]}`,
      run: open(project.url)
    })),
    { label: "Telegram", hint: "@kkkavun", run: open(links.telegram) },
    { label: "GitHub profile", hint: "Kavun-Sama", run: open(links.github) },
    { label: "Live site", hint: "try.kkkavun.pw", run: open(links.live) }
  ];
}

renderProjects();
renderSkills();
initTransitions();
initBlooms();
initReveal();
initNav(["work", "stack", "contact"]);
const palette = initPalette(commands());
initComeback({ onShow: palette.close });
