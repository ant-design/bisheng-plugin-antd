'use strict';

const crypto = require('crypto');
const processor = crypto.createHash('md5');

module.exports = function watch(content) {
  if (this.cacheable) {
    this.cacheable();
  }
  return `'${processor.update(content).digets('hex')}'`;
}
