import { ERROR, CLEAR_ERROR} from '../constants/actionTypes';

const errorReducer = (state = null, action) => {
  console.log(`${action.type}`);
  switch(action.type) {
    case ERROR:      
      return action.error;
    case CLEAR_ERROR:
      return null;
    default: return state;
  }
};

export default errorReducer;