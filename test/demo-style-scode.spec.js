const cleanCSS = require('../src/utils/clean-css');
const demoStyleScope = require('../src/utils/demo-style-scope');
const assert = require('assert');

describe('demo-style-scope', function() {
  const css = `
    /* comment */
    .ice-layout {
      color: #fff;
      text-align: center;
      margin-bottom: 50px;
      background-color: #eee;
    }
    .ice-layout-header1,
    .ice-layout-header {
      line-height: 50px;
      background-color: rgba(27, 115, 225, 0.5);
    }
    `;
  it('work', function() {
    const cleanStyleSource = cleanCSS.minify(css);
    const withScode = demoStyleScope(cleanStyleSource.styles, 'hello');
    const expected =
`#hello .ice-layout{color:#fff;text-align:center;margin-bottom:50px;background-color:#eee}
#hello .ice-layout-header,
#hello .ice-layout-header1{line-height:50px;background-color:rgba(27,115,225,.5)}`;
    assert.deepEqual(withScode, expected);
  });
});
