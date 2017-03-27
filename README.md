## bisheng-plugin-ice

[![](https://img.shields.io/travis/noyobo/bisheng-plugin-ice.svg)](https://travis-ci.org/noyobo/bisheng-plugin-ice) [![Codecov](https://img.shields.io/codecov/c/github/noyobo/bisheng-plugin-ice/master.svg)](https://codecov.io/gh/noyobo/bisheng-plugin-ice/branch/master) [![npm package](https://img.shields.io/npm/v/bisheng-plugin-ice.svg)](https://www.npmjs.org/package/bisheng-plugin-ice) [![NPM downloads](http://img.shields.io/npm/dm/bisheng-plugin-ice.svg)](https://npmjs.org/package/bisheng-plugin-ice) 

- **iframeTemplate** `required` Demo 的 iframe 的模板 使用 <lodash.template> 语法

接收的数据:

```
const html = template(tmpl)({
  title: meta.title,
  id: meta.id,
  style: markdownData.style,
  script: babelTransform.code,
  map: babelTransform.map,
  ensure: ensure
});
```

- ensure `string`
当前 demo 模板的组件依赖, e.g: `'["react", "react-dom", "@ali/ice"]'`