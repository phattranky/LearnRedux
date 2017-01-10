import React, { Component, PropTypes } from 'react';
import * as d3 from 'd3';
import { forEach } from 'lodash';

class Line extends Component {

  static propTypes = {
    path: PropTypes.string,
    areaPath: PropTypes.string,
    className: PropTypes.string,
    duration: PropTypes.number,
    filterUrl: PropTypes.string,
    points: PropTypes.array,
    pointRad: PropTypes.number,
    pointMouseEnter: PropTypes.func
  }

  static defaultProps = {
    path: '',
    areaPath: '',
    className: '',
    duration: 0,
    filterUrl: '',
    points: [],
    pointRad: 3.5,
    pointMouseEnter: null
  }

  componentDidUpdate() {
    this.renderPath(true);
    this.renderDot(true);
  }

  componentDidMount() {
    this.renderPath();
    this.renderDot();
  }

  pointEnter(point) {
    if (this.props.pointMouseEnter) {
      this.props.pointMouseEnter(point);
    }
  }

  renderPath(didUpdate) {
    d3.select(this.refs.linePath)
      .transition()
      .duration(didUpdate ? this.props.duration : 0)
      .attr('d', this.props.path);
    d3.select(this.refs.areaPath)
      .transition()
      .duration(didUpdate ? this.props.duration : 0)
      .attr('d', this.props.areaPath);
  }

  renderDot(didUpdate) {
    const { points, duration, pointRad } = this.props;
    const dotNodes = d3.select(this.refs.dotGroup).selectAll('circle.plot').nodes();
    forEach(dotNodes, (dot, index) => {
      d3.select(dot)
        .transition()
        .duration(didUpdate ? duration : 0)
        .attr('r', pointRad)
        .attr('cx', points[index].x)
        .attr('cy', points[index].y);
    })
  }

  render() {
    const { path, areaPath, className, filterUrl, points } = this.props;
    const areaPathStyle = {};
    if (filterUrl.length) {
      areaPathStyle.filter = `url(${filterUrl})`;
    }
    return (
      <g className={`line ${className}`}>
        {
          areaPath && areaPath.length ?
          <path
            style={areaPathStyle}
            ref="areaPath"
            className="area-path"
          />
          : null
        }
        {
          path && path.length ?
          <path
            ref="linePath"
            className="line-path"
          />
          : null
        }
        <g ref="dotGroup">
          {
            points.map((point, index) => 
              <circle
                key={index}
                className="plot"
                onMouseEnter={() => this.pointEnter(point)}
              >
              </circle>
            )
          }
        </g>
      </g>
    );
  }
}

export default Line;
