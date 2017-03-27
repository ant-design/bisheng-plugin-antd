const fs = require('fs');
const path = require('path');
const JsonML = require('jsonml.js/lib/utils');
// 这里获取的是运行目录的 package.json

const template = require('lodash.template');

const babel = require('babel-core');
const detective = require('detective-module');

const cleanCSS = require('./utils/clean-css');
const demoStyleScode = require('./utils/demo-style-scope');

const babelrc = {
  sourceMaps: 'inline',
  presets: ['es2015', 'react', 'stage-0'].map(m => {
    return require.resolve(`babel-preset-${m}`);
  })
};

function isStyleTag(node) {
  return node && JsonML.getTagName(node) === 'style';
}

function getCode(node) {
  return JsonML.getChildren(JsonML.getChildren(node)[0])[0];
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

  const codeIndex = contentChildren.findIndex(node => {
    return JsonML.getTagName(node) === 'pre' && JsonML.getAttributes(node).lang === 'jsx';
  });

  markdownData.content = contentChildren.slice(0, codeIndex); // 移除了 pre 的内容
  markdownData.highlightedCode = contentChildren[codeIndex].slice(0, 2);

  const preview = ['pre', { lang: '__react' }];

  const rawCode = getCode(contentChildren[codeIndex]);

  preview.push(['code', rawCode]);

  markdownData.rawCode = rawCode;
  markdownData.preview = preview;
  const styleNode = contentChildren.filter(node => {
    return isStyleTag(node) ||
      (JsonML.getTagName(node) === 'pre' && JsonML.getAttributes(node).lang === 'css');
  })[0];

  if (isStyleTag(styleNode)) {
    const styleSource = JsonML.getChildren(styleNode)[0];
    const cleanStyleSource = cleanCSS.minify(styleSource);

    markdownData.style = demoStyleScode(cleanStyleSource.styles, meta.id);
    markdownData.rawStyle = styleSource;
  } else if (styleNode) {
    const styleTag = contentChildren.filter(isStyleTag)[0];
    const cssSource = getCode(styleNode) + (styleTag ? JsonML.getChildren(styleTag)[0] : '');
    const cleanCssSource = cleanCSS.minify(cssSource);

    markdownData.style = demoStyleScode(cleanCssSource.styles, meta.id);
    markdownData.rawStyle = cssSource;
    markdownData.highlightedStyle = JsonML.getAttributes(styleNode).highlighted;
  }

  if (meta.iframe) {
    const previewCode = getCode(markdownData.preview);
    const moduleDeps = detective(previewCode);
    const babelTransform = babel.transform(previewCode, babelrc);

    const ensure = JSON.stringify(
      moduleDeps.map(function(dep) {
        return dep && dep.name;
      })
    );

    const html = template(tmplCache)({
      title: meta.title,
      id: meta.id,
      style: markdownData.style,
      script: babelTransform.code,
      map: babelTransform.map,
      ensure: ensure
    });

    const jsFileName = `${meta.id}${config.ext}`.toLowerCase();
    const cssFileName = `${meta.id}.css`.toLowerCase();

    if (markdownData.rawStyle) {
      // 生成 iframe css 文件。
      fs.writeFile(
        path.join(process.cwd(), config.outputDir, config.fileDir, cssFileName),
        markdownData.rawStyle
      );
      markdownData.cssLinkPath = path.join('/', config.fileDir, cssFileName);
    }

    fs.writeFile(path.join(process.cwd(), config.outputDir, config.fileDir, jsFileName), html);
    markdownData.src = path.join('/', config.fileDir, jsFileName);
  }
  return markdownData;
};
