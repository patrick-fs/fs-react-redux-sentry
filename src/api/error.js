import * as Sentry from '@sentry/browser';

import FullStoryIntegration from '../integrations/FullStoryIntegration';

let didInit = false;
const initSentry = sentryDsn => {
  if (didInit) {
    console.warn(
      'initSentry has already been called once. Additional invocations are ignored.',
    );
    return;
  }
  Sentry.init({
    dsn: sentryDsn,
    integrations: [
      new FullStoryIntegration(
        process.env.REACT_APP_SENTRY_ORG,
        process.env.REACT_APP_SENTRY_PROJECT,
      ),
    ],
  });
  didInit = true;
};

const recordError = error => {
  if (!didInit)
    throw Error(
      'You must call initSentry once before calling recordError',
    );
  Sentry.captureException(error);
};

export default recordError;
export { initSentry };
