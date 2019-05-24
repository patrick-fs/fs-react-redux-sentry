import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import * as Sentry from '@sentry/browser';
import { doClearError } from '../actions/error';

const Error = ({onClear, error}) => {

  useEffect(() => {
    setTimeout(() => {
      onClear();
    }, 3000);
  });

  const onClick = () => {
    Sentry.showReportDialog({ eventId: error.sentryEventId });
  };

  return (
    <>
    {error && 
      <div><a href="#" onClick={onClick}>Report feedback</a></div>
    }
    </>
  );
};

const mapDispatchToProps = dispatch => ({
  onClear: () => dispatch(doClearError())
});

const mapStateToProps = state => ({
  error: state.errorState
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Error);