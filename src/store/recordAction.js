/* global FS */
import { ERROR } from '../constants/actionTypes';
const FS = window.FS;

const recordAction = () => next => action => {
  FS.log(`${action.type === ERROR ? 'error': 'log'}`, `Redux action: ${action.type}`);
  return next(action);
};

export default recordAction;