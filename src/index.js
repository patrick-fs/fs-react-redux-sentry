import React from 'react';
import ReactDOM from 'react-dom';
import store from './store';
import { Provider } from 'react-redux';
import App from './components/App';
import './index.css';
import * as serviceWorker from './serviceWorker';
import * as FullStory from '@fullstory/browser';
import * as Sentry from '@sentry/browser';
import FullStoryIntegration from '@sentry/fullstory';

FullStory.init({ orgId: process.env.REACT_APP_FULLSTORY_ORG });

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  integrations: [
    new FullStoryIntegration(
      process.env.REACT_APP_SENTRY_ORG,
    ),
  ],
});

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);




// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
