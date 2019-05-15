/* eslint-disable react/jsx-key */
import React, { Component } from 'react';
import * as d3 from 'd3';

class Slice extends Component {
  componentDidUpdate(prevProps) {
    console.log('component was updated');
    console.log('PREVPROPS', prevProps);
  }
  render() {
    let { pie, x, y } = this.props;
    console.log('x insice slice', x);
    console.log('y inside of slice', y);
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

      console.log('slice!!', slice);
      if (user.user === null) {
        user.user = 'unassigned';
      }
      return (
        <React.Fragment>
          <path d={arc(slice)} fill={sliceColor} />

          <text
            transform={`translate(${arc.centroid(slice)})`}
            fill="black"
            dy=".35em"
          >
            {user.user}
          </text>
        </React.Fragment>
      );
    });
  }
}
export default Slice;
