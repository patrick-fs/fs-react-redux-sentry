import { SAVE_QUERY, LOAD_QUERY } from '../constants/actionTypes';
const QUERY_KEY = 'query';

function localStorageReducer(state = '', action) {
  switch (action.type) {
    case SAVE_QUERY:
      try {
        localStorage.setItem(QUERY_KEY, action.query);
      } catch (e) {
        throw e;
      }
      return action.query;
    case LOAD_QUERY:
      try {
        return localStorage.getItem(QUERY_KEY);
      } catch(e) {
        throw e;
      }
    default: return state;
  }
}

export default localStorageReducer;