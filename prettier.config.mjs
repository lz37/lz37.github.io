// .astro formatting only — everything else in the repo is handled by oxfmt.
// Shared by the prettier CLI (lint-staged) and astro-ls (LSP formatting).
export default {
  printWidth: 100,
  plugins: ["prettier-plugin-astro"],
};
