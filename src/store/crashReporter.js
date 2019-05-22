/* global FS */
import * as Sentry from '@sentry/browser';

const crashReporter = store => next => action => {
  //console.log(`crash reporter loaded with action: ${JSON.stringify(action)}`);

  // we got a thunk
  if (typeof action === 'function') {
    //console.log(`thunk dispatch with action ${action}`);
    const wrap = async (dispatch, getState, extraArgument) => {
      try {
        //console.log(`invoking wrap with params: ${dispatch}, ${getState} and action ${action} and  next: ${next}`);
        
        await action(dispatch, getState, extraArgument);
      } catch (e) {
        console.log(e);
      }
    }
    return next(wrap);
  }

  try {
    return next(action);
  } catch (err) {
    let sentryEventId;
    // Send replay URL to Sentry
    Sentry.withScope(scope => {
      // TODO: host an official FullStory package in npm so FS can be imported as a module
      if (window.FS && FS.getCurrentSessionURL) {
        scope.setExtra('fullstory', FS.getCurrentSessionURL(true));
      }      
      sentryEventId = Sentry.captureException(err);
    });

    console.log(`sentry event id: ${sentryEventId}`);

    // Send error to FullStory
    FS.event('Redux error', {
      error: {
        name: err.name,
        message: err.message,
        fileName: err.fileName,
        lineNumber: err.lineNumber,
        stack: err.stack,
        sentryEventId,
      },
      state: store.getState(), //NOTE: strip out any sensitive fields first
    });
    throw err;
  }
};

export default crashReporter;