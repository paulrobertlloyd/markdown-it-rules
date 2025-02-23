/** @typedef {import('markdown-it').default} MarkdownIt */
/** @typedef {import('markdown-it').Options} MarkdownItOptions */
/** @typedef {import('markdown-it/lib/token.mjs').default} Token */
/** @typedef {import('markdown-it/lib/renderer.mjs').default} Renderer */
/** @typedef {import('markdown-it/lib/rules_core/state_core.mjs').default} StateCore */
/** @typedef {import('markdown-it/lib/rules_inline/state_inline.mjs').default} StateInline */

/**
 * Citation core ruler
 * @param {StateInline} state - State
 * @param {boolean} silent - Silent
 * @returns {boolean} Tokenized
 */
function inlineRuler(state, silent) {
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
 * Citation inline ruler
 * @param {StateCore} state - State
 */
function coreRuler(state) {
  for (const token of state.tokens) {
    if (token.type !== "inline") continue;

    let tokens = token.children;
    let counter = 0;

    while (counter < tokens.length) {
      let token = tokens[counter];

      if (token.type === "text" && token.content.includes('""')) {
        let start = token.content.indexOf('""');
        if (start === -1) {
          counter++;
          continue;
        }

        let end = token.content.indexOf('""', start + 2);
        if (end === -1) {
          counter++;
          continue;
        }

        // Text before citation
        if (start > 0) {
          let beforeToken = new state.Token("text", "", 0);
          beforeToken.content = token.content.slice(0, start);
          tokens.splice(counter++, 0, beforeToken);
        }

        // Citation tokens
        let openToken = new state.Token("cite_open", "cite", 1);
        openToken.markup = '""';
        tokens.splice(counter++, 0, openToken);

        let contentToken = new state.Token("text", "", 0);
        contentToken.content = token.content.slice(start + 2, end);
        tokens.splice(counter++, 0, contentToken);

        let closeToken = new state.Token("cite_close", "cite", -1);
        closeToken.markup = '""';
        tokens.splice(counter++, 0, closeToken);

        // Create new token for remaining text and process in the next iteration
        if (end + 2 < token.content.length) {
          let remainingToken = new state.Token("text", "", 0);
          remainingToken.content = token.content.slice(end + 2);
          tokens.splice(counter, 1, remainingToken);
        } else {
          tokens.splice(counter, 1);
        }
      } else {
        counter++;
      }
    }
  }
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
  md.core.ruler.after("inline", "cite", coreRuler);
  md.inline.ruler.before("text", "cite", inlineRuler);

  md.renderer.rules.cite_open = cite_open;
}
