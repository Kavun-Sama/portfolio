# kkkavun.pw

Personal portfolio. Three static pages (portfolio, résumé, 404), no framework: Vite + TypeScript, plain CSS custom properties, about 3 KB of gzipped JavaScript.

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
      theme.ts                          system / light / dark, persisted in localStorage
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
      glass.css                         the Liquid Glass material: nav rail / bar and jump panel
      motion.css                        view transitions, entrance, scroll-driven depth; all behind reduced-motion
      content.css                       hero, work plates, stack, notes, contact, footer
      document.css                      résumé layout and print styles

Content is rendered into the HTML at build time; the pages work without JavaScript except the theme control and the jump panel, which are hidden then.

## Design system

- Material: Liquid Glass is used for exactly two components, the navigation (side rail on wide screens, bottom bar on compact) and the jump panel. Everything in the content layer is opaque.
- Fallbacks: no `backdrop-filter`, `prefers-reduced-transparency` and `prefers-contrast: more` all resolve to solid surfaces. `prefers-reduced-motion` turns all of it off: the pill moves instantly, view transitions last 0.01 ms, nothing is scrubbed by scroll.
- Motion: a damped spring and a sheet curve (`--ease-spring`, `--ease-sheet`). The pill stretches over two items and settles; pages and theme changes open as a circle from the click (cross-document view transitions, Chrome/Edge 126+, Safari 18.2+); on scroll, parts come into focus and rise from below (scroll-driven animations, Chrome/Edge 115+, Safari 26; others get a one-time IntersectionObserver version). Only `transform`, `opacity` and `filter` move.
- Colour: zero chroma. Dark and light are separate ladders in `theme.css`, selected with `light-dark()`; `data-theme` on `<html>` forces one of them.
- Type: system font stack only (SF Pro where the OS provides it), body 17 px.
- Browser floor: `light-dark()` and `oklch()` are shipped as written (`build.cssTarget` in `vite.config.ts`), so Chrome 123, Safari 17.5 and Firefox 120 or newer.

## Deploy

Static output. Any host works:

    npm run build && npx serve dist
