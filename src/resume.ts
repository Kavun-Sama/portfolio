import { $, el, escapeHtml } from "./lib/dom";
import { projects, skills } from "./data/projects";
import { initBlooms } from "./lib/blooms";
import { initTransitions } from "./lib/transitions";

function renderStack(): void {
  const list = $("[data-stack-list]");
  if (!list) return;
  for (const skill of skills) {
    list.append(
      el("div", `list__item${skill.core ? "" : " list__item--soft"}`, `
        <p class="list__title"><span class="dot ${skill.core ? "dot--solid" : "dot--hollow"}"></span>${escapeHtml(skill.title)}</p>
        <p class="list__body">${escapeHtml(skill.body)}</p>`)
    );
  }
}

function renderProjects(): void {
  const list = $("[data-project-list]");
  if (!list) return;
  for (const project of projects) {
    list.append(
      el("article", "entry", `
        <p class="entry__head"><a href="${project.url}" target="_blank" rel="noopener">${escapeHtml(project.name)} ↗</a><span class="muted">${escapeHtml(project.meta)}</span></p>
        <p class="entry__body">${escapeHtml(project.resume)}</p>`)
    );
  }
}

function stagger(): void {
  document.querySelectorAll<HTMLElement>("[data-stagger]").forEach((node, index) => {
    node.style.setProperty("--delay", `${200 + index * 90}ms`);
    node.classList.add("will-stagger");
    requestAnimationFrame(() => node.classList.add("is-revealed"));
    window.setTimeout(() => node.classList.add("is-revealed"), 80);
  });
}

renderStack();
renderProjects();
initTransitions();
initBlooms();
stagger();
