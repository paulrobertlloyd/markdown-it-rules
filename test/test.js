const {describe} = require('mocha');
const testGenerator = require('markdown-it-testgen');

describe('@paulrobertlloyd/markdown-it-rules', () => {
  const md = require('markdown-it')({
    html: true,
  }).use(require('../index.js'));

  testGenerator('./test/fixtures/cite.txt', md);
  testGenerator('./test/fixtures/embed.txt', md);
});
