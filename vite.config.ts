/// <reference types="vitest" />
import path from "path";
import { defineConfig } from "vite";
import vituum from "vituum";
import twig from "@vituum/vite-plugin-twig";

const fileName = {
  es: `uswds.mjs`,
  cjs: `uswds.cjs`,
  iife: `uswds.iife.js`,
};

const formats = Object.keys(fileName) as Array<keyof typeof fileName>;

export default defineConfig({
  base: "./",
  plugins: [vituum(), twig()],
  build: {
    outDir: "./dist",
    lib: {
      entry: path.resolve(__dirname, "package/uswds-core/src/js/index.ts"),
      name: "USWDS",
      formats,
      fileName: (format) => fileName[format],
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
    clearMocks: true,
  },
});
