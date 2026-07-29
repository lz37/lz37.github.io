import { defineConfig } from "oxlint";

// Vendored Koharu theme code dominates the repo; keep categories close to
// upstream defaults so theme updates don't create lint churn.
export default defineConfig({
  plugins: ["typescript", "react", "unicorn", "oxc"],
  categories: {
    correctness: "error",
    suspicious: "warn",
  },
  env: {
    browser: true,
    node: true,
  },
  settings: {
    react: {
      version: "19.0.0",
    },
  },
  rules: {
    // React 19 automatic JSX runtime — importing React is unnecessary.
    "react/react-in-jsx-scope": "off",
    // Component/render props (react-tweet `components`, ErrorBoundary
    // `fallbackRender`) are idiomatic React, not render-loop definitions.
    "react/no-unstable-nested-components": ["warn", { allowAsProps: true }],
    // Vendor globals and internal flags that intentionally dangle.
    "no-underscore-dangle": [
      "warn",
      { allow: ["_umami", "__CPEmbed", "__raw", "_hasSimilarityData"] },
    ],
  },
  ignorePatterns: ["dist/", ".astro/", ".devenv/", "public/", "node_modules/", "src/env.d.ts"],
});
