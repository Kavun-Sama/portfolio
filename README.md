# kkkavun.pw

Personal portfolio. Three static pages (portfolio, résumé, 404), no framework: Vite + TypeScript, plain CSS custom properties, about 5 KB of gzipped JavaScript per page.

## Commands

    npm install
    npm run dev        # dev server
    npm run build      # type-check + production build into dist/
    npm run preview    # serve the production build
    npm run lint       # type-check only

## Layout

    index.html, resume.html, 404.html   shells: head, meta, and `<!-- @render name -->` markers
    src/data/projects.ts                the six projects, stack, notes and links (single source of truth)
    src/render/                         pure functions that return HTML; expanded at build time by vite.config.ts
    src/scripts/
      app.ts                            entry shared by all pages, also imports the stylesheets
      theme.ts                          system / light / dark, persisted in localStorage; the round corner button flips light / dark
      spy.ts                            marks the nav item of the section in view, announces the change
      pill.ts                           the dock's selection pill: one element gliding between items (Web Animations API)
      transitions.ts                    click origin for page transitions; lets the pill land before the page leaves
      depth.ts                          scroll-depth fallback for browsers without scroll-driven animations
      panel.ts                          jump panel on a native <dialog> (Ctrl/Cmd+K)
      glass.ts                          pointer position for the glass highlight
      refraction.ts                     Chromium-only rim refraction (progressive enhancement)
    src/styles/
      theme.css                         tokens: grayscale OKLCH ladders, type scale, space, radii, motion
      foundation.css                    reset, focus ring, buttons, links
      glass.css                         the Liquid Glass material: nav rail / bar, jump panel and the round theme button
      motion.css                        view transitions, entrance, scroll-driven depth; all behind reduced-motion
      content.css                       hero, work plates, stack, notes, contact, footer
      document.css                      résumé layout and print styles

Content is rendered into the HTML at build time; the pages work without JavaScript except the theme button, the footer theme control and the jump panel, which are hidden then.

## Design system

- Material: Liquid Glass is used for exactly three components, the navigation (side rail on wide screens, bottom bar on compact), the jump panel and the round theme button fixed in the top-right corner. None sits on another; everything in the content layer is opaque.
- Fallbacks: no `backdrop-filter`, `prefers-reduced-transparency` and `prefers-contrast: more` all resolve to solid surfaces. `prefers-reduced-motion` turns all of it off: the pill moves instantly, view transitions last 0.01 ms, nothing is scrubbed by scroll.
- Motion: a damped spring and a sheet curve (`--ease-spring`, `--ease-sheet`). The pill stretches over two items and settles; pages (cross-document view transitions, Chrome/Edge 126+, Safari 18.2+) and theme changes (a same-document one) open as a circle from the click; on scroll, parts come into focus and rise from below (scroll-driven animations, Chrome/Edge 115+, Safari 26; others get a one-time IntersectionObserver version). Movement is `transform`, `opacity` and `filter`, plus `clip-path` for the circle; layout is never animated.
- Colour: zero chroma. Dark and light are separate ladders in `theme.css`, selected with `light-dark()`; `data-theme` on `<html>` forces one of them.
- Type: system font stack only (SF Pro where the OS provides it), body 17 px.
- Browser floor: `light-dark()` and `oklch()` are shipped as written (`build.cssTarget` in `vite.config.ts`), so Chrome 123, Safari 17.5 and Firefox 120 or newer.

## Deploy

Static output. Any host that serves the site from the domain root works (asset URLs are absolute):

    npm run build && npx serve dist

`404.html` is a page like the others: the host has to serve it for unknown paths (Netlify and GitHub Pages do it by name, Caddy needs `handle_errors`).
