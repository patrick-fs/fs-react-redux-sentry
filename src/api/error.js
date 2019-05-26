import * as Sentry from '@sentry/browser';
import * as FullStory from './fullstory';

const recordError = (error, extraInfo = null) => {
  Sentry.withScope(scope => {
    if (extraInfo) {
      scope.setExtras(extraInfo);
    }
    scope.setExtra('fullstory', FullStory.getCurrentSessionURL(true));
    error.sentryEventId = Sentry.captureException(error);
  });

  FullStory.event('Redux error', {
    name: error.name,
    message: error.message,
    fileName: error.fileName,
    lineNumber: error.lineNumber,
    stack: error.stack,
    sentryEventId: error.sentryEventId,
  });
}

export default recordError;