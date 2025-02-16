import {describe} from 'mocha';
import markdownit from 'markdown-it'
import testGenerator from 'markdown-it-testgen';
import rules from '../index.js';

describe('@paulrobertlloyd/markdown-it-rules', () => {
  const md = markdownit({
    html: true,
  })

  md.use(rules);

  testGenerator('./test/fixtures/cite.txt', md);
  testGenerator('./test/fixtures/embed.txt', md);
});
