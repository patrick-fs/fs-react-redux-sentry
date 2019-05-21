import { STORIES_FETCH, STORIES_ADD } from '../constants/actionTypes';

function storyReducer(state = [], action) {
    switch(action.type) {
      case STORIES_ADD:
        return action.stories;
      default : return state;
    }
  }
  
  export default storyReducer;