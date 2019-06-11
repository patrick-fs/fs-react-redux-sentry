# Understanding React + Redux errors with Sentry and FullStory
[Sentry](https://sentry.io) is an error monitoring platform used by development teams around the world to identify when issues crop up in their applications. [FullStory](https://www.fullstory.com) lets development teams view user experience friction through the eyes of their users.

Sentry + FullStory arms development teams with an unprecedented ability to understand the details around the issues impacting their users.

## Searching Hacker News
The Search Hacker News React/Redux app example in this repo is based on [Robin Weiruch’s fantastic tutorial](https://www.robinwieruch.de/react-redux-tutorial/). There are a few differences from Robin’s original example:

1. [React Hooks](https://reactjs.org/docs/hooks-intro.html) are used instead of class components and lifecycle events.
2. [Redux-thunk](https://github.com/reduxjs/redux-thunk) is used for fetching stories from Hacker News rather than redux-saga.
3. This app is (deliberately) riddled with bugs :)

You can try out the Search Hacker News app [here](http://fs-redux-sentry.s3-website-us-east-1.amazonaws.com/) or you can clone this repo and `npm install` then `npm run start`. The code is built with [Create React App](https://github.com/facebook/create-react-app).

### Setting up FullStory
You’ll need a FullStory [Professional](https://www.fullstory.com/pricing/) account, though you can get a two-week free trial if you want to try out Sentry + FullStory cost-free. Once you’ve setup an account, update the `_fs_org` value in the [FullStory snippet](https://help.fullstory.com/using/recording-snippet) in [public/index.html](https://github.com/patrick-fs/fs-react-redux-sentry/blob/master/public/index.html):

```JavaScript
window['_fs_org'] = 'your org id here';
```

### Setting up Sentry
Sentry should be initialized as soon as possible during your application load up. In Search Hacker News, `Sentry.init` is called before the `App` component is loaded in [src/index.js](https://github.com/patrick-fs/fs-react-redux-sentry/blob/master/src/index.js).

```JSX
...
import * as Sentry from '@sentry/browser';

Sentry.init({ dsn: 'https://<your key>@sentry.io/<your project>' });

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

```
Once you are logged into Sentry, go [here](https://docs.sentry.io/platforms/javascript/react/) to find your `Sentry.init` statement (prefilled with your key and project values).

## How FullStory links with Sentry
FullStory’s [`FS.getCurrentSessionURL`](https://help.fullstory.com/develop-js/getcurrentsessionurl) API function retrieves a session replay URL for a particular moment in time. These URLs are deep links that can be shared with other tools and services. Session URLs are embedded into Sentry events using [Sentry scopes](https://docs.sentry.io/enriching-error-data/scopes/). When you put it all together it [looks like this](https://github.com/patrick-fs/fs-react-redux-sentry/blob/master/src/api/error.js):

```JavaScript
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
```

We’re also using the FullStory [custom events API](https://help.fullstory.com/develop-js/363565-fs-event-api-sending-custom-event-data-into-fullstory) to search in FullStory for users and sessions that experienced errors on the Search Hacker News app.

## All the things that can go wrong...

### Handling and reviewing errors in React components
React 16 introduced [Error Boundaries](https://reactjs.org/docs/error-boundaries.html) to handle exceptions thrown while rendering components.

There's a single error boundary in Search Hacker News surrounding the [`App`](https://github.com/patrick-fs/fs-react-redux-sentry/blob/master/src/components/App.js) component declaration:

```JSX
import React from 'react';
import './App.css';
import SearchStories from './SearchStories';
import Stories from './Stories';
import ErrorToast from './ErrorToast';
import ErrorBoundary from './ErrorBoundry';

const App = () => (
  <div className="app">
    <ErrorBoundary>
      <ErrorToast></ErrorToast>
      <div className="interactions">
        <SearchStories />
      </div>
      <Stories />
    </ErrorBoundary>
  </div>
);

export default App;
```

If you search for “Florida” an error is thrown from the [SearchStories](https://github.com/patrick-fs/fs-react-redux-sentry/blob/master/src/components/SearchStories.js) component (a poke at my home state).

[Sentry screen grab of error]

A FullStory session replay URL is included in the Sentry issue that deep links to the moment the issue was created.

[Sentry screen grab]

Clicking on this link allows you to see the user’s actions leading up to and following the error.

[Kap grab of FS replay]

### Handling errors in Redux action creators
Search for “break it.”
TODO: show sample code from https://github.com/patrick-fs/fs-react-redux-sentry/blob/master/src/actions/story.js

### Catching unhandled errors in action creators and reducers
Click “Archive” button. 
TODO: showcase middleware

