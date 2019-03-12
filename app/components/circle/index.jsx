import React, { Component } from 'react';

import './index.scss';

class Circle extends Component {

  render() {
    const  { cx, cy, r, style } = this.props;

    return <div className="circle" style={{
      position: 'absolute',
      top: cy-r,
      left: cx-r,
      width: 2*r,
      height: 2*r,
      borderRadius: r,
      ...style
    }}>
    </div>
  }
}

Circle.defaultProps = {
  cx: 0,
  cy: 0,
  r: 1,
  style: {}
}

export default Circle;