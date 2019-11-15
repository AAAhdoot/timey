import axios from 'axios';
import * as ACTIONS from './action-types';
import history from '../history';
import socket from '../socket';

export const getProjects = projects => ({
  type: ACTIONS.GET_PROJECTS,
  projects
});
export const getProject = project => ({
  type: ACTIONS.GET_PROJECT,
  project
});

export const createProject = singleProject => ({
  type: ACTIONS.CREATE_PROJECT,
  project: singleProject
});

export const getUsers = users => ({
  type: ACTIONS.GET_USERS,
  users
});

export const addUser = user => ({
  type: ACTIONS.ADD_USER,
  user
});

export const updateColumnsThunk = (result, dest) => {
  return async dispatch => {
    try {
      console.log(destColumnId);
      const { data } = await axios.put(
        // draggableId is the ticketId
        `/api/tickets/${result.draggableId}/reorder`,
        {
          result,
          dest
        }
      );
    } catch (error) {
      console.log(error);
    }
  };
};

export const createProjectThunk = project => {
  return async dispatch => {
    try {
      const { data } = await axios.post('/api/projects', project);
      dispatch(createProject(data));
      history.push(`/projects/${data.id}`);
    } catch (err) {
      console.log(err);
    }
  };
};

export const getProjectsThunk = () => {
  return async dispatch => {
    try {
      const { data } = await axios.get('/api/projects');
      dispatch(getProjects(data));
    } catch (err) {
      console.log(err);
    }
  };
};

export const getProjectThunk = projectId => {
  return async dispatch => {
    try {
      const { data } = await axios.get(`/api/projects/${projectId}`);
      dispatch(getProject(data));
    } catch (err) {
      console.log(err);
    }
  };
};

export const getUsersThunk = id => async dispatch => {
  try {
    const { data } = await axios.get(`/api/projects/${id}/users`);
    dispatch(getUsers(data));
  } catch (error) {
    console.error(error);
  }
};

export const addUserThunk = (projectId, userId) => async dispatch => {
  try {
    const { data } = await axios.put(
      `/api/projects/${projectId}/adduser`,
      userId
    );
    console.log(data);
    // dispatch(addUser(data));
    socket.emit('new user', projectId);
    history.push(`/projects/${projectId}`);
  } catch (error) {
    console.error(error);
  }
};
