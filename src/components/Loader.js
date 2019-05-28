import React from 'react';
import { connect } from 'react-redux';

const Loader = ({loading}) =>
  <>
    {loading && 
      <div className="loader">Loading...</div>
    }
  </>

const mapStateToProps = state => ({
  loading: state.loaderState
});

export default connect(
  mapStateToProps
)(Loader);