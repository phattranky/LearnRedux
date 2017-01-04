import React, { Component, PropTypes } from 'react';
import * as d3 from 'd3';

class Line extends Component {

  static propTypes = {
    path: PropTypes.string,
    areaPath: PropTypes.string,
    className: PropTypes.string,
    duration: PropTypes.number,
    filterUrl: PropTypes.string
  }

  static defaultProps = {
    path: '',
    areaPath: '',
    className: '',
    duration: 0,
    filterUrl: ''
  }

  componentDidUpdate() {
    this.renderPath();
    this.renderDot();
  }

  componentDidMount() {
    this.renderPath();
    this.renderDot();
  }

  convertPathToDot(path) {
    const commands = path.split(/(?=[LMC])/);
    return commands.map(function(d){
      var pointsArray = d.slice(1, d.length).split(',');
      var pairsArray = [];
      for(var i = 0; i < pointsArray.length; i += 2) {
        pairsArray.push([+pointsArray[i], +pointsArray[i+1]]);
      }
      return pairsArray;
    });
  }

  renderDot() {
    const { path, areaPath } = this.props;
    let dotArr = [];
    if (path && path.length) {
      dotArr = this.convertPathToDot(path);
    } else {
      dotArr = this.convertPathToDot(areaPath);
    }
    console.log('dotArr', dotArr);
  }

  renderPath() {
    d3.select(this.refs.linePath)
      .transition()
      .duration(this.props.duration)
      .attr('d', this.props.path);
    d3.select(this.refs.areaPath)
      .transition()
      .duration(this.props.duration)
      .attr('d', this.props.areaPath);
  }

  render() {
    const { path, areaPath, className, filterUrl } = this.props;
    const areaPathStyle = {};
    if (filterUrl.length) {
      areaPathStyle.filter = `url(${filterUrl})`;
    }
    return (
      <g className={`line ${className}`}>
        {
          (path && path.length && (!areaPath || !areaPath.length)) ?
          <path
            ref="linePath"
            className="line-path"
          />
          : null
        }
        {
          areaPath && areaPath.length ?
          <path
            style={areaPathStyle}
            ref="areaPath"
            className="area-path"
          />
          : null
        }
        <g ref="dotGroup">
        </g>
      </g>
    );
  }
}

export default Line;
