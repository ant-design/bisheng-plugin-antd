import React from 'react';
import classNames from 'classnames';
import Modal from 'antd/lib/modal';
import Carousel from 'antd/lib/carousel';

function isGood(className) {
  return /\bgood\b/i.test(className);
}

function isBad(className) {
  return /\bbad\b/i.test(className);
}

function isInline(className) {
  return /\binline\b/i.test(className);
}

function PreviewImageBox({
  cover, coverMeta, imgs, style, previewVisible,
  comparable, onClick, onCancel
}) {
  const onlyOneImg = comparable || imgs.length === 1;
  const imageWrapperClassName = classNames('preview-image-wrapper', {
    good: coverMeta.isGood,
    bad: coverMeta.isBad,
  });
  return (
    <div
      className="preview-image-box"
      style={style}
    >
      <div
        onClick={onClick}
        className={imageWrapperClassName}
      >
        <img
          className={coverMeta.className}
          src={coverMeta.src}
          alt={coverMeta.alt}
        />
      </div>
      <div className="preview-image-title">
        {coverMeta.alt}
      </div>
      <div
        className="preview-image-description"
        dangerouslySetInnerHTML={{ __html: coverMeta.description }}
      />
      <Modal
        className="image-modal"
        width={960}
        visible={previewVisible}
        title={null}
        footer={null}
        onCancel={onCancel}
      >
        <Carousel
          className={`${onlyOneImg ? 'image-modal-single' : ''}`}
          draggable={!onlyOneImg}
          adaptiveHeight
        >
          {comparable ? cover : imgs}
        </Carousel>
        <div className="preview-image-title">
          {coverMeta.alt}
        </div>
      </Modal>
    </div>
  );
}

export default class ImagePreview extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      leftVisible: false,
      rightVisible: false,
    };

    this.handleLeftClick = this.handleClick.bind(this, 'left');
    this.handleRightClick = this.handleClick.bind(this, 'right');
  }

  handleClick(side) {
    this.setState({ [`${side}Visible`]: true });
  }

  handleCancel = () => {
    this.setState({
      leftVisible: false,
      rightVisible: false,
    });
  }

  render() {
    const { imgs } = this.props;
    const imgsMeta = imgs.map((img) => {
      const { alt, description, src } = img;
      const imgClassName = img.class;
      return {
        className: imgClassName,
        alt, description, src,
        isGood: isGood(imgClassName),
        isBad: isBad(imgClassName),
        inline: isInline(imgClassName),
      };
    });

    const imagesList = imgsMeta.map((meta, index) => {
      const metaCopy = { ...meta };
      delete metaCopy.description;
      delete metaCopy.isGood;
      delete metaCopy.isBad;
      return (
        <div key={index}>
          <div className="image-modal-container">
            <img {...metaCopy} alt={meta.alt} />
          </div>
        </div>
      );
    });
    const comparable = imgs.length === 2 &&
            (imgsMeta[0].isGood || imgsMeta[0].isBad || imgsMeta[0].inline) &&
            (imgsMeta[1].isGood || imgsMeta[1].isBad || imgsMeta[1].inline);
    const style = comparable ? { width: '50%' } : null;

    const hasCarousel = imgs.length > 1 && !comparable;
    const previewClassName = classNames({
      'preview-image-boxes': true,
      clearfix: true,
      'preview-image-boxes-with-carousel': hasCarousel,
    });
    return (
      <div className={previewClassName}>
        <PreviewImageBox
          style={style}
          comparable={comparable}
          previewVisible={this.state.leftVisible}
          cover={imagesList[0]}
          coverMeta={imgsMeta[0]}
          imgs={imagesList}
          onClick={this.handleLeftClick}
          onCancel={this.handleCancel}
        />
        {
          comparable ?
            <PreviewImageBox
              style={style}
              comparable
              previewVisible={this.state.rightVisible}
              cover={imagesList[1]}
              coverMeta={imgsMeta[1]}
              imgs={imagesList}
              onClick={this.handleRightClick}
              onCancel={this.handleCancel}
            /> : null
        }
      </div>
    );
  }
}
