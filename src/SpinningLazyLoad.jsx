import React from 'react';
import LazyLoad from 'react-lazy-load';
import Spin from 'antd/lib/spin';

export default class SpinningLazyLoad extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      spinning: true,
    };
  }

  handleContentVisible = () => {
    this.setState({ spinning: false });
  }

  render() {
    return (
      <Spin spinning={this.state.spinning}>
        <LazyLoad {...this.props} onContentVisible={this.handleContentVisible} />
      </Spin>
    );
  }
}
