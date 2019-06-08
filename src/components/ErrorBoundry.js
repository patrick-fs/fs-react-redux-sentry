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
        <>
          <h1>Something bad happened and we've been notified</h1>
        </>
      );
    } else {
      //when there's not an error, render children untouched
      return this.props.children;
    }
  }
}

export default ErrorBoundary;