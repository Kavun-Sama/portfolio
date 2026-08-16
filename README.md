# kkkavun.pw

Personal portfolio. Two pages, no framework — Vite + TypeScript, plain DOM modules, CSS custom properties.

## Commands

    npm install
    npm run dev        # dev server with HMR
    npm run build      # type-check + production build into dist/
    npm run preview    # serve the production build
    npm run lint       # type-check only

Production output is minified and stripped of comments (`esbuild.legalComments: "none"`, `cssMinify: lightningcss`).

## Layout

    index.html            portfolio shell
    resume.html           resume shell
    src/main.ts           portfolio entry — wires the modules
    src/resume.ts         resume entry
    src/data/projects.ts  the four projects + palette targets (single source of truth)
    src/lib/
      blooms.ts           pointer/scroll parallax for the background lights
      comeback.ts         "welcome back" sheet, GIF slot, tab-title nagging
      nav.ts              sliding pill that tracks the active section
      palette.ts          Cmd/Ctrl+K quick jump
      reveal.ts           scroll reveal (rect-based, survives throttled rAF)
      transitions.ts      circular page transition shared by both pages
      dom.ts              tiny query/element helpers
    src/styles/
      tokens.css          colors, radii, spacing, easing
      base.css            resets, typography, hidden scrollbars
      components.css      nav, cards, palette, sheet, resume

## Deploy

Static output. Any host works:

    npm run build && npx serve dist
