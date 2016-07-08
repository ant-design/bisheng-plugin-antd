'use strict';

var path = require('path');
var processDoc = require('./process-doc');
var processDemo = require('./process-demo');

module.exports = function (markdownData) {
  var isDemo = /\/demo$/i.test(path.dirname(markdownData.meta.filename));
  if (isDemo) {
    return processDemo(markdownData);
  }
  return markdownData;
};