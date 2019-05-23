import { ERROR, CLEAR_ERROR } from '../constants/actionTypes';
import recordError from '../api/error';

const doError = (error) => {
  recordError(error);
  return { type: ERROR,
    error,
  }
};

const doClearError = () => ({ type: CLEAR_ERROR });

export {
  doError,
  doClearError
};