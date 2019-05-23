import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import recordAction from './recordAction';
import rootReducer from '../reducers';

const store = createStore(
  rootReducer,
  undefined,
  applyMiddleware(recordAction, thunk)
);

export default store;