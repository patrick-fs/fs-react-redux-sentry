import React, { useRef, useState } from 'react';
import { connect } from 'react-redux';
import { Button } from './Button';
import { doFetchStoriesAsync } from '../actions/story';

const SearchStories = ({ onFetchStories }) => {
  const inputEl = useRef(null);
  const onSubmit = e => {
    onFetchStories(inputEl.current.value);
    e.preventDefault();
  };

  return (
    <form onSubmit={onSubmit}>
      <input
          type="text"
          ref={inputEl}
          defaultValue=""
        />
      <Button type="submit">
        Search
      </Button>
    </form>
  );
}

const mapDispatchToProps = dispatch => ({
  onFetchStories: query => dispatch(doFetchStoriesAsync(query)),
});

export default connect(
  null,
  mapDispatchToProps
)(SearchStories);