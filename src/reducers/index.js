import { combineReducers } from 'redux';
import storyReducer from './story';
import archiveReducer from './archive';
import loaderReducer from './loader';
import queryStringReducer from './queryString';
import errorReducer from './error';

const rootReducer = combineReducers({
  storyState: storyReducer,
  archiveState: archiveReducer,
  loaderState: loaderReducer,
  errorState: errorReducer,
  queryStringState: queryStringReducer
});

export default rootReducer;