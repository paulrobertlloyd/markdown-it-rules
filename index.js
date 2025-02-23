import { cite } from "./lib/cite.js";
import { linkEmbed } from "./lib/link-embed.js";

/** @typedef {import('markdown-it').default} MarkdownIt */
/** @typedef {import('markdown-it').Options} MarkdownItOptions */

/**
 * Markdown rules
 * @param {MarkdownIt} md - markdown-it instance
 * @param {MarkdownItOptions} [pluginOptions] - Plugin options
 */
// eslint-disable-next-line unicorn/no-anonymous-default-export
export default function (md, pluginOptions = {}) {
  // Default plugin options
  const defaults = {
    classNameContainer: "embed",
  };

  // Merge options
  const options = { ...defaults, ...pluginOptions };

  // Cite
  md.core.ruler.before("inline", "cite", (state) => cite(state));

  // Embed
  md.core.ruler.before("linkify", "link_embed", (state) =>
    linkEmbed(state, options),
  );
}
