import { execFileSync } from "node:child_process";
import path from "node:path";
import { glob } from "astro/loaders";
import type { Loader } from "astro/loaders";

/**
 * git-derived publish/update dates for a content file, following renames.
 *
 * Returns ISO-8601 strings with the commit's recorded timezone offset
 * (e.g. "2023-04-25T15:44:18+08:00"), which the collection schema parses
 * with its offset intact — the same wall clock Hexo's
 * hexo-filter-date-from-git displayed.
 *
 * Returns undefined when the file has no usable history (untracked draft,
 * or not inside a git work tree); frontmatter dates are then required.
 */
function readGitDates(filePath: string): { date: string; updated?: string } | undefined {
  const relativePath = path.relative(process.cwd(), filePath);
  let output: string;
  try {
    output = execFileSync("git", ["log", "--follow", "--format=%aI", "--", relativePath], {
      encoding: "utf-8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return undefined;
  }
  if (!output) {
    return undefined;
  }
  const lines = output.split("\n");
  const newest = lines[0];
  const oldest = lines[lines.length - 1];
  if (!newest || !oldest) {
    return undefined;
  }
  // Single-commit file: an `updated` identical to `date` carries no signal.
  return { date: oldest, updated: newest === oldest ? undefined : newest };
}

/**
 * Wraps Astro's glob loader to resolve post dates from git history in
 * memory — files are never modified:
 * - `date`: explicit frontmatter wins; missing values fall back to the
 *   file's oldest commit.
 * - `updated`: the newest commit wins over frontmatter, so a stale
 *   hand-written value can never outlive a real edit; frontmatter is the
 *   fallback when the file has no git history.
 */
export function globWithGitDates(options: Parameters<typeof glob>[0]): Loader {
  const base = glob(options);
  return {
    ...base,
    async load(context) {
      const { parseData } = context;
      await base.load({
        ...context,
        parseData: async (entry) => {
          const { filePath } = entry;
          // Same object reference as entry.data; widened to a mutable record
          // because TData is generic and cannot be indexed for writing.
          const data = entry.data as Record<string, unknown>;
          if (filePath) {
            const dates = readGitDates(filePath);
            if (dates) {
              // date: frontmatter wins (publication identity); git is the fallback.
              if (data["date"] === undefined) {
                data["date"] = dates.date;
              }
              // updated: git history wins over frontmatter so edits never show a
              // stale hand-written value; frontmatter is the fallback when the
              // file has no git history (untracked draft, no work tree).
              if (dates.updated !== undefined) {
                data["updated"] = dates.updated;
              }
            }
          }
          return parseData(entry);
        },
      });
    },
  };
}
