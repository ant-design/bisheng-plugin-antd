'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = VideoPlayer;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactSublimeVideo = require('react-sublime-video');

var _reactSublimeVideo2 = _interopRequireDefault(_reactSublimeVideo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function VideoPlayer(_ref) {
  var video = _ref.video;
  var alt = video.alt;
  var description = video.description;
  var src = video.src;

  var videoClassName = video.class;

  return _react2.default.createElement(
    'div',
    { className: 'preview-image-box ' + videoClassName },
    _react2.default.createElement(
      'div',
      { className: 'preview-image-wrapper' },
      _react2.default.createElement(_reactSublimeVideo2.default, { src: src, type: 'video/mp4' })
    ),
    _react2.default.createElement(
      'div',
      { className: 'preview-image-title' },
      alt
    ),
    _react2.default.createElement('div', { className: 'preview-image-description',
      dangerouslySetInnerHTML: { __html: description }
    })
  );
}