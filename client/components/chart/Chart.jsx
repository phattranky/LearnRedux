import React, { Component, PropTypes } from 'react';

class Chart extends Component {

  static defaultProps = {
    id: '',
    className: '',
    width: 960,
    height: 500,
    padding: {top: 0, right: 0, bottom: 0, left: 0}
  }

  static propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    padding: PropTypes.object.isRequired
  }

  render() {
    const { id, height, width, padding, className, children } = this.props;
    const transformedChildren = React.Children.map(children, (child) => {
      if (child) {
        if (child.type === 'filter') {
          return child;
        }
        const clonedProps = {
          width: child.props.width || width,
          height: child.props.height || height
        };
        return React.cloneElement(child, clonedProps);
      } else {
        return null;
      }
    });
    const translate = `translate(${padding.left}, ${padding.top})`;

    return (
      <svg
        id={id}
        height={height}
        width={width}
        className={className}
      >
        <g
          transform = {translate}
        >
          {transformedChildren}
        </g>
      </svg>
    )
  }
};

export default Chart;