import type { Configuration } from "lint-staged";

const CODE = /\.[cm]?[jt]sx?$/;
const TYPE_AWARE = /\.[cm]?tsx?$/;
const JSON_FILE = /\.json$/;

// Quote each path so filenames with spaces survive shell execution.
const quote = (files: string[]): string => files.map((file) => `"${file}"`).join(" ");

const config: Configuration = (files: string[]): string[] => {
  const commands: string[] = [];
  const code = files.filter((file) => CODE.test(file));
  const json = files.filter((file) => JSON_FILE.test(file));
  if (code.length > 0) {
    commands.push(`oxfmt ${quote(code)}`);
    commands.push(`oxlint --fix ${quote(code)}`);
  }
  if (json.length > 0) {
    commands.push(`oxfmt ${quote(json)}`);
  }
  // Project-wide type gate, only when TS-family files are staged.
  if (files.some((file) => TYPE_AWARE.test(file))) {
    commands.push("tsgo --noEmit");
  }
  return commands;
};

export default config;
