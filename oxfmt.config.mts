import { defineConfig } from "oxfmt";

// Matches the vendored Koharu theme style (verified with `oxfmt --check`).
export default defineConfig({
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: false,
  trailingComma: "all",
  endOfLine: "lf",
  ignorePatterns: ["dist/", ".astro/", ".devenv/", "public/", "node_modules/"],
});
