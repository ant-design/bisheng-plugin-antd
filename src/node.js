const path = require('path');
const nodejieba = require('nodejieba');
const processDoc = require('./process-doc');
const processDemo = require('./process-demo');
const assert = require('assert');

module.exports = (markdownData, config) => {
  config = config || {};

  config.ext = config.ext || '.html';
  config.fileDir = config.fileDir || './';

  assert(config.iframeTemplate, 'iframeTemplate path is not defined!');
  assert(config.outputDir, 'outputDir path is not defined!');

  // 分词后的索引字符串
  const keywords = cut(getJsonmlString(markdownData.content));
  markdownData.keywords = keywords;

  const isDemo = /\/demo$/i.test(path.dirname(markdownData.meta.filename));
  if (isDemo) {
    return processDemo(markdownData, config);
  }

  return markdownData;
};


// 得到 md 的纯文本, 用来做分词的原素材
function getJsonmlString(jsonml) {
  let result = '';
  for (let i = 1; i < jsonml.length; i++) {
    if (Array.isArray(jsonml[i])) {
      result += getJsonmlString(jsonml[i]);
    } else if (typeof jsonml[i] === 'string') {
      result += jsonml[i] + ' ';
    }
  }
  return result;
}

// 分词
function cut(str) {
  let result = [];
  try {
    result = nodejieba.cut(str, true);
  } catch(err) {
    return '';
  }
  return result.join(' ').replace(/\s+/g, ' '); // 多个空格替换成一个空格
}
