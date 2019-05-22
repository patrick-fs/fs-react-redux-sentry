import React from 'react';
import { connect } from 'react-redux';
import * as Sentry from '@sentry/browser';

const Error = ({error}) => {  

  const onClick = () => {
    console.log('show dialog')
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

const mapStateToProps = state => ({
  error: state.errorState
});

export default connect(
  mapStateToProps
)(Error);