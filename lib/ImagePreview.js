'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _modal = require('antd/lib/modal');

var _modal2 = _interopRequireDefault(_modal);

var _cascader = require('antd/lib/cascader');

var _cascader2 = _interopRequireDefault(_cascader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function isGood(className) {
  return (/\bgood\b/i.test(className)
  );
}
function isBad(className) {
  return (/\bbad\b/i.test(className)
  );
}

function PreviewImageBox(_ref) {
  var cover = _ref.cover;
  var coverMeta = _ref.coverMeta;
  var imgs = _ref.imgs;
  var style = _ref.style;
  var previewVisible = _ref.previewVisible;
  var comparable = _ref.comparable;
  var onClick = _ref.onClick;
  var onCancel = _ref.onCancel;

  var onlyOneImg = comparable || imgs.length === 1;
  return _react2.default.createElement(
    'div',
    { className: 'preview-image-box',
      style: style
    },
    _react2.default.createElement(
      'div',
      { onClick: onClick, className: 'preview-image-wrapper ' + (coverMeta.isGood && 'good') + ' ' + (coverMeta.isBad && 'bad') },
      _react2.default.createElement('img', { className: coverMeta.className, src: coverMeta.src, alt: coverMeta.alt })
    ),
    _react2.default.createElement(
      'div',
      { className: 'preview-image-title' },
      coverMeta.alt
    ),
    _react2.default.createElement('div', { className: 'preview-image-description',
      dangerouslySetInnerHTML: { __html: coverMeta.description }
    }),
    _react2.default.createElement(
      _modal2.default,
      { className: 'image-modal', width: 960, visible: previewVisible, title: null, footer: null,
        onCancel: onCancel
      },
      _react2.default.createElement(
        _cascader2.default,
        { className: '' + (onlyOneImg ? 'image-modal-single' : ''), draggable: !onlyOneImg, adaptiveHeight: true },
        comparable ? cover : imgs
      ),
      _react2.default.createElement(
        'div',
        { className: 'preview-image-title' },
        coverMeta.alt
      )
    )
  );
}

var ImagePreview = function (_React$Component) {
  _inherits(ImagePreview, _React$Component);

  function ImagePreview(props) {
    _classCallCheck(this, ImagePreview);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ImagePreview).call(this, props));

    _this.handleCancel = function () {
      _this.setState({
        leftVisible: false,
        rightVisible: false
      });
    };

    _this.state = {
      leftVisible: false,
      rightVisible: false
    };

    _this.handleLeftClick = _this.handleClick.bind(_this, 'left');
    _this.handleRightClick = _this.handleClick.bind(_this, 'right');
    return _this;
  }

  _createClass(ImagePreview, [{
    key: 'handleClick',
    value: function handleClick(side) {
      this.setState(_defineProperty({}, side + 'Visible', true));
    }
  }, {
    key: 'render',
    value: function render() {
      var imgs = this.props.imgs;

      var imgsMeta = imgs.map(function (img) {
        var alt = img.alt;
        var description = img.description;
        var src = img.src;

        var imgClassName = img.class;
        return {
          className: imgClassName,
          alt: alt, description: description, src: src,
          isGood: isGood(imgClassName),
          isBad: isBad(imgClassName)
        };
      });

      var imagesList = imgsMeta.map(function (meta, index) {
        return _react2.default.createElement(
          'div',
          { key: index },
          _react2.default.createElement(
            'div',
            { className: 'image-modal-container' },
            _react2.default.createElement('img', _extends({}, meta, { alt: meta.alt }))
          )
        );
      });
      var comparable = imgs.length === 2 && (imgsMeta[0].isGood || imgsMeta[0].isBad) && (imgsMeta[1].isGood || imgsMeta[1].isBad);
      var style = comparable ? { width: '50%' } : null;

      var hasCarousel = imgs.length > 1 && !comparable;
      var previewClassName = (0, _classnames2.default)({
        'preview-image-boxes': true,
        clearfix: true,
        'preview-image-boxes-with-carousel': hasCarousel
      });
      return _react2.default.createElement(
        'div',
        { className: previewClassName },
        _react2.default.createElement(PreviewImageBox, { style: style,
          comparable: comparable,
          previewVisible: this.state.leftVisible,
          cover: imagesList[0],
          coverMeta: imgsMeta[0],
          imgs: imagesList,
          onClick: this.handleLeftClick,
          onCancel: this.handleCancel
        }),
        comparable ? _react2.default.createElement(PreviewImageBox, { style: style,
          comparable: true,
          previewVisible: this.state.rightVisible,
          cover: imagesList[1],
          coverMeta: imgsMeta[1],
          imgs: imagesList,
          onClick: this.handleRightClick,
          onCancel: this.handleCancel
        }) : null
      );
    }
  }]);

  return ImagePreview;
}(_react2.default.Component);

exports.default = ImagePreview;