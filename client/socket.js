import io from 'socket.io-client';
import store from './store';
import {
  createTicket,
  deleteTicket,
  reorderTickets,
  updateTicket,
  createColumn,
  deleteColumn,
  updateColumn
} from './actions/ticket';

const socket = io(window.location.origin);

socket.on('connect', () => {
  console.log('Connected!');
});

socket.on('new ticket', ticket => {
  store.dispatch(createTicket(ticket));
});

socket.on('remove ticket', ticket => {
  store.dispatch(deleteTicket(ticket));
});

socket.on('reorder', columns => {
  store.dispatch(reorderTickets(columns));
});

socket.on('update ticket', ticket => {
  store.dispatch(updateTicket(ticket));
});

socket.on('new column', column => {
  store.dispatch(createColumn(column));
});

socket.on('update column', column => {
  store.dispatch(updateColumn(column));
});

socket.on('remove column', column => {
  store.dispatch(deleteColumn(column));
});

export default socket;
