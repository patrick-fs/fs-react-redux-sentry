import * as Sentry from '@sentry/browser';
import * as FullStory from './fullstory';

let didInit = false;
const initSentry = (sentryKey, sentryProject) => {
  if (didInit) {
    console.warn('initSentry has already been called once. Additional invocations are ignored.');
    return;
  }
  didInit = true;
  Sentry.init({
    dsn: `https://${sentryKey}@sentry.io/${sentryProject}`,
    beforeSend(event, hint) {
      const error = hint.originalException;
      event.extra = event.extra || {};

      // getCurrentSessionURL isn't available until after the FullStory script is fully bootstrapped.
      // If an error occurs before getCurrentSessionURL is ready, make a note in Sentry and move on.
      // More on getCurrentSessionURL here: https://help.fullstory.com/develop-js/getcurrentsessionurl
      event.extra.fullstory = FullStory.getCurrentSessionURL(true) || 'current session URL API not ready';

      // FS.event is immediately ready even if FullStory isn't fully bootstrapped
      FullStory.event('Application error', {
        name: error.name,
        message: error.message,
        fileName: error.fileName,
        lineNumber: error.lineNumber,
        stack: error.stack,
        sentryEventId: hint.event_id,
      });
      
      return event;
    }
  });
}

const recordError = (error) => {
  if (!didInit) throw Error('You must call initSentry once before calling recordError');
  Sentry.captureException(error);
}

export default recordError;
export { initSentry };