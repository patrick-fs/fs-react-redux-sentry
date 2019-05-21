import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';

const logger = createLogger();

const store = createStore(
  rootReducer,
  undefined,
  applyMiddleware(thunk, logger)
);

export default store;