const {describe} = require('mocha');
const testGenerator = require('markdown-it-testgen');

describe('@paulrobertlloyd/markdown-it-rules', () => {
  const md = require('markdown-it')().use(require('../index.js'));

  testGenerator('./test/fixtures/embed.txt', md);
});
