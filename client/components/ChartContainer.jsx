import React, { Component, PropTypes } from 'react';
import { random, cloneDeep, forEach } from 'lodash';

import Data from '../data/dualChartData';
import AreaLineChart from './chart/AreaLineChart';

class ChartContainer extends Component {

  state = {
    data: Data,
    width: 500,
    height: 300
  }

  updateData = () => {
    const newData = cloneDeep(this.state.data);
    forEach(newData, (item) => {
      item.money = random(20, 500);
    });
    this.setState({
      data: newData
    });
  }

  render() {
    const { data, width, height, showChart2 } = this.state;
    return (
      <div>
        <div>
          <button onClick={this.updateData}>
            Update Data
          </button>
        </div>
        <AreaLineChart 
          data={data}
          width={width}
          height={height}
          responsive={true}
        />
      </div>
    )
  }
};

export default ChartContainer;