import React, { Component } from 'react';
import { connect } from 'react-redux';
import { scaleOrdinal } from 'd3-scale';
import * as d3 from 'd3';
import { getUsersOnProjectThunk } from '../actions/d3data';
import { getProjectThunk } from '../actions/project';
import { arc as d3Arc, pie as d3Pie } from 'd3-shape';
import Slice from './Slice';

let width;
let height;
let minViewportSize;
let radius;
let x;
let y;
class PieChart extends Component {
  componentDidMount() {
    this.calculatePosition();
    this.props.getUsersOnProj();
    this.props.getProject();
    window.addEventListener('resize', this.calculatePosition);
  }
  componentDidUpdate(prevProps) {
    console.log('PREVPROPS INSIDE PIECHART', prevProps);
    this.calculatePosition();
  }
  calculatePosition() {
    console.log('THIS IS GETTING CALLED');
    width = window.innerWidth;
    height = window.innerHeight;
    minViewportSize = Math.min(width, height);

    radius = minViewportSize * 0.9 / 2;

    x = width / 2;
    y = height / 2;
    console.log('x', x);
    console.log('y', y);
  }

  render() {
    // let width = window.innerWidth;
    // let height = window.innerHeight;
    // let minViewportSize = Math.min(width, height);

    // let radius = minViewportSize * 0.9 / 2;

    // let x = width / 2;
    // let y = height / 2;

    if (this.props.userdata.length) {
      let data = this.props.userdata.map(object => object.points);
      console.log('DATA!!!', data);
      let pie = d3.pie()(data);
      return (
        <svg height="100vh" width="100%">
          <g transform={`translate(${x}, ${y})`}>
            <Slice
              pie={pie}
              x={x}
              y={y}
              radius={radius}
              cornerRadius={7}
              alldata={this.props.userdata}
            />
          </g>
        </svg>
      );
    } else {
      return <div>were waiting for data</div>;
    }
  }
}
const mapStateToProps = state => {
  return {
    userdata: state.d3data.userdata,
    project: state.project.project
  };
};
const mapDispatchToProps = (dispatch, ownProps) => {
  const projectId = ownProps.match.params.id;
  return {
    getProject: () => {
      dispatch(getProjectThunk(projectId));
    },
    getUsersOnProj: () => {
      dispatch(getUsersOnProjectThunk(projectId));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PieChart);
