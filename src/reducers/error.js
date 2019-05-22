import { ERROR } from '../constants/actionTypes';

const errorReducer = (state = null, action) => {
  switch(action.type) {
    case ERROR:      
      return action.error;
    default: return state;
  }
};

export default errorReducer;