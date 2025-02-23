/** @typedef {import('markdown-it').default} MarkdownIt */
/** @typedef {import('markdown-it').Options} MarkdownItOptions */
/** @typedef {import('markdown-it/lib/token.mjs').default} Token */
/** @typedef {import('markdown-it/lib/renderer.mjs').default} Renderer */
/** @typedef {import('markdown-it/lib/rules_inline/state_inline.mjs').default} StateInline */

/**
 * Citation tokenizer
 * @param {StateInline} state - State
 * @param {boolean} silent - Silent
 * @returns {boolean} Tokenized
 */
function tokenize(state, silent) {
  let start = state.pos;
  let max = state.posMax;

  if (silent) {
    return false;
  }

  // Check for ""
  if (state.src.slice(start, start + 2) !== '""') {
    return false;
  }

  // Find closing ""
  let textStart = start + 2;
  let pos = textStart;
  let found = false;

  while (pos < max - 1) {
    if (state.src.slice(pos, pos + 2) === '""') {
      found = true;
      break;
    }
    pos++;
  }

  if (!found) {
    return false;
  }

  let textEnd = pos;

  // Save current state
  let oldMax = state.posMax;

  // Create opening token
  let token = state.push("cite_open", "cite", 1);
  token.markup = '""';

  // Set bounds and parse content
  state.posMax = textEnd;
  state.pos = textStart;
  state.md.inline.tokenize(state);

  // Create closing token
  token = state.push("cite_close", "cite", -1);
  token.markup = '""';

  // Restore bounds and move position
  state.posMax = oldMax;
  state.pos = textEnd + 2;

  return true;
}

/**
 * Opening citation tag
 * @param {Token[]} tokens - State
 * @param {number} index - Index
 * @param {MarkdownItOptions} options - Options
 * @param {*} environment - Environment
 * @param {Renderer} self - Self
 * @returns {string} Opening citation tag
 */
function cite_open(tokens, index, options, environment, self) {
  return "<cite" + self.renderAttrs(tokens[index]) + ">";
}

/**
 * Citation
 * @param {MarkdownIt} md - markdown-it instance
 */
export function cite(md) {
  md.inline.ruler.before("text", "cite", tokenize);

  md.renderer.rules.cite_open = cite_open;
}
