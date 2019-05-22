import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import recordError from './recordError';
import rootReducer from '../reducers';

const logger = createLogger();

const store = createStore(
  rootReducer,
  undefined,
  applyMiddleware(recordError, thunk, logger)
);

export default store;