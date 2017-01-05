import React, { Component, PropTypes } from 'react';
import * as d3 from 'd3';
import { forEach } from 'lodash';

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
    tickPadding: PropTypes.number,
    duration: PropTypes.number
  }

  static defaultProps = {
    width: 0,
    height: 0,
    orient: 'left',
    className: '',
    ticks: null,
    position: {top: 0, right: 0, bottom: 0, left: 0},
    tickPadding: 0,
    duration: 0
  }

  componentDidMount() {
    this.renderAxis();
  }

  componentDidUpdate() {
    this.renderAxis();
  }

  renderAxis() {
    const { className, orient, scale, ticks, 
      tickFormat, tickPadding, duration, textRotate } = this.props;
    let axis = d3.axisLeft(scale);
    switch(orient) {
      case 'top':
        axis = d3.axisTop(scale);
        break;
      case 'right':
        axis = d3.axisRight(scale);
        break;
      case 'bottom':
        axis = d3.axisBottom(scale);
        break;
      default:
        break;
    }

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
