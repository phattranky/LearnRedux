import React, { Component, PropTypes } from 'react';
import * as d3 from 'd3';
import moment from 'moment';
import { random, cloneDeep, forEach } from 'lodash';

import Data from '../../data/dualChartData';
import Chart from './Chart';
import Axis from './Axis';
import Line  from './Line';

class AreaLineChart extends Component {

  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number
  }

  static defaultProps = {
    data: Data,
    width: 500,
    height: 300,
    padding: {top: 30, right: 30, bottom: 30, left: 30},
    dataMapping: {
      xAxisData: {
        data: [],
        type: 'date',
        format: 'YYYY',
        displayFormat: 'YYYY'
      },
      leftYAxisData: '',
      rightYAxisData: ''
    }
  }

  state = {
    data: Data
  }

  chartData() {
    const { padding, width, height } = this.props;
    const { data } = this.state;
    const chartWidth = width + padding.left + padding.right;
    const chartHeight = height + padding.top + padding.bottom;

    const xScale = d3.scaleTime().range([1, chartWidth - padding.left - padding.right]);
    // xScale.domain([moment(data[0].year, 'YYYY'), moment(data[data.length - 1].year, 'YYYY')]);
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
      padding,
      line,
      area,
      linePoints
    };
  }

  updateData = () => {
    console.log('update data');
    const newData = cloneDeep(this.state.data);
    forEach(newData, (item) => {
      item.money = random(20, 500);
    });
    console.log(newData);
    this.setState({
      data: newData
    });
  }

  render() {
    const { width, height, yScale, xScale, yRightScale, padding, line, area, linePoints } = this.chartData();
    const { data } = this.state;
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
      <div>
        <div>
          <button onClick={this.updateData}>
            Update Data
          </button>
        </div>
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