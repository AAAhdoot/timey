import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getProjectsThunk } from '../actions/project';
import { Link } from 'react-router-dom';
import Project from './Projects';
/**
 * COMPONENT
 */
class UserHome extends Component {
  componentDidMount() {
    this.props.loadProjects();
  }

  render() {
    const userProjects = this.props.projects;
    return (
      <div>
        <div>
          <h3>Welcome, {this.props.email}</h3>
        </div>
        <Project />
      </div>
    );
  }
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    email: state.user.email,
    projects: state.project.projects
  };
};
const mapDispatch = dispatch => ({
  loadProjects: () => {
    dispatch(getProjectsThunk());
  }
});
export default connect(mapState, mapDispatch)(UserHome);

/**
 * PROP TYPES
 */
UserHome.propTypes = {
  email: PropTypes.string
};
