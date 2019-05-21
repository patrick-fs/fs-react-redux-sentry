import { BEGIN_LOAD, END_LOAD } from '../constants/actionTypes';

const loaderReducer = (state = false, action) => {
  switch(action.type) {
    case BEGIN_LOAD:
      return true;
    case END_LOAD:
      return false;
    default: return state;
  }
};

export default loaderReducer;