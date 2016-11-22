## config

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