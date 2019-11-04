import * as Sentry from '@sentry/browser';

import * as FullStory from '../api/fullstory';

class FullStoryIntegration {
  constructor(sentryOrg, sentryProject) {
    this.name = 'FullStoryIntegration';
    this.sentryOrg = sentryOrg;
    this.sentryProject = sentryProject;
  }

  setupOnce() {
    Sentry.addGlobalEventProcessor((event, hint) => {
      const self = Sentry.getCurrentHub().getIntegration(
        FullStoryIntegration,
      );
      // Run the integration ONLY when it was installed on the current Hub
      if (self) {
        // getCurrentSessionURL isn't available until after the FullStory script is fully bootstrapped.
        // If an error occurs before getCurrentSessionURL is ready, make a note in Sentry and move on.
        // More on getCurrentSessionURL here: https://help.fullstory.com/develop-js/getcurrentsessionurl
        event.contexts = {
          ...event.contexts,
          fullStory: {
            url:
              FullStory.getCurrentSessionURL(true) ||
              'current session URL API not ready',
          },
        };

        // FS.event is immediately ready even if FullStory isn't fully bootstrapped
        FullStory.event('Sentry Error', {
          sentryUrl: `https://sentry.io/organizations/${this.sentryOrg}/projects/${this.sentryProject}/events/${hint.event_id}/`,
        });
      }
      return event;
    });
  }
}

FullStoryIntegration.id = 'FullStoryIntegration';

export default FullStoryIntegration;
