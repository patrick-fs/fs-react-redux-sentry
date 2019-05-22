/* global FS */
import React, { Component } from 'react';
import * as Sentry from '@sentry/browser';

// Sentry.init({
//  dsn: "https://<key>@sentry.io/<project>"
// });
// should have been called before using it here
// ideally before even rendering your react app

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, eventId: null };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error });
    Sentry.withScope(scope => {
      scope.setExtras(errorInfo);
      
      // capture FullStory session URL at the moment in time the error was thrown
      // TODO: host an official FullStory package in npm so FS can be imported as a module
      if (window.FS && FS.getCurrentSessionURL) {
        scope.setExtra('fullstory', FS.getCurrentSessionURL(true));
      }
      
      const eventId = Sentry.captureException(error);
      this.setState({eventId})        
    });
  }

  render() {
    if (this.state.error) {
      //render fallback UI
      return (
        <a href="#" onClick={() => Sentry.showReportDialog({ eventId: this.state.eventId })}>Report feedback</a>
      );
    } else {
      //when there's not an error, render children untouched
      return this.props.children;
    }
  }
}

export default ErrorBoundary;