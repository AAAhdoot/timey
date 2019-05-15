import React, { Component } from 'react';
import { connect } from 'react-redux';
import { scaleOrdinal } from 'd3-scale';
import * as d3 from 'd3';
import { getUsersOnProjectThunk } from '../actions/d3data';
import { getProjectThunk } from '../actions/project';
import { arc as d3Arc, pie as d3Pie } from 'd3-shape';
import Slice from './Slice';
import { Spinner } from 'reactstrap';

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
  componentDidUpdate() {
    this.calculatePosition();
  }
  calculatePosition() {
    width = window.innerWidth;
    height = window.innerHeight;
    minViewportSize = Math.min(width, height);

    radius = minViewportSize * 0.9 / 2;

    x = width / 2;
    y = height / 2;
  }

  render() {
    // let width = window.innerWidth;
    // let height = window.innerHeight;
    // let minViewportSize = Math.min(width, height);

    // let radius = minViewportSize * 0.9 / 2;

    // let x = width / 2;
    // let y = height / 2;
    const isLoading = this.props.isLoading;

    if (isLoading) {
      return <Spinner color="info" className="spinner" />;
    } else if (this.props.userdata.length) {
      let data = this.props.userdata.map(object => object.points);
      let totalPoints = data.reduce((current, next) => {
        return current + next;
      });

      let pie = d3.pie()(data);
      return (
        <React.Fragment>
          <h3 className="pie-chart-header">{this.props.project.name}</h3>
          <svg height="100vh" width="100%">
            <g transform={`translate(${x}, ${y})`}>
              <Slice
                pie={pie}
                x={x}
                y={y}
                totalPoints={totalPoints}
                radius={radius}
                cornerRadius={7}
                alldata={this.props.userdata}
              />
            </g>
          </svg>
        </React.Fragment>
      );
    } else {
      return (
        <div className="no-data-label">
          {' '}
          This projects tickets is not assigned any users
        </div>
      );
    }
  }
}
const mapStateToProps = state => {
  return {
    userdata: state.d3data.userdata,
    project: state.project.project,
    isLoading: state.d3data.isLoading
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
