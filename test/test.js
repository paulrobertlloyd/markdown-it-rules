import test from "node:test";
import markdownit from "markdown-it";
import testGenerator from "markdown-it-testgen";
import attrs from "markdown-it-attrs";
import rules from "../index.js";

// markdown-it-testgen expects Mocha to have set the following globals
globalThis.describe = test.describe;
globalThis.it = test.it;

describe("@paulrobertlloyd/markdown-it-rules", () => {
  const md = markdownit({
    html: true,
  });

  md.use(attrs);
  md.use(rules);

  testGenerator("./test/fixtures/cite.txt", md);
  testGenerator("./test/fixtures/link-embed.txt", md);
});
