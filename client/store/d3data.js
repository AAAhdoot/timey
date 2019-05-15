import * as ACTIONS from '../actions/action-types';

const initialState = {
  tickets: [],
  userdata: []
};

export default function(state = initialState, action) {
  const newState = { ...state };
  switch (action.type) {
    case ACTIONS.GET_PROJECT_TICKETS:
      newState.tickets = action.payload;
      return newState;
    case ACTIONS.GET_USERS_ON_PROJECT:
      newState.userdata = action.payload;
      return newState;
    default:
      return state;
  }
}
