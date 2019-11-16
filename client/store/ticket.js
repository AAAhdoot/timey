/* eslint-disable no-case-declarations */
/* eslint-disable complexity */

import * as ACTIONS from '../actions/action-types';
import { createTicketsObject, generateNewColumnsLL } from '../utils';

const initialState = {
  ticket: {},
  allTickets: [],
  allTicketsObject: {},
  llColumns: {}
};

export default function(state = initialState, action) {
  const newState = { ...state };
  switch (action.type) {
    case ACTIONS.CREATE_TICKET:
      newState.allTicketsObject = {
        ...newState.allTicketsObject,
        [action.ticket.id]: action.ticket
      };
      newState.allTickets = [...newState.allTickets, action.ticket];
      newState.llColumns[action.ticket.columnId].taskIds = [
        ...newState.llColumns[action.ticket.columnId].taskIds,
        action.ticket.id
      ];
      newState.ticket = action.ticket;
      return newState;
    case ACTIONS.GET_TICKETS:
      newState.allTickets = action.payload.tickets;
      newState.allTicketsObject = createTicketsObject(newState.allTickets);
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
      console.log(action.payload);
      newState.llColumns = action.payload;
      return newState;
    case ACTIONS.REMOVE_TICKET:
      newState.allTickets = newState.allTickets.filter(
        ticket => ticket.id !== action.ticket.id
      );
      newState.llColumns[action.ticket.columnId].taskIds = newState.llColumns[
        action.ticket.columnId
      ].taskIds.filter(id => id !== action.ticket.id);

      newState.allTicketsObject = Object.assign({}, newState.allTicketsObject);
      delete newState.allTicketsObject[action.ticket.id];
      newState.ticket = {};
      return newState;
    default:
      return state;
  }
}
