const hostname = require('./utils/hostname.js');

const YOUTUBE_URL = /(?:youtube(?:-nocookie)?\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)(?<id>[\w-]{11})/;

module.exports = function (state, options = {}) {
  // Iterate over all tokens, except the first and last
  for (let i = 1; i < state.tokens.length - 1; i += 1) {
    const token = state.tokens[i];

    // Check if we have a link
    if (token.type !== 'inline') {
      continue;
    }

    if (token.children.length !== 3) {
      continue;
    }

    if (token.children[0].type !== 'link_open') {
      continue;
    }

    const linkOpen = token.children[0];
    const linkClose = token.children[2];

    // Check we have a video link
    // TODO: Support more embed providers
    const href = linkOpen.attrGet('href');
    if (!href.includes('youtube.com') && !href.includes('vimeo.com')) {
      continue;
    }

    // Check if we have a custom image
    let thumbnailSrc;
    if (token.children[1].type === 'image') {
      thumbnailSrc = token.children[1].attrGet('src');
    }

    // Add attributes to link
    linkOpen.attrPush(['rel', 'noreferrer noopener']);
    linkOpen.attrPush(['target', '_blank']);

    // YouTube ID
    let id;
    const match = YOUTUBE_URL.exec(href);
    if (match?.groups) {
      id = match.groups.id;
      thumbnailSrc = thumbnailSrc || `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
    }

    // Create paragraph element
    const paraOpen = new state.Token('paragraph', 'p', 1);
    const paraClose = new state.Token('paragraph', 'p', -1);

    // Create host element
    const hostOpen = new state.Token('span', 'span', 1);
    const hostText = new state.Token('text', '', 0);
    hostText.content = `Watch on ${hostname(href)} (opens in a new tab)`;
    const hostClose = new state.Token('span', 'span', -1);

    // Create link text
    const newText = new state.Token('text', '', 0);
    newText.content = token.children[1].content;

    // Create a new line
    const newline = new state.Token('newline', 'br', 0);

    // Update token list
    token.children = [linkOpen, paraOpen, newText, newline, hostOpen, hostText, hostClose, paraClose, linkClose];

    if (thumbnailSrc) {
      const thumbnail = new state.Token('image', 'img', 0);
      thumbnail.attrs = [
        ['src', thumbnailSrc],
        ['alt', ''],
        ['loading', 'lazy'],
      ];

      if (thumbnailSrc.startsWith('http')) {
        thumbnail.attrSet('eleventy:ignore', true)
      }

      thumbnail.children = [];

      // Insert thumbnail into token list
      token.children.splice(1, 0, thumbnail);
    }

    // Check this is the only item in the paragraph
    const open = state.tokens[i - 1];
    const close = state.tokens[i + 1];
    if (open.type !== 'paragraph_open') {
      continue;
    }

    if (close.type !== 'paragraph_close') {
      continue;
    }

    // Mutate open/close to become a figure, not a paragraph
    open.type = 'figure_open';
    open.tag = 'figure';
    close.type = 'figure_close';
    close.tag = 'figure';

    // Add a class to the opening figure
    // TODO: If link within image, attributes not passed from parent node
    if (options.classNameContainer) {
      open.attrJoin('class', options.classNameContainer);
    }

    // Infer title as a figure caption
    const title = linkOpen.attrGet('title');
    if (title) {
      token.children.push(new state.Token('figcaption_open', 'figcaption', 1));

      const parsedTitle = state.md.parseInline(title, state.env);
      if (parsedTitle.length > 0) {
        token.children.push(...parsedTitle[0].children);
      }

      token.children.push(new state.Token('figcaption_close', 'figcaption', -1));
      linkOpen.attrs = linkOpen.attrs.filter(([attr]) => attr !== 'title');
    }
  }
};
