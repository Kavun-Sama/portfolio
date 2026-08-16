import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  appType: "mpa",
  build: {
    target: "es2022",
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
