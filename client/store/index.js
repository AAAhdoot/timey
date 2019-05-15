import { createStore, combineReducers, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import user from './user';
import ticket from './ticket';
import project from './project';
import d3data from './d3data';

const reducer = combineReducers({ user, ticket, project, d3data });
const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware, createLogger({ cosllapsed: true }))
);
const store = createStore(reducer, middleware);

export default store;
export * from './user';
export * from './ticket';
