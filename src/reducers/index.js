import { combineReducers } from 'redux';
import storyReducer from './story';
import archiveReducer from './archive';
import loaderReducer from './loader';
import localstorageReducer from './localStorage';

const rootReducer = combineReducers({
  storyState: storyReducer,
  archiveState: archiveReducer,
  loaderState: loaderReducer,
  localStorageState: localstorageReducer,
});

export default rootReducer;