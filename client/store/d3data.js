import * as ACTIONS from '../actions/action-types';

const initialState = {
  tickets: [],
  userdata: [],
  isLoading: false
};

export default function(state = initialState, action) {
  const newState = { ...state };
  switch (action.type) {
    case ACTIONS.LOADING_CHART_DATA:
      newState.isLoading = true;
      return newState;
    case ACTIONS.GET_PROJECT_TICKETS:
      newState.tickets = action.payload;
      newState.isLoading = false;
      return newState;
    case ACTIONS.GET_USERS_ON_PROJECT:
      newState.userdata = action.payload;
      newState.isLoading = false;
      return newState;
    default:
      return state;
  }
}
