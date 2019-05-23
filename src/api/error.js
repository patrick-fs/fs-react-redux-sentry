/* global FS */
import * as Sentry from '@sentry/browser';

const hasFullStory = () => {
  // TODO: host an official FullStory package in npm so FS can be imported as a module
  return window.FS && FS.getCurrentSessionURL;
}

const recordError = error => {
  Sentry.withScope(scope => {
    if (hasFullStory()) {
      scope.setExtra('fullstory', FS.getCurrentSessionURL(true));
    }      
    error.sentryEventId = Sentry.captureException(error);
  });

  if (hasFullStory()) {
    FS.event('Redux error', {
      name: error.name,
      message: error.message,
      fileName: error.fileName,
      lineNumber: error.lineNumber,
      stack: error.stack,
      sentryEventId: error.sentryEventId,
    });
  }
}

export default recordError;