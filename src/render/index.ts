import { renderContact } from "./contact";
import { renderDock } from "./dock";
import { renderFooter } from "./footer";
import { renderHero } from "./hero";
import { renderPalette } from "./palette";
import { renderPractice } from "./practice";
import {
  renderResumeFoot,
  renderResumeHead,
  renderResumePractice,
  renderResumeStack,
  renderResumeWork
} from "./resume";
import { renderStack } from "./stack";
import { renderWork } from "./work";

/** Fragments addressable from the HTML shells as `<!-- @render name -->`. */
export const fragments: Record<string, () => string> = {
  "dock-home": () => renderDock("home"),
  "dock-resume": () => renderDock("resume"),
  "palette-home": () => renderPalette("home"),
  "palette-resume": () => renderPalette("resume"),
  hero: renderHero,
  work: renderWork,
  stack: renderStack,
  practice: renderPractice,
  contact: renderContact,
  footer: renderFooter,
  "resume-head": renderResumeHead,
  "resume-stack": renderResumeStack,
  "resume-work": renderResumeWork,
  "resume-practice": renderResumePractice,
  "resume-foot": renderResumeFoot
};

const MARKER = /<!--\s*@render\s+([\w-]+)\s*-->/g;

/** Replaces every render marker; an unknown name fails the build instead of shipping an empty section. */
export function renderFragments(html: string): string {
  return html.replace(MARKER, (_marker, name: string) => {
    const render = fragments[name];
    if (!render) throw new Error(`Unknown render fragment: ${name}`);
    return render();
  });
}
