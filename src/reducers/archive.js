import { STORY_ARCHIVE } from '../constants/actionTypes';

const applyArchiveStory = (state, action) =>
  [ ...state, action.id ];

function archiveReducer(state = [], action) {
  switch(action.type) {
    case STORY_ARCHIVE : {
      return applyArchiveStory(state, action);
    }
    default : return state;
  }
}

export default archiveReducer;