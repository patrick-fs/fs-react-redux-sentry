import { ERROR, CLEAR_ERROR } from '../constants/actionTypes';
import * as Sentry from '@sentry/browser';

const doError = (error) => {
  Sentry.captureException(error);
  return { type: ERROR,
    error,
  }
};

const doClearError = () => ({ type: CLEAR_ERROR });

export {
  doError,
  doClearError
};