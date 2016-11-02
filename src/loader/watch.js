'use strict';

module.exports = function watch() {
  if (this.cacheable) {
    this.cacheable();
  }
  return '';
}
