/* eslint-disable react/jsx-key */
import React, { Component } from 'react';
import * as d3 from 'd3';

class Slice extends Component {
  render() {
    let { pie, totalPoints } = this.props;

    let arc = d3
      .arc()
      .innerRadius(50)
      .outerRadius(this.props.radius);
    let interpolate = d3.interpolateRgb('#eaaf79', '#bc3358');

    return pie.map((slice, index) => {
      let sliceColor = interpolate(index / (pie.length - 1));
      const user = this.props.alldata.find(
        object => object.points === slice.data
      );

      if (user.user === null) {
        user.user = 'unassigned';
      }
      let [startAngle, endAngle] = arc.centroid(slice);
      startAngle = startAngle - 30;
      let percent = Math.round(slice.data / totalPoints * 100);
      return (
        <React.Fragment>
          <path d={arc(slice)} fill={sliceColor} />

          <text
            transform={`translate(${startAngle}, ${endAngle})`}
            fill="black"
            dy=".35em"
          >
            {percent}%
            {user.user}
          </text>
        </React.Fragment>
      );
    });
  }
}
export default Slice;
