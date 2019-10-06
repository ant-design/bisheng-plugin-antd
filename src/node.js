const path = require('path');
const processDoc = require('./process-doc');
const processDemo = require('./process-demo');

module.exports = (markdownData, {
  noPreview, babelConfig, pxtorem, injectProvider,
}, isBuild) => {
  const isDemo = /\/demo$/i.test(path.dirname(markdownData.meta.filename));
  if (isDemo) {
    return processDemo({
      markdownData,
      isBuild,
      noPreview,
      babelConfig: babelConfig && JSON.parse(babelConfig),
      pxtorem,
      injectProvider,
    });
  }
  return processDoc(markdownData);
};
