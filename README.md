# Understanding React + Redux errors with Sentry and FullStory
[Sentry](https://sentry.io) is an error monitoring platform used by many development teams to identify when issues crop up in their applications. [FullStory](https://www.fullstory.com) lets development teams view user experience friction through the eyes of their users.

Sentry + FullStory arms development teams with an unprecedented ability to understand the details around the issues impacting their users.

## Searching Hacker News
The Search Hacker News React + Redux app example in this repo is based on [Robin Weiruch’s fantastic tutorial](https://www.robinwieruch.de/react-redux-tutorial/). There are a few differences from Robin’s original example:

1. [React Hooks](https://reactjs.org/docs/hooks-intro.html) are used instead of class components and lifecycle events.
2. [Redux-thunk](https://github.com/reduxjs/redux-thunk) is used for fetching stories from Hacker News rather than redux-saga.
3. This app is riddled with bugs 🐞

You can try out the Search Hacker News app [here](http://fs-redux-sentry.s3-website-us-east-1.amazonaws.com/) or you can clone this repo and `npm install` then `npm run start`. The code is built with [Create React App](https://github.com/facebook/create-react-app).

### Setup
First, copy the file `.env_sample` to `.env`. You will need to fill in those values to set up Sentry and FullStory correctly.

You’ll need a [FullStory account](https://www.fullstory.com/pricing/) and a [Sentry account](https://sentry.io/signup/). Sentry and FullStory should be initialized as soon as possible during your application load up. In Search Hacker News, `initSentry` and `FullStory.init` are called before the [`App`](https://github.com/patrick-fs/fs-react-redux-sentry/blob/master/src/components/App.js) component is loaded in [src/index.js](https://github.com/patrick-fs/fs-react-redux-sentry/blob/master/src/index.js).

```JSX
...
import { initSentry } from './api/error';
import * as FullStory from '@fullstorydev/browser';

FullStory.init({ orgId: process.env.REACT_APP_FULLSTORY_ORG });

initSentry({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  org: process.env.REACT_APP_SENTRY_ORG,
});


ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

```
Once you are logged into Sentry, go [here](https://docs.sentry.io/platforms/javascript/react/) to find your `Sentry.init` statement (prefilled with your Sentry `dsn` value). Copy that value into the `REACT_APP_SENTRY_DSN` field in your `.env` file. Next, find the slug of your organization from the URL of your Sentry account. Example: `https://sentry.io/organizations/fullstory/` where `fullstory` would be the organization slug. Copy that value into `REACT_APP_SENTRY_ORG` in your `.env` file.

Once you're logged into FullStory, you can find your org id in the [settings page](https://app.fullstory.com/ui/1ENq/settings/general). It will be the value set for `window['_fs_org']`. Copy that value into `REACT_APP_FULLSTORY_ORG` of your `.env` file.

## How FullStory links with Sentry
FullStory’s [`FS.getCurrentSessionURL`](https://developer.fullstory.com/current-session-url) API function generates a session replay URL for a particular moment in time. These URLs are deep links that can be shared with other tools and services. Session URLs are embedded into Sentry events when [extra context](https://docs.sentry.io/enriching-error-data/context/?platform=javascript#extra-context) is configured by providing a value for `event.contexts.fullstory` in the [beforeSend](https://docs.sentry.io/error-reporting/configuration/filtering/?platform=javascript#before-send) hook. The [Sentry-FullStory](https://github.com/getsentry/sentry-fullstory) integration package puts it all together.

```JavaScript
import * as Sentry from '@sentry/browser';
import FullStoryIntegration from '@sentry/fullstory';

let didInit = false;
const initSentry = ({ dsn, org }) => {
  if (didInit) {
    console.warn(
      'initSentry has already been called once. Additional invocations are ignored.',
    );
    return;
  }
  Sentry.init({
    dsn,
    integrations: [new FullStoryIntegration(org)],
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
```


## All the things that can go wrong...

### Handling errors in React components
React 16 introduced [Error Boundaries](https://reactjs.org/docs/error-boundaries.html) to handle exceptions thrown while rendering components. Error Boundaries will capture errors thrown from any component nested within them. All child components of the [`App`](https://github.com/patrick-fs/fs-react-redux-sentry/blob/master/src/components/App.js) component are wrapped in an Error Boundary, which means errors in any component will be handled.

```JSX
import React from 'react';
import './App.css';
import SearchStories from './SearchStories';
import Stories from './Stories';
import ErrorToast from './ErrorToast';
import ErrorBoundary from './ErrorBoundry';

const App = () => (
  <ErrorBoundary>
    <div className="app">
      <ErrorToast></ErrorToast>
      <div className="interactions">
        <SearchStories />
      </div>
      <Stories />
    </div>
  </ErrorBoundary>
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
[`recordError`](https://github.com/patrick-fs/fs-react-redux-sentry/blob/master/src/api/error.js) is invoked in `componentDidCatch`, sending error data to Sentry along with a FullStory session replay URL.

#### No offense fellow Floridians
If you search for “Florida” an error is thrown from the [SearchStories](https://github.com/patrick-fs/fs-react-redux-sentry/blob/master/src/components/SearchStories.js) component (a poke at my home state). Sentry captures the stack trace and highlights the line of code that threw the error:

![image](https://user-images.githubusercontent.com/45576380/59303785-f06ffc80-8c64-11e9-9927-49b90f9b7381.png)

A FullStory session replay URL is included in the Sentry issue that deep links to the moment _just before_ the error occurs.

![image](https://user-images.githubusercontent.com/45576380/59945068-6f6aef00-9434-11e9-9b81-ee9a7bc8bbb6.png)

Clicking on this link lets you see the user’s actions leading up to and following the error in a FullStory session replay. In this example, we see our user type the unsearchable term ("Florida") into the search box and submit before they see the Error Boundary screen. The "Application Error" event is visible in the event stream on the right-hand side of the screen.

![Hacker_News_Florida_Error](https://user-images.githubusercontent.com/45576380/59942536-f7012f80-942d-11e9-83ba-bdab6c75d8c7.gif)

### Handling errors in Redux action creators
Action creator functions are another likely source of errors if you're performing side-effects and dispatching other actions. The integration with the Hacker News API occurs in the [story action creator](https://github.com/patrick-fs/fs-react-redux-sentry/blob/master/src/actions/story.js)...

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
...which dispatches the caught exception to a [`doError`](https://github.com/patrick-fs/fs-react-redux-sentry/blob/master/src/actions/error.js) action creator that calls [`recordError`](https://github.com/patrick-fs/fs-react-redux-sentry/blob/master/src/api/error.js).
```JavaScript
import { ERROR, CLEAR_ERROR } from '../constants/actionTypes';
import recordError from '../api/error';

const doError = (error) => {
  recordError(error);
  return { type: ERROR,
    error,
  }
};

const doClearError = () => ({ type: CLEAR_ERROR });

export {
  doError,
  doClearError
};
```

Type "break it" into the search field to trigger yet another contrived error :)

### Catching unhandled errors in action creators and reducers
What if an action creator or reducer _forgets_ to handle errors appropriately? [Redux Middleware](https://redux.js.org/advanced/middleware) can help. The Search Headline News app includes a [`crashReporter`](https://github.com/patrick-fs/fs-react-redux-sentry/blob/master/src/store/crashReporter.js) middleware that will catch unhandled exceptions thrown from thunk action creators (action creators like [`src/actions/story.js`](https://github.com/patrick-fs/fs-react-redux-sentry/blob/master/src/actions/story.js) that return a function) and any reducer.

```JavaScript
import { doError } from '../actions/error';

const crashReporter = store => next => action => {
  // we got a thunk, prep it to be handled by redux-thunk middleware
  if (typeof action === 'function') {
    // wrap it in a function to try/catch the downstream invocation
    const wrapAction = fn => (dispatch, getState, extraArgument) => {
      try {
        fn(dispatch, getState, extraArgument);
      } catch (e) {
        dispatch(doError(e));
      }
    }
    // send wrapped function to the next middleware
    // this should be upstrem from redux-thunk middleware
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

This middleware will capture any uncaught reducer errors as well as any action creator error thrown from a thunk. Uncaught exceptions thrown from plain action creators will not be caught by [`crashReporter`](https://github.com/patrick-fs/fs-react-redux-sentry/blob/master/src/store/crashReporter.js).

You can greatly simplify this code by removing redux-thunk and handling the thunk on your own. See [this issue](https://github.com/patrick-fs/fs-react-redux-sentry/issues/1) for an explanation of how to do this.

### Uncaught error notifications

Ideally, all exceptions are caught and handled appropriately to provide proper user feedback. Using [`crashReporter`](https://github.com/patrick-fs/fs-react-redux-sentry/blob/master/src/store/crashReporter.js) will help in case a `try/catch` statement was left out in certain situations, but there are types of unhandled exceptions that middleware can't catch. 

These include unhandled exceptions thrown from:

* action creators that aren't thunks
* event handlers in React components (`onClick`, `onSubmit`, etc.)
* `setTimeout` or `setInterval`

There's no way to report back to users that something went wrong when unhandled exceptions occur in these scenarios, but because Sentry shims the global [`onerror`](https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onerror) event handler, you *will* receive an error alert with a FullStory session replay URL as well as a FullStory custom event whenever an uncaught JavaScript runtime error occurs. All of this is taken care of in the `initSentry` function in the [error API](https://github.com/patrick-fs/fs-react-redux-sentry/blob/master/src/api/error.js) module.

## Monitor, Alert, Watch, Fix
Bug-awareness is the critical first step in maintaining quality in your applications. Sentry let's you know that your users may be feeling pain. FullStory shows you exactly _what_ they are doing in those moments before an error strikes and gives you the complete picture you need to remediate issues as fast as possible.
