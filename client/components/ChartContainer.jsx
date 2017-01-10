import React, { Component, PropTypes } from 'react';
import { random, cloneDeep, forEach } from 'lodash';

import dataset, { labels as dataLabels } from '../data/dualChartData';
import AreaLineChart from './chart/AreaLineChart';

class ChartContainer extends Component {

  state = {
    data: dataset,
    width: 500,
    height: 300
  }

  // updateData = () => {
  //   const newData = cloneDeep(this.state.data);
  //   forEach(newData, (item) => {
  //     item.money = random(20, 500);
  //   });
  //   this.setState({
  //     data: newData
  //   });
  // }

  render() {
    const { width, height, showChart2 } = this.state;
    return (
      <div>
        <div>
          <button>
            Update Data
          </button>
        </div>
        <AreaLineChart
          labels={dataLabels}
          xAxisFormat="YYYY"
          xAxisProp="year"
          yLeftAxisLabelProp='money'
          yRightAxisLabelProp='number'
          data={dataset}
          width={width}
          height={height}
          responsive={true}
        />
      </div>
    )
  }
};

export default ChartContainer;