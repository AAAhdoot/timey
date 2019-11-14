/* eslint-disable no-case-declarations */
/* eslint-disable complexity */

import * as ACTIONS from '../actions/action-types';
import {
  createTicketsObject,
  generateNewColumns,
  generateNewColumnsLL
} from '../utils';

const initialState = {
  to_do: [],
  in_progress: [],
  in_review: [],
  done: [],
  ticket: {},
  allTickets: [],
  allTicketsObject: {},
  columns: {},
  llColumns: {}
};

export default function(state = initialState, action) {
  const newState = { ...state };
  console.log('action: ', action.payload);
  switch (action.type) {
    case ACTIONS.CREATE_TICKET:
      newState.allTicketsObject = {
        ...newState.allTicketsObject,
        [action.ticket.id]: action.ticket
      };
      newState.allTickets = [...newState.allTickets, action.ticket];
      newState.to_do = [...newState.to_do, action.ticket.id];
      newState.columns[action.ticket.status].taskIds = [
        ...newState.columns[action.ticket.status].taskIds,
        action.ticket.id
      ];
      newState.ticket = action.ticket;
      return newState;
    case ACTIONS.GET_TICKETS:
      newState.allTickets = action.payload.tickets;
      newState.to_do = action.payload.to_do.map(x => x.id);
      newState.in_progress = action.payload.in_progress.map(x => x.id);
      newState.in_review = action.payload.in_review.map(x => x.id);
      newState.done = action.payload.done.map(x => x.id);
      newState.allTicketsObject = createTicketsObject(newState.allTickets);
      newState.columns = generateNewColumns(newState);
      newState.llColumns = generateNewColumnsLL(action.payload.llResult);
      newState.ticket = {};
      return newState;
    case ACTIONS.UPDATE_TICKET:
      newState.allTickets = newState.allTickets.map(ticket => {
        if (ticket.id === action.ticket.id) {
          return action.ticket;
        } else {
          return ticket;
        }
      });
      newState.allTicketsObject = {
        ...newState.allTicketsObject,
        [action.ticket.id]: action.ticket
      };
      newState.ticket = action.ticket;
      return newState;
    case ACTIONS.REORDER_TICKETS:
      // newState.to_do = action.payload['to_do'].taskIds;
      // newState.in_progress = action.payload['in_progress'].taskIds;
      // newState.in_review = action.payload['in_review'].taskIds;
      // newState.done = action.payload['done'].taskIds;
      // newState.columns = generateNewColumns(newState); // possibly just reassign the one/two affected columns instead of all of them
      newState.llColumns = action.payload;
      return newState;
    case ACTIONS.REMOVE_TICKET:
      newState.allTickets = newState.allTickets.filter(
        ticket => ticket.id !== action.ticket.id
      );

      newState[action.ticket.status] = newState[action.ticket.status].filter(
        id => id !== action.ticket.id
      );

      newState.columns[action.ticket.status].taskIds = newState.columns[
        action.ticket.status
      ].taskIds.filter(id => id !== action.ticket.id);

      newState.allTicketsObject = Object.assign({}, newState.allTicketsObject);
      delete newState.allTicketsObject[action.ticket.id];
      newState.ticket = {};
      return newState;
    default:
      return state;
  }
}
