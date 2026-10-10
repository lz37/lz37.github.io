/**
 * Remark plugin that restores unknown text directives as literal text.
 *
 * remark-directive turns any `:name` in prose into a `textDirective` node. The site's
 * only intentional directive is the `:::encrypted` container (see remark-encrypted-directive),
 * so a single-colon `:name` is almost always accidental — a Chinese sentence like
 * "第四坑:SukiSU 的版本号…" or "一、让游戏跑起来:umu-launcher + Proton". Left alone,
 * mdast-util-to-hast drops the directive body and renders an empty <div>, which silently
 * eats the following words (30 occurrences in one published post before this fix).
 *
 * Runs after remark-encrypted-directive so the encrypted container keeps its handling.
 */
import type { PhrasingContent, Root, Text } from "mdast";
import { visit } from "unist-util-visit";

/** Flatten phrasing content back to its literal source text. */
function literalOf(children: PhrasingContent[] | undefined): string {
  if (!children?.length) return "";
  return children
    .map((child) => {
      if (child.type === "text") return (child as Text).value;
      if ("value" in child && typeof child.value === "string") return child.value;
      if ("children" in child) return literalOf(child.children as PhrasingContent[]);
      return "";
    })
    .join("");
}

export function remarkRestoreTextDirective() {
  return (tree: Root) => {
    visit(tree, "textDirective", (node, index, parent) => {
      if (index === undefined || !parent || !("children" in parent)) return;

      const attributes = node.attributes ?? {};
      const attrText = Object.entries(attributes)
        .filter(([, value]) => value !== undefined)
        .map(([key, value]) => (value === null || value === "" ? key : `${key}=${value}`))
        .join(" ");
      const label = literalOf(node.children);

      // Rebuild the original `:name[label]{attrs}` source and put it back as plain text.
      const value = `:${node.name}${label ? `[${label}]` : ""}${attrText ? `{${attrText}}` : ""}`;
      parent.children[index] = { type: "text", value };
    });
  };
}
