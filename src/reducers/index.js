import { combineReducers } from 'redux';
import storyReducer from './story';
import archiveReducer from './archive';
import loaderReducer from './loader';

const rootReducer = combineReducers({
  storyState: storyReducer,
  archiveState: archiveReducer,
  loaderState: loaderReducer,
});

export default rootReducer;