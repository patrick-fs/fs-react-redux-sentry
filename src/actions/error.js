/* global FS */
import { ERROR, CLEAR_ERROR } from '../constants/actionTypes';
import * as Sentry from '@sentry/browser';

const doError = (error) => {
  console.log('in do error');
  Sentry.withScope(scope => {
    // TODO: host an official FullStory package in npm so FS can be imported as a module
    if (window.FS && FS.getCurrentSessionURL) {
      scope.setExtra('fullstory', FS.getCurrentSessionURL(true));
    }      
    error.sentryEventId = Sentry.captureException(error);
  });

  return { type: ERROR,
    error,
  }
};

const doClearError = () => ({ type: CLEAR_ERROR });

export {
  doError,
  doClearError
};