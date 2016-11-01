const fs = require('fs');
const path = require('path');
const JsonML = require('jsonml.js/lib/utils');
const pkgPath = path.join(process.cwd(), 'package.json');
const pkgName = require(pkgPath).name;

const nunjucks = require('nunjucks');
nunjucks.configure({ autoescape: false });

const babel = require('babel-core');
const babelrc = {
  presets: ['es2015', 'react'].map(m =>
     require.resolve(`babel-preset-${m}`)
  ),
};

const tmpl = fs.readFileSync(path.join(__dirname, 'template.html')).toString();

function isStyleTag(node) {
  return node && JsonML.getTagName(node) === 'style';
}

function getCode(node) {
  return JsonML.getChildren(
    JsonML.getChildren(node)[0]
  )[0];
}

function getChineseIntroStart(contentChildren) {
  return contentChildren.findIndex(node =>
     JsonML.getTagName(node) === 'h2' &&
      JsonML.getChildren(node)[0] === 'zh-CN'
  );
}

function getEnglishIntroStart(contentChildren) {
  return contentChildren.findIndex(node =>
     JsonML.getTagName(node) === 'h2' &&
      JsonML.getChildren(node)[0] === 'en-US'
  );
}

function getCodeIndex(contentChildren) {
  return contentChildren.findIndex(node =>
     JsonML.getTagName(node) === 'pre' &&
      JsonML.getAttributes(node).lang === 'jsx'
  );
}

function getHighlightedCode(contentChildren, codeIndex) {
  return contentChildren[codeIndex].slice(0, 2);
}

const componentsPath = path.join(process.cwd(), 'components');
function getPreview(contentChildren, codeIndex) {
  const preview = [
    'pre', { lang: '__react' },
  ];
  preview.push([
    'code',
    getCode(contentChildren[codeIndex])
      .replace(`${pkgName}/lib`, componentsPath),
  ]);
  return preview;
}

function getStyleNode(contentChildren) {
  return contentChildren.filter(node =>
     isStyleTag(node) ||
      (JsonML.getTagName(node) === 'pre' && JsonML.getAttributes(node).lang === 'css')
  )[0];
}

module.exports = (markdownData, isBuild) => {
  const meta = markdownData.meta;
  meta.id = meta.filename.replace(/\.md$/, '').replace(/\//g, '-');
  // Should throw debugging demo while publish.
  if (isBuild && meta.debug) {
    return { meta: {} };
  }

  // Update content of demo.
  const contentChildren = JsonML.getChildren(markdownData.content);
  const chineseIntroStart = getChineseIntroStart(contentChildren);
  const englishIntroStart = getEnglishIntroStart(contentChildren);
  const codeIndex = getCodeIndex(contentChildren);
  const introEnd = codeIndex === -1 ? contentChildren.length : codeIndex;
  if (chineseIntroStart > -1 /* equal to englishIntroStart > -1 */) {
    markdownData.content = {
      'zh-CN': contentChildren.slice(chineseIntroStart + 1, englishIntroStart),
      'en-US': contentChildren.slice(englishIntroStart + 1, introEnd),
    };
  } else {
    markdownData.content = contentChildren.slice(0, introEnd);
  }

  markdownData.highlightedCode = getHighlightedCode(contentChildren, codeIndex);
  markdownData.preview = getPreview(contentChildren, codeIndex);

  // Add style node to markdown data.
  const styleNode = getStyleNode(contentChildren);
  if (isStyleTag(styleNode)) {
    markdownData.style = JsonML.getChildren(styleNode)[0];
  } else if (styleNode) {
    const styleTag = contentChildren.filter(isStyleTag)[0];
    markdownData.style = getCode(styleNode) + (styleTag ? JsonML.getChildren(styleTag)[0] : '');
    markdownData.highlightedStyle = JsonML.getAttributes(styleNode).highlighted;
  }

  if (meta.iframe) {
    const html = nunjucks.renderString(tmpl, {
      id: meta.id,
      style: markdownData.style,
      script: babel.transform(getCode(markdownData.preview), babelrc).code,
    });
    const fileName = `demo-${Math.random()}.html`;
    fs.writeFile(path.join(process.cwd(), '_site', fileName), html);
    markdownData.src = path.join('/', fileName);
  }

  return markdownData;
};
