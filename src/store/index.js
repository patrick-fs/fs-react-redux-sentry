import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import recordAction from './recordAction';
import crashReporter from './crashReporter';
import rootReducer from '../reducers';

const store = createStore(
  rootReducer,
  undefined,
  applyMiddleware(recordAction, crashReporter, thunk)
);

export default store;