import { execFileSync } from "node:child_process";
import path from "node:path";
import { glob } from "astro/loaders";
import type { Loader } from "astro/loaders";
import { categoryCovers } from "@constants/site-config";

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

// Case-insensitive lookup so stray English categories (`tech`) still hit CJK
// keys only when duplicated explicitly in site.yaml; same-key case variants match.
const COVER_BY_CATEGORY: Record<string, string> = Object.fromEntries(
  Object.entries(categoryCovers).map(([category, cover]) => [category.toLowerCase(), cover]),
);

/**
 * First category name of a post, unwrapping Hexo's nested form
 * (`categories: [[NAS, 家用]]` → `"NAS"`).
 */
function firstCategory(categories: unknown): string | undefined {
  if (!Array.isArray(categories) || categories.length === 0) {
    return undefined;
  }
  const first: unknown = categories[0];
  if (typeof first === "string") {
    return first;
  }
  if (Array.isArray(first) && typeof first[0] === "string") {
    return first[0];
  }
  return undefined;
}

/**
 * Wraps Astro's glob loader to resolve per-post defaults at content-load
 * time — files are never modified, and every downstream consumer (post
 * cards, OG image fallback, RSS) sees the injected values:
 * - `date`: explicit frontmatter wins; missing values fall back to the
 *   file's oldest commit.
 * - `updated`: the newest commit wins over frontmatter, so a stale
 *   hand-written value can never outlive a real edit; frontmatter is the
 *   fallback when the file has no git history.
 * - `cover`: explicit frontmatter wins; missing values fall back to the
 *   fixed cover of the post's first category (site.yaml `categoryCovers`,
 *   a port of Hexo's category_per_img). Posts outside the map keep
 *   `undefined` and the card component shuffles `defaultCoverList`.
 */
export function globWithPostDefaults(options: Parameters<typeof glob>[0]): Loader {
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
          if (data["cover"] === undefined) {
            const category = firstCategory(data["categories"]);
            const cover = category ? COVER_BY_CATEGORY[category.toLowerCase()] : undefined;
            if (cover !== undefined) {
              data["cover"] = cover;
            }
          }
          return parseData(entry);
        },
      });
    },
  };
}
