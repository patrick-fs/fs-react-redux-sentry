import * as Sentry from '@sentry/browser';
import * as FullStory from './fullstory';

const recordError = (error, extraInfo = null) => {
  Sentry.withScope(scope => {
    if (extraInfo) {
      scope.setExtras(extraInfo);
    }

    // send a deep link to a FullStory session at the moment the error was recorded
    scope.setExtra('fullstory', FullStory.getCurrentSessionURL(true));
    error.sentryEventId = Sentry.captureException(error);
  });

  FullStory.event('Application error', {
    name: error.name,
    message: error.message,
    fileName: error.fileName,
    lineNumber: error.lineNumber,
    stack: error.stack,
    sentryEventId: error.sentryEventId,
  });
}

export default recordError;