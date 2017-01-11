import React, { Component, PropTypes } from 'react';

class Tooltip extends Component {

  static defaultProps = {
    id: '',
    className: '',
    width: 200,
    height: 200,
    position: 'top-right',
    mousePos: [0, 0],
    autoChangePosSide: false,
    mouseWrapper: {
      width: 0,
      height: 0
    },
    mousePadding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    },
    visible: false
  }

  static propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    position: PropTypes.oneOf(['top', 'right', 'bottom', 'left', 
      'top-left', 'top-right', 'bottom-left', 'bottom-right']),
    mousePos: PropTypes.array,
    autoChangePosSide: PropTypes.bool,
    mouseWrapper: PropTypes.object,
    visible: PropTypes.bool
  }

  getPos(options) {
    const { mousePos, width, height, mouseWrapper, position, mousePadding } = options;
    let x = mousePos[0];
    let y = mousePos[1] - mouseWrapper.height;
    switch (position) {
      case 'top':
        y -= height;
        x -= width / 2;
        if (mousePadding.top) {
          y -= mousePadding.top;
        }
        if (mousePadding.right) {
          x -= mousePadding.right;
        }
        break;
      case 'right':
        y -= height / 2;
        if (mousePadding.right) {
          x -= mousePadding.right;
        }
        break;
      case 'bottom':
        y += height;
        x -= width / 2;
        if (mousePadding.bottom) {
          y += mousePadding.bottom;
        }        
        break;
      case 'left':
        y += height;
        x -= width / 2;
        if (mousePadding.left) {
          x -= mousePadding.left;
        }        
        break;
      case 'top-right':
        y -= height;
        if (mousePadding.top) {
          y -= mousePadding.top;
        }
        if (mousePadding.right) {
          x -= mousePadding.right;
        }
        break;
      case 'top-left':
        y -= height;
        if (mousePadding.top) {
          y -= mousePadding.top;
        }
        if (mousePadding.right) {
          x -= mousePadding.right;
        }
        break;
      case 'bottom-left':
        y -= height;
        if (mousePadding.top) {
          y -= mousePadding.top;
        }
        if (mousePadding.right) {
          x -= mousePadding.right;
        }
        break;
      case 'bottom-right':
        y -= height;
        if (mousePadding.top) {
          y -= mousePadding.top;
        }
        if (mousePadding.right) {
          x -= mousePadding.right;
        }
        break;
    }
    return {
      x,
      y
    };
  }

  render() {
    const { id, height, width, className, mousePos, children, mouseWrapper, visible } = this.props;
    const tooltipPos = this.getPos(this.props);

    if (!visible) {
      return null;
    }

    return (
      <div
        id={id}
        className={`chart-tooltip ${className}`}
        style={
        {
          transform: `translate(${tooltipPos.x}px, ${tooltipPos.y}px)`,
          width: `${width}px`,
          height: `${height}px`
        }}
      >
        {children}
      </div>
    )
  }
};

export default Tooltip;