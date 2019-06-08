import { SAVE_QUERY, LOAD_QUERY } from '../constants/actionTypes';

function queryReducer(state = '', action) {
  switch (action.type) {
    case LOAD_QUERY:
    case SAVE_QUERY:
      return action.query;
    default: return state;
  }
}

export default queryReducer;