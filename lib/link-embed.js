import { hostname } from "./utils/hostname.js";

const YOUTUBE_URL =
  /(?:youtube(?:-nocookie)?\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)(?<id>[\w-]{11})/;

/**
 * @import MarkdownIt, {
 *   StateCore,
 * } from "markdown-it"
 */

/**
 * @typedef {ReturnType<typeof MarkdownIt>} MarkdownItInstance
 */

/**
 * @typedef {object} PluginOptions
 * @property {string} [classNameContainer] - Class name for embed container
 */

/**
 * Link embed
 * @param {MarkdownItInstance} md - markdown-it instance
 * @param {PluginOptions} options - Plugin options
 */
export function linkEmbed(md, options) {
  /**
   * Citation inline ruler
   * @param {StateCore} state - State
   */
  function coreRuler(state) {
    // Iterate over all tokens, except the first and last
    for (let index = 1; index < state.tokens.length - 1; index += 1) {
      const token = state.tokens[index];

      // Check if we have a link
      if (token.type !== "inline") {
        continue;
      }

      const tokens = token.children;
      if (!tokens || tokens.length !== 3 || tokens[0].type !== "link_open") {
        continue;
      }

      const linkOpen = tokens[0];
      const linkClose = tokens[2];

      // Check we have a video link
      // TODO: Support more embed providers
      let href = linkOpen.attrGet("href");
      if (!href) {
        continue;
      }

      href = String(href);

      if (!href.includes("youtube.com") && !href.includes("vimeo.com")) {
        continue;
      }

      // Check if we have a custom image
      let thumbnailSource;
      if (tokens[1].type === "image") {
        thumbnailSource = tokens[1].attrGet("src");
      }

      // Add attributes to link
      linkOpen.attrPush(["rel", "noreferrer noopener"]);
      linkOpen.attrPush(["target", "_blank"]);

      // YouTube ID
      const match = YOUTUBE_URL.exec(href);
      if (match?.groups) {
        const id = match.groups.id;
        thumbnailSource ||= `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
      }

      // Create paragraph element
      const paraOpen = new state.Token("paragraph", "p", 1);
      const paraClose = new state.Token("paragraph", "p", -1);

      // Create host element
      const hostOpen = new state.Token("span", "span", 1);
      const hostText = new state.Token("text", "", 0);
      hostText.content = `Watch on ${hostname(href)} (opens in a new tab)`;
      const hostClose = new state.Token("span", "span", -1);

      // Create link text
      const newText = new state.Token("text", "", 0);
      newText.content = tokens[1].content;

      // Create a new line
      const newline = new state.Token("newline", "br", 0);

      // Update token list
      token.children = [
        linkOpen,
        paraOpen,
        newText,
        newline,
        hostOpen,
        hostText,
        hostClose,
        paraClose,
        linkClose,
      ];

      if (thumbnailSource) {
        thumbnailSource = String(thumbnailSource);
        const thumbnail = new state.Token("image", "img", 0);
        thumbnail.attrs = [
          ["src", thumbnailSource],
          ["alt", ""],
          ["loading", "lazy"],
        ];

        if (thumbnailSource.startsWith("http")) {
          thumbnail.attrSet("eleventy:ignore", "true");
        }

        thumbnail.children = [];

        // Insert thumbnail into token list
        token.children.splice(1, 0, thumbnail);
      }

      // Check this is the only item in the paragraph
      const open = state.tokens[index - 1];
      const close = state.tokens[index + 1];
      if (open.type !== "paragraph_open" || close.type !== "paragraph_close") {
        continue;
      }

      // Mutate open/close to become a figure, not a paragraph
      open.type = "figure_open";
      open.tag = "figure";
      close.type = "figure_close";
      close.tag = "figure";

      // Add a class to the opening figure
      // TODO: If link within image, attributes not passed from parent node
      if (options.classNameContainer) {
        open.attrJoin("class", options.classNameContainer);
      }

      // Infer title as a figure caption
      let title = linkOpen.attrGet("title");
      if (!title) {
        continue;
      }

      title = String(title);
      token.children.push(new state.Token("figcaption_open", "figcaption", 1));

      const parsedTitle = state.md.parseInline(title, state.env);

      const titleChildren = parsedTitle[0]?.children;
      if (titleChildren) {
        token.children.push(...titleChildren);
      }

      token.children.push(
        new state.Token("figcaption_close", "figcaption", -1),
      );

      if (linkOpen.attrs) {
        linkOpen.attrs = linkOpen.attrs.filter(
          ([attribute]) => attribute !== "title",
        );
      }
    }
  }

  md.core.ruler.before("linkify", "link_embed", coreRuler);
}
