'use strict';

const path = require('path');
const pkgPath = path.join(process.cwd(), 'package.json');
const pkgName = require(pkgPath).name;

const componentsPath = path.join(process.cwd(), 'components');
exports.getPreview = function getPreview(sourceCode) {
  const preview = [
    'pre', { lang: '__react' },
  ];
  preview.push([
    'code',
    sourceCode.replace(`${pkgName}/lib`, componentsPath),
  ]);
  return preview;
};
