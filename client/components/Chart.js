import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getProjectsThunk } from '../actions/project';
import { getProjectTicketsThunk } from '../actions/d3data';
import { scaleBand, scaleLinear } from 'd3-scale';
import Axes from './Axes';
import Bars from './Bars';
import ResponsiveWrapper from './ResponsiveWrapper';

class Chart extends Component {
  constructor() {
    super();
    this.xScale = scaleBand();
    this.yScale = scaleLinear();
  }

  componentDidMount() {
    this.props.loadTickets();
  }

  render() {
    console.log('tickets', this.props.tickets);
    const margins = { top: 50, right: 20, bottom: 100, left: 60 };
    const svgDimensions = {
      width: Math.max(this.props.parentWidth, 300),
      height: 500
    };
    let points = this.props.tickets.map(d => d.points);
    console.log('POINTS', points);
    const maxValue = Math.max(...points);
    console.log('MAXVALUE', maxValue);
    const xScale = this.xScale
      .padding(0.5)
      .domain(this.props.tickets.map(d => d.project))
      .range([margins.left, svgDimensions.width - margins.right]);

    const yScale = this.yScale
      .domain([0, maxValue])
      .range([svgDimensions.height - margins.bottom, margins.top]);
    if (maxValue > 0) {
      return (
        <svg width={svgDimensions.width} height={svgDimensions.height}>
          <Axes
            scales={{ xScale, yScale }}
            margins={margins}
            svgDimensions={svgDimensions}
          />
          <Bars
            scales={{ xScale, yScale }}
            margins={margins}
            data={this.props.tickets}
            maxValue={maxValue}
            svgDimensions={svgDimensions}
          />
        </svg>
      );
    } else {
      return <div>Component data is loading</div>;
    }
  }
}
const mapState = state => {
  return {
    email: state.user.email,
    projects: state.project.projects,
    tickets: state.d3data.tickets
  };
};
const mapDispatch = dispatch => ({
  // loadProjects: () => {
  //   dispatch(getProjectsThunk());
  // },
  loadTickets: () => {
    dispatch(getProjectTicketsThunk());
  }
});
const chartComponent = ResponsiveWrapper(Chart);
export default connect(mapState, mapDispatch)(chartComponent);
