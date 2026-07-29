import type { Configuration } from "lint-staged";

const CODE = /\.[cm]?[jt]sx?$/;
const TYPE_AWARE = /\.[cm]?tsx?$/;
const ASTRO = /\.astro$/;
const FMT_ONLY = /\.(json|ya?ml|mdx?|css)$/;

// Quote each path so filenames with spaces survive shell execution.
const quote = (files: string[]): string => files.map((file) => `"${file}"`).join(" ");

const config: Configuration = (files: string[]): string[] => {
  const commands: string[] = [];
  const code = files.filter((file) => CODE.test(file));
  const astro = files.filter((file) => ASTRO.test(file));
  const fmtOnly = files.filter((file) => FMT_ONLY.test(file));
  if (code.length > 0) {
    commands.push(`oxfmt ${quote(code)}`);
    commands.push(`oxlint --fix ${quote(code)}`);
  }
  if (astro.length > 0) {
    // oxfmt has no Astro support (2026-07); prettier-plugin-astro is the
    // only formatter, shared with astro-ls via prettier.config.mjs.
    commands.push(`prettier --write ${quote(astro)}`);
    commands.push(`oxlint --fix ${quote(astro)}`);
  }
  if (fmtOnly.length > 0) {
    commands.push(`oxfmt ${quote(fmtOnly)}`);
  }
  // Project-wide type gate, only when TS-family files are staged.
  if (files.some((file) => TYPE_AWARE.test(file))) {
    commands.push("tsgo --noEmit");
  }
  return commands;
};

export default config;
