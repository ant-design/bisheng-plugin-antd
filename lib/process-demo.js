'use strict';

var fs = require('fs');
var path = require('path');
var JsonML = require('jsonml.js/lib/utils');
var pkgPath = path.join(process.cwd(), 'package.json');
var pkgName = require(pkgPath).name;

var nunjucks = require('nunjucks');
nunjucks.configure({ autoescape: false });

var babel = require('babel-core');
var babelrc = {
  presets: ['es2015', 'react'].map(function (m) {
    return require.resolve('babel-preset-' + m);
  })
};

var tmpl = fs.readFileSync(path.join(__dirname, 'template.html')).toString();

function isStyleTag(node) {
  return node && JsonML.getTagName(node) === 'style';
}

function getCode(node) {
  return JsonML.getChildren(JsonML.getChildren(node)[0])[0];
}

module.exports = function (markdownData) {
  var meta = markdownData.meta;
  meta.id = meta.filename.replace(/\.md$/, '').replace(/\//g, '-');

  var contentChildren = JsonML.getChildren(markdownData.content);
  var chineseIntroStart = contentChildren.findIndex(function (node) {
    return JsonML.getTagName(node) === 'h2' && JsonML.getChildren(node)[0] === 'zh-CN';
  });
  var englishIntroStart = contentChildren.findIndex(function (node) {
    return JsonML.getTagName(node) === 'h2' && JsonML.getChildren(node)[0] === 'en-US';
  });
  var codeIndex = contentChildren.findIndex(function (node) {
    return JsonML.getTagName(node) === 'pre' && JsonML.getAttributes(node).lang === 'jsx';
  });
  if (chineseIntroStart > -1 /* equal to englishIntroStart > -1 */) {
      markdownData.content = {
        'zh-CN': contentChildren.slice(chineseIntroStart + 1, englishIntroStart),
        'en-US': contentChildren.slice(englishIntroStart + 1, codeIndex)
      };
    } else {
    markdownData.content = contentChildren.slice(0, codeIndex);
  }

  markdownData.highlightedCode = contentChildren[codeIndex].slice(0, 2);
  var preview = ['pre', { lang: '__react' }];
  var componentsPath = path.join(process.cwd(), 'components');
  preview.push(['code', getCode(contentChildren[codeIndex]).replace(pkgName + '/lib', componentsPath)]);
  markdownData.preview = preview;

  var styleNode = contentChildren.filter(function (node) {
    return isStyleTag(node) || JsonML.getTagName(node) === 'pre' && JsonML.getAttributes(node).lang === 'css';
  })[0];

  if (isStyleTag(styleNode)) {
    markdownData.style = JsonML.getChildren(styleNode)[0];
  } else if (styleNode) {
    var styleTag = contentChildren.filter(isStyleTag)[0];
    markdownData.style = getCode(styleNode) + (styleTag ? JsonML.getChildren(styleTag)[0] : '');
    markdownData.highlightedStyle = JsonML.getAttributes(styleNode).highlighted;
  }

  if (meta.iframe) {
    var html = nunjucks.renderString(tmpl, {
      id: meta.id,
      style: markdownData.style,
      script: babel.transform(getCode(markdownData.preview), babelrc).code
    });
    var fileName = 'demo-' + Math.random() + '.html';
    fs.writeFile(path.join(process.cwd(), '_site', fileName), html);
    markdownData.src = path.join('/', fileName);
  }

  return markdownData;
};