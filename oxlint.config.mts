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
  },
  ignorePatterns: ["dist/", ".astro/", ".devenv/", "public/", "node_modules/", "src/env.d.ts"],
});
