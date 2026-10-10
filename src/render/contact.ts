import { links } from "../data/projects";
import { esc } from "./html";

type Row = { label: string; value: string; href: string; external: boolean };

const rows: Row[] = [
  { label: "Telegram", value: "@kkkavun", href: links.telegram, external: true },
  { label: "GitHub", value: "Kavun-Sama", href: links.github, external: true },
  { label: "Résumé", value: "Stack in full, six shipped projects, and how I work.", href: "/resume.html", external: false }
];

const row = ({ label, value, href, external }: Row): string => {
  const ext = external ? ' target="_blank" rel="noopener"' : "";
  const mark = external ? " ↗" : " ›";
  return `<li><a class="contact__row" href="${esc(href)}"${ext}><span class="contact__label">${esc(label)}</span><span class="contact__value">${esc(value)}</span><span class="contact__mark" aria-hidden="true">${mark}</span></a></li>`;
};

export const renderContact = (): string => `<section class="section section--contact" id="contact" aria-labelledby="contact-title">
  <header class="section__head">
    <h2 class="section__title" id="contact-title">Got something stubborn to build?</h2>
    <p class="section__lead">Tunnels, scrapers, bots, reverse engineering, or a frontend that has to stay fast. Tell me what is in the way.</p>
  </header>
  <ul class="contact">${rows.map(row).join("")}</ul>
</section>`;
