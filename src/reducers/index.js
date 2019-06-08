import { combineReducers } from 'redux';
import storyReducer from './story';
import archiveReducer from './archive';
import loaderReducer from './loader';
import queryReducer from './query';
import errorReducer from './error';

const rootReducer = combineReducers({
  storyState: storyReducer,
  archiveState: archiveReducer,
  loaderState: loaderReducer,
  errorState: errorReducer,
  queryState: queryReducer
});

export default rootReducer;