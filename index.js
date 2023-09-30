const cite = require('./lib/cite.js');
const linkEmbed = require('./lib/link-embed.js');

module.exports = function (md, pluginOptions = {}) {
  // Default plugin options
  const defaults = {
    classNameContainer: 'embed',
  };

  // Merge options
  const options = {...defaults, ...pluginOptions};

  // Cite
  md.core.ruler.before('inline', 'cite', state => cite(state));

  // Embed
  md.core.ruler.before('linkify', 'link_embed', state => linkEmbed(state, options));
};
