import { links } from "../data/projects";
import { externalLink } from "./html";

export const renderHero = (): string => `<header class="hero" id="top">
  <p class="status"><span class="status__dot" aria-hidden="true"></span>Open for work · Python, Rust, Go</p>
  <h1 class="hero__title">Things that were supposed to be closed</h1>
  <p class="hero__lead">I'm kkkavun. I take apart mobile apps down to the native layer, walk crawlers past Cloudflare, and carry TCP through what looks like a video call. When a platform says no, that's usually where the work starts.</p>
  <p class="hero__actions">${externalLink(links.telegram, "btn btn--primary", "Message on Telegram")}<a class="link" href="#work">See the work</a></p>
</header>`;
