import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Login, Signup, UserHome, ProjectBoard } from './components';
import { me } from './store';
import CreateTicket from './components/CreateTicket';
import CreateProject from './components/CreateProject';
import TimeSheet from './components/TimeSheet';

import Projects from './components/Projects';
import AddUserToProject from './components/AddUserToProject';
import Chart from './components/Chart';
import PieChart from './components/PieChart';
import NotFound from './components/NotFound';
import AuthForm from './components/auth-form';

/**
 * COMPONENT
 */
class Routes extends Component {
  componentDidMount() {
    this.props.loadInitialData();
  }

  render() {
    const { isLoggedIn } = this.props;

    return (
      <Switch>
        {/* Routes placed here are available to all visitors */}
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        {isLoggedIn && (
          <Switch>
            {/* Routes placed here are only available after logging in */}
            <Route exact path="/newproject" component={CreateProject} />
            <Route path="/home" component={UserHome} />
            <Route path="/projects/:id/newticket" component={CreateTicket} />
            <Route path="/projects/:id/adduser" component={AddUserToProject} />
            <Route exact path="/projects/:id" component={ProjectBoard} />
            <Route exact path="/timesheet" component={TimeSheet} />
            <Route exact path="/projects/:id" component={ProjectBoard} />
            <Route exact path="/projects/user/tables" component={Chart} />
            <Route exact path="/projects/:id/ticketdata" component={PieChart} />
            <Route component={Projects} />
            <Route exact path="/" component={Projects} />
            <Route exact path="/projects" component={Projects} />
            <Route path="*" component={NotFound} />
          </Switch>
        )}
        {/* Displays our Login component as a fallback */}
      </Switch>
    );
  }
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    // Being 'logged in' for our purposes will be defined has having a state.user that has a truthy id.
    // Otherwise, state.user will be an empty object, and state.user.id will be falsey
    isLoggedIn: !!state.user.id
  };
};

const mapDispatch = dispatch => {
  return {
    loadInitialData() {
      dispatch(me());
    }
  };
};

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(Routes));

/**
 * PROP TYPES
 */
Routes.propTypes = {
  loadInitialData: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
};
