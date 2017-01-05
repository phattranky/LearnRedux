import React, { Component, PropTypes } from 'react';
import * as d3 from 'd3';
import moment from 'moment';

import Chart from './Chart';
import Axis from './Axis';
import Line  from './Line';

class AreaLineChart extends Component {

  static propTypes = {
    data: PropTypes.array,
    width: PropTypes.number,
    height: PropTypes.number,
    responsive: PropTypes.bool,
    className: PropTypes.string
  }

  static defaultProps = {
    data: [],
    width: 500,
    height: 300,
    padding: {top: 30, right: 30, bottom: 30, left: 30},
    responsive: false,
    className: ''
  }

  state = {
    width: this.props.width,
    height: this.props.height
  }

  componentDidMount() {
    if (this.props.responsive) {
      this.enableResize();
    }
  }

  componentWillUnmount() {
    this.disableResize();
  }

  onResize = () => {
    const { padding } = this.props;
    const { clientWidth, clientHeight } = this.refs.wrapper;
    this.setState({
      width: clientWidth - padding.left - padding.right
    });
  }

  disableResize() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.onResize)
    }
  }

  enableResize() {
    const { padding } = this.props;
    const { clientWidth, clientHeight } = this.refs.wrapper;
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.onResize, false)
      this.setState({
        width: clientWidth - padding.left - padding.right
      });
    }
  }

  chartData() {
    const { padding, data } = this.props;
    const { width, height } = this.state;
    const chartWidth = width + padding.left + padding.right;
    const chartHeight = height + padding.top + padding.bottom;

    const xScale = d3.scaleTime().range([1, chartWidth - padding.left - padding.right]);
    xScale.domain(d3.extent(data, (d) => moment(d.year, 'YYYY')));

    const maxMoneyTotal = d3.max(data, (d) => (d.money));
    const yScale = d3.scaleLinear().range([chartHeight - padding.top - padding.bottom, 0]);
    yScale.domain([0, maxMoneyTotal]);

    const maxNumberTotal = d3.max(data, (d) => (d.number));
    const yRightScale = d3.scaleLinear().range([chartHeight - padding.top - padding.bottom, 0]);
    yRightScale.domain([0, maxNumberTotal]);

    const line = d3.line()
                  .curve(d3.curveCardinal)
                  .x((d) => xScale(moment(d.year, 'YYYY')))
                  .y((d) => yScale(d.money));
    const area = d3.area()
                  .curve(d3.curveCardinal)
                  .x((d) => xScale(moment(d.year, 'YYYY')))
                  .y0(chartHeight - padding.bottom - padding.top)
                  .y1((d) => yScale(d.money));

    const linePoints = data.map((item) => ({
      x: xScale(moment(item.year, 'YYYY')), 
      y: yScale(item.money),
      data: item
    }));

    return {
      width: chartWidth,
      height: chartHeight,
      xScale,
      yScale,
      yRightScale,
      line,
      area,
      linePoints
    };
  }

  render() {
    const { width, height, yScale, xScale, yRightScale, line, area, linePoints } = this.chartData();
    const { padding, data, className } = this.props;
    const bottomAxisPosition = {
      top: 0,
      left: 0,
      right: 0,
      bottom: padding.top + padding.bottom
    };

    const rightAxisPosition = {
      top: 0,
      left: 0,
      right: padding.right + padding.left,
      bottom: 0
    };

    if (!data || !data.length) {
      return null;
    }

    return (
      <div ref="wrapper" className={className}>
        <Chart width={width} height={height} padding={padding}>
          <filter id="dropshadow" height="130%" width="110%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
            <feOffset dx="0" dy="-2" result="offsetblur"/>
            <feMerge> 
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <Axis orient='left' scale={yScale} duration={500} />
          <Axis orient='right' scale={yRightScale} position={rightAxisPosition} />
          <Axis
            orient='bottom'
            scale={xScale}
            position={bottomAxisPosition}
            tickPadding={5}
            ticks={0}
          />
          <Line
            points={linePoints}
            path={line(data)}
            areaPath={area(data)}
            duration={500}
            filterUrl="#dropshadow"
          />
        </Chart>
      </div>
    )
  }
};

export default AreaLineChart;