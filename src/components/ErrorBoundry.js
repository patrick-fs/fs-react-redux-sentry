/* global FS */
import React, { Component } from 'react';
import Error from './Error'
import recordError from '../api/error';

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
    recordError(error, errorInfo);
  }

  render() {
    if (this.state.error) {
      //render fallback UI
      return (
        <Error error={this.state.error} />
      );
    } else {
      //when there's not an error, render children untouched
      return this.props.children;
    }
  }
}

export default ErrorBoundary;