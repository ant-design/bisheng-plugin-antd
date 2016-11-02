'use strict';

const pkgPath = path.join(process.cwd(), 'package.json');
const pkgName = require(pkgPath).name;

const componentsPath = path.join(process.cwd(), 'components');
module.getPreview = function getPreview(sourceCode) {
  const preview = [
    'pre', { lang: '__react' },
  ];
  preview.push([
    'code',
    sourceCode.replace(`${pkgName}/lib`, componentsPath),
  ]);
  return preview;
};
