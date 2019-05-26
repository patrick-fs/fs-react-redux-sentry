import { ERROR } from '../constants/actionTypes';
import * as FullStory from '../api/fullstory';

const recordAction = () => next => action => {
  FullStory.log(`${action.type === ERROR ? 'error': 'log'}`, `Redux action: ${action.type}`);
  return next(action);
};

export default recordAction;