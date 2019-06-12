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
FullStory’s [`FS.getCurrentSessionURL`](https://help.fullstory.com/develop-js/getcurrentsessionurl) API function retrieves a session replay URL for a particular moment in time. These URLs are deep links that can be shared with other tools and services. Session URLs are embedded into Sentry events using [Sentry scopes](https://docs.sentry.io/enriching-error-data/scopes/). The [`recordError`](https://github.com/patrick-fs/fs-react-redux-sentry/blob/master/src/api/error.js) function puts it all together.

```JavaScript
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

  // send error data into FullStory to find any user who experienced errors
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

We’re also using the FullStory [custom events API](https://help.fullstory.com/develop-js/363565-fs-event-api-sending-custom-event-data-into-fullstory) to send error data into FullStory. This lets us search for all users that experienced errors on the Search Hacker News app.

## All the things that can go wrong...

### Handling and reviewing errors in React components
React 16 introduced [Error Boundaries](https://reactjs.org/docs/error-boundaries.html) to handle exceptions thrown while rendering components.

There's a single error boundary in Search Hacker News nested within the [`App`](https://github.com/patrick-fs/fs-react-redux-sentry/blob/master/src/components/App.js) component declaration:

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

This is our [ErrorBoundry component](https://github.com/patrick-fs/fs-react-redux-sentry/blob/master/src/components/ErrorBoundry.js) definition:

```JSX
import React, { Component } from 'react';
import recordError from '../api/error';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, eventId: null };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error });
    recordError(error, errorInfo);
  }

  render() {
    if (this.state.error) {
      //render fallback UI
      return (
        <div className="error">
          <h1>Something bad happened and we've been notified</h1>
          <p>In the mean time, search for <a href="/?query=happiness">happiness</a></p>
        </div>
      );
    } else {
      //when there's not an error, render children untouched
      return this.props.children;
    }
  }
}

export default ErrorBoundary;
```
[`recordError`](https://github.com/patrick-fs/fs-react-redux-sentry/blob/master/src/api/error.js) is invoked in `componentDidCatch`, which sends the error data to Sentry with a session reply URL.

#### No offense fellow Floridians
If you search for “Florida” an error is thrown from the [SearchStories](https://github.com/patrick-fs/fs-react-redux-sentry/blob/master/src/components/SearchStories.js) component (a poke at my home state). This is what the error looks like in Sentry:

![image](https://user-images.githubusercontent.com/45576380/59303785-f06ffc80-8c64-11e9-9927-49b90f9b7381.png)

A FullStory session replay URL is included in the Sentry issue that deep links to the moment the issue was created.

![image](https://user-images.githubusercontent.com/45576380/59303911-36c55b80-8c65-11e9-8541-9dd199610151.png)

Clicking on this link allows you to see the user’s actions leading up to and following the error in a FullStory session replay.

![Hacker_News_Florida_Error](https://user-images.githubusercontent.com/45576380/59304453-4d1fe700-8c66-11e9-91ba-20917053184b.gif)

### Handling errors in Redux action creators
Action creator functions are another likely source of errors, especially if you're performing side-effects and dispatching other actions. The integration with the Hacker News API occurs in the [story action creator](https://github.com/patrick-fs/fs-react-redux-sentry/blob/master/src/actions/story.js)

```JavaScript
import { STORIES_ADD } from '../constants/actionTypes';
import { doBeginLoad, doEndLoad } from './loader';
import { doError } from './error';
import fetchStories from '../api/storys';

const doAddStories = stories => ({
  type: STORIES_ADD,
  stories,
});

const doFetchStoriesAsync = query => async dispatch => {
  dispatch(doBeginLoad());
  try {
    if (query === 'break it') throw new Error('Broken on demand!');
    const response = await fetchStories(query);
    dispatch(doAddStories(response.hits));
  } catch (err) {
    dispatch(doError(err));
  }
  dispatch(doEndLoad());  
};

export {
  doAddStories,
  doFetchStoriesAsync,
};
```
Type "break it" into the search field to trigger yet another contrived error :)

### Catching unhandled errors in action creators and reducers
What if an action creator or reducer _forgets_ to handle errors appropriately? [Redux Middleware](https://redux.js.org/advanced/middleware) can help. The Search Headline News app includes a [`crashReporter`](https://github.com/patrick-fs/fs-react-redux-sentry/blob/master/src/store/crashReporter.js) middleware that will catch unhandled exceptions thrown from thunk action creators (action creators that return a function like [`src/actions/story.js`](https://github.com/patrick-fs/fs-react-redux-sentry/blob/master/src/actions/story.js)) and any reducer.

```JavaScript
import { doError } from '../actions/error';

const crashReporter = store => next => action => {
  // we got a thunk
  if (typeof action === 'function') {
    // wrap it in a function to try/catch the downstream invocation
    const wrapAction = fn => async (dispatch, getState, extraArgument) => {
      try {
        await fn(dispatch, getState, extraArgument);
      } catch (e) {
        dispatch(doError(e));
      }
    }
    // send wrapped function to the next middleware
    // this should be upstream from redux-thunk middleware
    return next(wrapAction(action));
  }
  
  try {
    return next(action);
  } catch (e) {
      store.dispatch(doError(e));
  }
};

export default crashReporter;
```

When you click the "Archive" button, a thunk action creator is dispatched and an unhandled exception is thrown, to be caught and handled by the [`crashReporter`](https://github.com/patrick-fs/fs-react-redux-sentry/blob/master/src/store/crashReporter.js) middleware.

This middleware will capture any uncaught reducer errors as well as any action creator error thrown from a thunk. Unaught exceptions thrown from plain action creators will not be caught by this middleware.

## Monitor, Alert, Watch, Fix
Bug-awareness is the critical first step in maintaining quality in your applications. Sentry let's you know that your users may be feeling pain. FullStory shows you exactly _what_ they are doing in those moments before an error strikes and gives you the complete picture you need to remediate issues as fast as possible.