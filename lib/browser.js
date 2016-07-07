'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _jsonmlToReactComponent = require('jsonml-to-react-component');

var _jsonmlToReactComponent2 = _interopRequireDefault(_jsonmlToReactComponent);

var _utils = require('jsonml.js/lib/utils');

var _utils2 = _interopRequireDefault(_utils);

var _VideoPlayer = require('./VideoPlayer');

var _VideoPlayer2 = _interopRequireDefault(_VideoPlayer);

var _ImagePreview = require('./ImagePreview');

var _ImagePreview2 = _interopRequireDefault(_ImagePreview);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isHeading(node) {
  return (/h[1-6]/i.test(_utils2.default.getTagName(node))
  );
}

// export default doesn't work
module.exports = function () {
  return {
    converters: [[function (node) {
      return _utils2.default.isElement(node) && isHeading(node);
    }, function (node, index) {
      var children = _utils2.default.getChildren(node);
      var headingText = children[0];
      var headingTextId = void 0;
      if (typeof headingText === 'string') {
        headingTextId = headingText.trim().replace(/\s+/g, '-');
      } else {
        headingText = children.map(function (itemNode) {
          if (Array.isArray(itemNode)) {
            return itemNode[itemNode.length - 1];
          }
          return itemNode;
        }).join('');
        headingTextId = headingText.trim().replace(/\s+/g, '-');
      }
      return _react2.default.createElement(_utils2.default.getTagName(node), _extends({
        key: index,
        id: headingTextId
      }, _utils2.default.getAttributes(node)), [_react2.default.createElement(
        'span',
        { key: 'title' },
        children.map(function (child) {
          return (0, _jsonmlToReactComponent2.default)(child);
        })
      ), _react2.default.createElement(
        'a',
        { href: '#' + headingTextId, className: 'anchor', key: 'anchor' },
        '#'
      )]);
    }], [function (node) {
      return _utils2.default.isElement(node) && _utils2.default.getTagName(node) === 'video';
    }, function (node, index) {
      return _react2.default.createElement(_VideoPlayer2.default, { video: _utils2.default.getAttributes(node), key: index });
    }], [function (node) {
      return _utils2.default.isElement(node) && _utils2.default.getTagName(node) === 'a' && !(_utils2.default.getAttributes(node).class || _utils2.default.getAttributes(node).href && _utils2.default.getAttributes(node).href.indexOf('http') === 0 || /^#/.test(_utils2.default.getAttributes(node).href));
    }, function (node, index) {
      return _react2.default.createElement(
        _reactRouter.Link,
        { to: _utils2.default.getAttributes(node).href, key: index },
        (0, _jsonmlToReactComponent2.default)(_utils2.default.getChildren(node)[0])
      );
    }], [function (node) {
      return _utils2.default.isElement(node) && _utils2.default.getTagName(node) === 'p' && _utils2.default.getTagName(_utils2.default.getChildren(node)[0]) === 'img' && /preview-img/gi.test(_utils2.default.getAttributes(_utils2.default.getChildren(node)[0]).class);
    }, function (node, index) {
      var imgs = _utils2.default.getChildren(node).filter(function (img) {
        return _utils2.default.isElement(img) && Object.keys(_utils2.default.getAttributes(img)).length > 0;
      }).map(function (img) {
        return _utils2.default.getAttributes(img);
      });
      return _react2.default.createElement(_ImagePreview2.default, { imgs: imgs, key: index });
    }]]
  };
};