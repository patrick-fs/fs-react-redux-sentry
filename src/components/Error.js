import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { doClearError } from '../actions/error';

const Error = ({onClear, error, timeout = 3000}) => {

  useEffect(() => {
    setTimeout(() => {
      onClear();
    }, timeout);
  });

  const toastClass = `toast ${error ? 'show' : ''}`;

  return (
    <div className={toastClass}>An error occurred - we've been notified.</div>
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