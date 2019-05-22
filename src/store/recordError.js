/* global FS */
import { ERROR } from '../constants/actionTypes';
const FS = window.FS;

const recordError = store => next => action => {
  if (action.type === ERROR) {
    FS.event('Redux error', {
      error: {
        name: action.error.name,
        message: action.error.message,
        fileName: action.error.fileName,
        lineNumber: action.error.lineNumber,
        stack: action.error.stack,
        sentryEventId: action.error.sentryEventId,
      },
      state: store.getState(), //NOTE: strip out any sensitive fields first
    });
  }

  return next(action);
};

export default recordError;