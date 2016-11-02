'use strict';

const ts = require('typescript');
const utils = require('../utils');

module.exports = function watch(tsCode) {
  if (this.cacheable) {
    this.cacheable();
  }

  const es6Code = ts.transpileModule(tsCode, {
    compilerOptions: {
      jsx: 'preserve',
      target: 'es6'
    },
  }).outputText;
  const highlightedCode = {
    es6: Prism.highlight(es6Code, Prism.languages.jsx),
    ts: Prism.highlight(tsCode, Prism.languages.typescript),
  };
  const preview = utils.getPreview(es6Code);
  return 'module.exports = {\n' +
    `  highlightedCode: ${JSON.stringify(highlightedCode)},\n` +
    `  preview: ${JSON.stringify(preview)}` +
    '\n}';
}
