const processDemo = require('../src/process-demo');

const mdContent = {
  meta: {
    title: '配置自定义颜色',
    order: 2,
    iframe: true,
    width: 990,
    filename: 'test.md'
  },
  content: [
    'article',
    ['p', '演示 ice-css-improver 的 colors 定制功能。'],
    [
      'pre',
      {lang: 'jsx'},
      [
        'code',
        'import React, { Component } from \'react\';\nimport ReactDOM from \'react-dom\';\nimport {\n  Button,\n  Table,\n} from \'@ali/ice\';\n\nimport Improver from \'@ali/ice-css-improver\';\n\n@Improver.enableColor\nclass App extends Component {\n\n  render() {\n\n    return (\n      <div>\n        <h2>Button 组件</h2>\n        <div>\n          <Button type="primary">确定</Button>\n          <Button type="secondary">次要按钮</Button>\n          <Button type="normal">普通按钮</Button>\n          <Button type="normal" disabled>普通按钮(失效)</Button>\n        </div>\n        <div style={{marginTop: 10}}>\n          <Button color="blue" className="custom-className" type="primary">确定</Button>\n          <Button color="blue" type="secondary">次要按钮</Button>\n          <Button color="blue" type="normal">普通按钮</Button>\n          <Button color="blue" type="normal" disabled>普通按钮(失效)</Button>\n        </div>\n        <div style={{marginTop: 10}}>\n          <Button color="red" type="primary">确定</Button>\n          <Button color="red" type="secondary">次要按钮</Button>\n          <Button color="red" type="normal">普通按钮</Button>\n          <Button color="red" type="normal" disabled>普通按钮(失效)</Button>\n        </div>\n        <div style={{marginTop: 10}}>\n          <Button color="green" type="primary">确定</Button>\n          <Button color="green" type="secondary">次要按钮</Button>\n          <Button color="green" type="normal">普通按钮</Button>\n          <Button color="green" type="normal" disabled>普通按钮(失效)</Button>\n        </div>\n        <div style={{marginTop: 10}}>\n          <Button color="orange" type="primary">确定</Button>\n          <Button color="orange" type="secondary">次要按钮</Button>\n          <Button color="orange" type="normal">普通按钮</Button>\n          <Button color="orange" type="normal" disabled>普通按钮(失效)</Button>\n        </div>\n        <div style={{marginTop: 10}}>\n          <Button color="roseo" type="primary">确定</Button>\n          <Button color="roseo" type="secondary">次要按钮</Button>\n          <Button color="roseo" type="normal">普通按钮</Button>\n          <Button color="roseo" type="normal" disabled>普通按钮(失效)</Button>\n        </div>\n        <h2>Table 组件</h2>\n        <div style={{overflow: \'hidden\'}}>\n          <div style={{width: \'24%\', float: \'left\'}}>\n            <Table dataSource={tableData} isZebra={true}>\n              <Table.Column title="Id" dataIndex="id"/>\n              <Table.Column title="Title" dataIndex="title.name" />\n            </Table>\n          </div>\n          <div style={{width: \'24%\', float: \'left\', marginLeft: \'1%\'}}>\n            <Table color="blue" dataSource={tableData} isZebra={true}>\n              <Table.Column title="Id" dataIndex="id"/>\n              <Table.Column title="Title" dataIndex="title.name" />\n            </Table>\n          </div>\n          <div style={{width: \'24%\', float: \'left\', marginLeft: \'1%\'}}>\n            <Table color="red" dataSource={tableData} isZebra={true}>\n              <Table.Column title="Id" dataIndex="id"/>\n              <Table.Column title="Title" dataIndex="title.name" />\n            </Table>\n          </div>\n          <div style={{width: \'24%\', float: \'left\', marginLeft: \'1%\'}}>\n            <Table color="green" dataSource={tableData} isZebra={true}>\n              <Table.Column title="Id" dataIndex="id"/>\n              <Table.Column title="Title" dataIndex="title.name" />\n            </Table>\n          </div>\n          <div style={{width: \'24%\', float: \'left\'}}>\n            <Table color="orange" dataSource={tableData} isZebra={true}>\n              <Table.Column title="Id" dataIndex="id"/>\n              <Table.Column title="Title" dataIndex="title.name" />\n            </Table>\n          </div>\n          <div style={{width: \'24%\', float: \'left\', marginLeft: \'1%\'}}>\n            <Table color="roseo" dataSource={tableData} isZebra={true}>\n              <Table.Column title="Id" dataIndex="id"/>\n              <Table.Column title="Title" dataIndex="title.name" />\n            </Table>\n          </div>\n        </div>\n      </div>\n    );\n  }\n}\n\n\n\nconst tableData = [{"title":{"name":"Quotation for 1PCS Nano 3.0 controller compatible"},"id":100306660940,"time":2000},{"title":{"name":"Quotation for 1PCS Nano 4.0 controller compatible"},"id":100306660941,"time":2001},{"title":{"name":"Quotation for 1PCS Nano 5.0 controller compatible"},"id":100306660942,"time":2002}];\n\nReactDOM.render(<App />, mountNode);'
      ]
    ]
  ]
};

describe('process-demo', function() {
  it('support-decorator ', function(done) {
    const actual = processDemo(mdContent, {
      iframeTemplate: './test/views/template.html',
      ext: '.html',
      fileDir: 'abc',
      outputDir: './test/tmp'
    });
    done();
  });
});
