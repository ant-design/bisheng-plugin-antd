'use strict';

var JsonML = require('jsonml.js/lib/utils');

module.exports = function (markdownData) {
  var contentChildren = JsonML.getChildren(markdownData.content);
  var apiStartIndex = contentChildren.findIndex(function (node) {
    return JsonML.getTagName(node) === 'h2' && JsonML.getChildren(node)[0] === 'API';
  });

  if (apiStartIndex > -1) {
    var content = contentChildren.slice(0, apiStartIndex);
    markdownData.content = ['section'].concat(content);

    var api = contentChildren.slice(apiStartIndex);
    markdownData.api = ['section'].concat(api);
  }

  return markdownData;
};