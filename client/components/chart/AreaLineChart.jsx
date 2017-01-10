import React, { Component, PropTypes } from 'react';
import * as d3 from 'd3';
import moment from 'moment';

import Chart from './Chart';
import Axis from './Axis';
import Line  from './Line';

class AreaLineChart extends Component {

  static propTypes = {
    labels: PropTypes.array,
    xScaleType: PropTypes.oneOf(['time', 'band']),
    xAxisProp: PropTypes.string,
    xAxisFormat: PropTypes.string,
    xAxisDisplayFormat: PropTypes.string,
    yLeftAxisLabelProp: PropTypes.string,
    yRightAxisLabelProp: PropTypes.string,
    data: PropTypes.object,
    width: PropTypes.number,
    height: PropTypes.number,
    responsive: PropTypes.bool,
    className: PropTypes.string
  }

  static defaultProps = {
    labels: [],
    xScaleType: 'time',
    xAxisProp: '',
    xAxisFormat: '',
    xAxisDisplayFormat: '',
    yLeftAxisLabelProp: '',
    yRightAxisLabelProp: '',
    data: {},
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

  scaleTypes = {
    TIME: 'time',
    BAND: 'band'
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

  getChartWidth = () => {
    const { width } = this.state;
    const { padding } = this.props;
    return width + padding.left + padding.right;
  }

  getChartHeight = () => {
    const { height } = this.state;
    const { padding } = this.props;
    return height + padding.top + padding.bottom;
  }

  getXScale = () => {
    const { labels, xScaleType, xAxisProp, xAxisFormat, data } = this.props;
    const { width: xaxisWidth } = this.state;
    const actualLabels = labels.length ? labels : Object.keys(data);
    const xAxisColumns = {};
    for (const item of actualLabels) {
      const curItem = data[item];
      for (let i = 0; i < curItem.length; i++) {
        xAxisColumns[curItem[i][xAxisProp]] = '';
      }
    }
    const xAxisColumnsInArray = Object.keys(xAxisColumns);
    let xScale;
    if (xScaleType === this.scaleTypes.TIME) {
      xScale = d3.scaleTime().range([1, xaxisWidth]);
      xScale.domain(d3.extent(xAxisColumnsInArray, (d) => moment(d, xAxisFormat)));
    }
    if (xScaleType === this.scaleTypes.BAND) {
      // WILL BE IMPLEMENT LATER
    }

    return xScale;
  }

  getYScale(labels, data, yProp, axisHeight) {
    const maxOfEachLabels = [];
    const actualLabels = labels.length ? labels : Object.keys(data);
    for (const item of actualLabels) {
      maxOfEachLabels.push(d3.max(data[item], (d) => d[yProp]));
    }
    const max = d3.max(maxOfEachLabels);
    const yScale = d3.scaleLinear().range([axisHeight, 0]);
    yScale.domain([0, max]);
    
    return yScale;
  }

  chartData() {
    const { padding, data, xScaleType, xAxisProp, yLeftAxisLabelProp, yRightAxisLabelProp, labels, xAxisFormat } = this.props;
    const { width, height } = this.state;

    const xScale = this.getXScale();
    const yScale = this.getYScale(labels, data, yLeftAxisLabelProp, height);
    const yRightScale = this.getYScale(labels, data, yRightAxisLabelProp, height);
    const drawData = [];
    const actualLabels = labels.length ? labels : Object.keys(data);
    for (const label of actualLabels) {
      const item = data[label];
      // const linePoints = item.map((item) => ({
      //   x: xScale(xScaleType === this.scaleTypes.TIME ? moment(item[yLeftAxisLabelProp], xAxisFormat)
      //     : item[yLeftAxisLabelProp]), 
      //   y: yScale(item[yLeftAxisLabelProp]),
      //   data: item
      // }));
      drawData.push({
        label,
        linePoints: [],
        data: item
      });
    }

    const line = d3.line()
                  .x((d) => {
                    const dData = xScaleType === this.scaleTypes.TIME ? moment(d[xAxisProp], xAxisFormat)
          : d[xAxisProp];
                    return xScale(dData);
                  })
                  .y((d) => yRightScale(d[yRightAxisLabelProp]));
    const area = d3.area()
                  .curve(d3.curveCardinal)
                  .x((d) => xScale(xScaleType === this.scaleTypes.TIME ? moment(d[xAxisProp], xAxisFormat)
          : d[xAxisProp]))
                  .y0(height)
                  .y1((d) => yScale(d[yLeftAxisLabelProp]));

    return {
      width: this.getChartWidth(),
      height: this.getChartHeight(),
      xScale,
      yScale,
      yRightScale,
      line,
      area,
      drawData
    };
  }

  render() {
    const { width, height, yScale, xScale, yRightScale, line, area, linePoints, drawData } = this.chartData();
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
          {
            drawData.map((item) => {
              return <Line
                key={item.label}
                points={item.linePoints}
                areaPath={area(item.data)}
                duration={500}
                filterUrl="#dropshadow"
              />
            })
          }
          {
            drawData.map((item) => {
              return <Line
                key={item.label}
                points={item.linePoints}
                path={line(item.data)}
                duration={500}
                filterUrl="#dropshadow"
              />
            })
          }
        </Chart>
      </div>
    )
  }
};

export default AreaLineChart;