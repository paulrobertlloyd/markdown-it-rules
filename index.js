import { cite } from "./lib/cite.js";
import { linkEmbed } from "./lib/link-embed.js";

/**
 * @import MarkdownIt from "markdown-it"
 */

/**
 * @typedef {ReturnType<typeof MarkdownIt>} MarkdownItInstance
 */

/**
 * @typedef {object} PluginOptions
 * @property {string} [classNameContainer="embed"] - Class name for embed container
 */

/**
 * Markdown rules
 * @param {MarkdownItInstance} md - markdown-it instance
 * @param {PluginOptions} [pluginOptions] - Plugin options
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
  md.use(cite);

  // Embed
  md.use(linkEmbed, options);
}
