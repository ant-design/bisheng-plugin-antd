module.exports = function demoStyleScode(style, id) { // 给内联 css 加上 id 前缀
  return style
    .split('\n')
    .map(cssSelector => {
      return `#${id} ${cssSelector}`;
    })
    .join('\n');
};
