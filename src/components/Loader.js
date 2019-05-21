import React from 'react';
import { connect } from 'react-redux';

const Loader = ({loading}) =>
  <>
    {loading && 
      <div style={{position: 'relative'}}>Loading...</div>
    }
  </>

const mapStateToProps = state => ({
  loading: state.loaderState
});

export default connect(
  mapStateToProps
)(Loader);