import React, { Component, PropTypes } from 'react';
import * as d3 from 'd3';
import { forEach, isEqual } from 'lodash';

class Axis extends Component {

  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    orient: PropTypes.oneOf(['left', 'top', 'right', 'bottom']),
    className: PropTypes.string,
    scale: PropTypes.func.isRequired,
    ticks: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
    tickFormat: PropTypes.func,
    position: PropTypes.object,
    padding: PropTypes.object,
    tickPadding: PropTypes.number,
    duration: PropTypes.number,
    displayGrid: PropTypes.bool,
    outerTickSize: PropTypes.number
  }

  static defaultProps = {
    width: 0,
    height: 0,
    orient: 'left',
    className: '',
    ticks: null,
    position: {top: 0, right: 0, bottom: 0, left: 0},
    tickPadding: 0,
    duration: 0,
    displayGrid: false,
    outerTickSize: 0,
    padding: {top: 0, right: 0, bottom: 0, left: 0}
  }

  shouldComponentUpdate(nextProps) {
    return !isEqual(this.props, nextProps);
  }

  componentDidMount() {
    this.renderAxis();
  }

  componentDidUpdate() {
    this.renderAxis();
  }

  renderAxis() {
    const { className, orient, scale, ticks, outerTickSize, width, height,
      tickFormat, tickPadding, duration, textRotate, displayGrid, position, padding } = this.props;
    let axis = d3.axisLeft(scale);
    switch(orient) {
      case 'top':
        axis = d3.axisTop(scale);
        if (displayGrid) {
          axis.tickSizeInner(height + padding.top + padding.bottom);
        }
        break;
      case 'right':
        axis = d3.axisRight(scale);
        if (displayGrid) {
          axis.tickSizeInner(width - padding.left - padding.right);
        }
        break;
      case 'bottom':
        axis = d3.axisBottom(scale);
        if (displayGrid) {
          axis.tickSizeInner(-height + padding.top + padding.bottom);
        }
        break;
      default:
        if (displayGrid) {
          axis.tickSizeInner(-width + padding.left + padding.right);
        }
        break;
    }

    axis.tickSizeOuter(outerTickSize);

    if (ticks) {
      axis.ticks(ticks);
    }
    if (tickFormat) {
      axis.tickFormat(tickFormat);
    }
    if (tickPadding) {
      axis.tickPadding(tickPadding);
    }

    const axisNode = d3.select(this.refs.axis)
      .attr('class', className)
      .transition()
      .duration(duration)
      .call(axis);
  }

  render() {
    const { width, height, className, orient, position } = this.props;
    let translate = 'translate(0, 0)';
    if (orient === 'top' || orient === 'left') {
      translate = `translate(${position.left - position.right}, ${position.top - position.bottom})`;
    }
    if (orient === 'bottom') {
      translate = `translate(${position.left - position.right}, ${height + position.top - position.bottom})`;
    }
    if (orient === 'right') {
      translate = `translate(${width - position.left - position.right}, ${position.top - position.bottom})`;
    }

    return (
      <g ref="axis" className={`axis ${className}`} transform={translate} />
    );
  }
}

export default Axis;
