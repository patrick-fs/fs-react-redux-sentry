import React, { Component } from 'react';
import * as Sentry from '@sentry/browser';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, eventId: null };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error });
    Sentry.captureException(error);
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