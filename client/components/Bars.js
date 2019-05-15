import React, { Component } from 'react';
import { scaleLinear } from 'd3-scale';
import { interpolateLab } from 'd3-interpolate';

export default class Bars extends Component {
  constructor(props) {
    super(props);
    console.log('maxvalue', this.props.maxValue);
    this.colorScale = scaleLinear()
      .domain([0, this.props.maxValue])
      .range(['#F3E5F5', '#7B1FA2'])
      .interpolate(interpolateLab);
  }

  render() {
    const { scales, margins, data, svgDimensions } = this.props;
    const { xScale, yScale } = scales;
    const { height } = svgDimensions;

    const bars = data.map(ticket => (
      <rect
        key={ticket.id}
        x={xScale(ticket.project)}
        y={yScale(ticket.points)}
        height={height - margins.bottom - scales.yScale(ticket.points)}
        width={xScale.bandwidth()}
        fill={this.colorScale(ticket.points)}
      />
    ));

    return <g>{bars}</g>;
  }
}
