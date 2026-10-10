import { defineConfig, type Plugin } from "vite";
import { resolve } from "node:path";
import { renderFragments } from "./src/render";

/** Expands `<!-- @render name -->` markers into static HTML at build and dev time. */
const renderHtml = (): Plugin => ({
  name: "render-html",
  transformIndexHtml: { order: "pre", handler: renderFragments }
});

export default defineConfig({
  appType: "mpa",
  plugins: [renderHtml()],
  build: {
    target: "es2022",
    // Native light-dark() and oklch() are kept as authored; this is the support floor of the stylesheet.
    cssTarget: ["chrome123", "edge123", "firefox120", "safari17.5"],
    cssMinify: "lightningcss",
    minify: "esbuild",
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        resume: resolve(__dirname, "resume.html")
      }
    }
  },
  esbuild: {
    legalComments: "none"
  }
});
