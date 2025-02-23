/** @typedef {import('markdown-it/lib/rules_core/state_core.mjs').default} StateCore */

/**
 * Citation
 * @param {StateCore} state - State
 * @returns {StateCore} State
 */
export function cite(state) {
  for (const token of state.tokens) {
    token.content = token.content.replaceAll(/""(.*?)""/g, "<cite>$1</cite>");
  }

  return state;
}
