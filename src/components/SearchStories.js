import React, { useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import { Button } from './Button';
import { doFetchStoriesAsync } from '../actions/story';
import { doLoadQuery } from '../actions/localStorage';

const SearchStories = ({ onFetchStories, onFetchQuery, query }) => {
  useEffect(() => {
    onFetchQuery();
  });
  
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
          defaultValue={query}
        />
      <Button type="submit">
        Search
      </Button>
    </form>
  );
}

const mapStateToProps = ({ localStorageState }) => ({
  query: localStorageState,
});

const mapDispatchToProps = dispatch => ({
  onFetchStories: query => dispatch(doFetchStoriesAsync(query)),
  onFetchQuery: () => dispatch(doLoadQuery()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchStories);