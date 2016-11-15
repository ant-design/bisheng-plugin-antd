const path = require('path');
const processDoc = require('./process-doc');
const processDemo = require('./process-demo');
const assert = require('assert');

module.exports = (markdownData, config) => {
  config = config || {};

  config.ext = config.ext || '.html';

  assert(config.iframeTemplate, 'iframeTemplate path is not defined!');
  assert(config.outputDir, 'outputDir path is not defined!');

  const isDemo = /\/demo$/i.test(path.dirname(markdownData.meta.filename));
  if (isDemo) {
    return processDemo(markdownData, config);
  }
  return markdownData;
};
