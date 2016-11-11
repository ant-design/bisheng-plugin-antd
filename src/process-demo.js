const fs = require('fs');
const path = require('path');
const JsonML = require('jsonml.js/lib/utils');
// 这里获取的是运行目录的 package.json

const template = require('lodash.template');

const babel = require('babel-core');
const babelrc = {
  sourceMaps: 'inline',
  presets: ['es2015', 'react'].map((m) => {
    return require.resolve(`babel-preset-${m}`);
  }),
};

function isStyleTag(node) {
  return node && JsonML.getTagName(node) === 'style';
}

function getCode(node) {
  return JsonML.getChildren(
    JsonML.getChildren(node)[0]
  )[0];
}

let tmplCache = null;

module.exports = (markdownData, config) => {

  if (!tmplCache) {
    const templatePath = path.join(process.cwd(), config.iframeTemplate);
    tmplCache = fs.readFileSync(templatePath).toString();
  }

  const meta = markdownData.meta;
  meta.id = meta.filename.replace(/\.md$/, '').replace(/\//g, '-');

  const contentChildren = JsonML.getChildren(markdownData.content);

  const codeIndex = contentChildren.findIndex((node) => {
    return JsonML.getTagName(node) === 'pre' &&
      JsonML.getAttributes(node).lang === 'jsx';
  });

  markdownData.content = contentChildren.slice(0, codeIndex);
  markdownData.highlightedCode = contentChildren[codeIndex].slice(0, 2);

  const preview = [
    'pre', { lang: '__react' },
  ];

  const rawCode = getCode(contentChildren[codeIndex]);

  preview.push([
    'code',
    rawCode
  ]);

  markdownData.rawCode = rawCode;
  markdownData.preview = preview;

  const styleNode = contentChildren.filter((node) => {
    return isStyleTag(node) ||
      (JsonML.getTagName(node) === 'pre' &&
        JsonML.getAttributes(node).lang === 'css');
  })[0];

  if (isStyleTag(styleNode)) {
    markdownData.style = JsonML.getChildren(styleNode)[0];
  } else if (styleNode) {
    const styleTag = contentChildren.filter(isStyleTag)[0];
    markdownData.style =
      getCode(styleNode) +
      (styleTag ? JsonML.getChildren(styleTag)[0] : '');
    markdownData.highlightedStyle =
      JsonML.getAttributes(styleNode).highlighted;
  }

  if (meta.iframe) {

    const babelTransform = babel.transform(
      getCode(markdownData.preview),
      babelrc
    );

    const html = template(tmplCache)({
      title: meta.title,
      id: meta.id,
      style: markdownData.style,
      script: babelTransform.code,
      map: babelTransform.map
    });

    const fileName = `demo-${meta.id}.html`;
    fs.writeFile(path.join(process.cwd(), '_site', fileName), html);
    markdownData.src = path.join('/', fileName);
  }

  return markdownData;
};
