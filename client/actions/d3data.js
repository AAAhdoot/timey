import axios from 'axios';
import * as ACTIONS from './action-types';
import history from '../history';
import socket from '../socket';
import { d3DataObject, d3PieChartData } from '../utils';

export const getProjectTickets = payload => ({
  type: ACTIONS.GET_PROJECT_TICKETS,
  payload
});

export const getUsersOnProject = payload => ({
  type: ACTIONS.GET_USERS_ON_PROJECT,
  payload
});

export const getProjectTicketsThunk = () => {
  return async dispatch => {
    try {
      const { data: tickets } = await axios.get(`/api/projects/user/tickets`);
      let formatedData = d3DataObject(tickets);
      console.log('formatedData', formatedData);
      dispatch(getProjectTickets(formatedData));
    } catch (error) {
      console.log(error);
    }
  };
};

export const getUsersOnProjectThunk = projectId => {
  return async dispatch => {
    try {
      const { data: tickets } = await axios.get(
        `/api/projects/${projectId}/ticketdata`
      );
      let formatedData = d3PieChartData(tickets);
      console.log('formatedData', formatedData);
      dispatch(getUsersOnProject(formatedData));
    } catch (error) {
      console.log(error);
    }
  };
};
